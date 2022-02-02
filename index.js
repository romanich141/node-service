require('dotenv').config();
const { Server } = require("socket.io");
const http = require('http');
const express = require('express');
const { verifyToken, getuserIdFromToken } = require('./helpers/token-helper.js');
const sendInfo = require('./helpers/info-helper.js')
const config = require('./config/config.js')
const messages = require('./messages/index.js');
const app = express();
const RedisClient = require("./helpers/RedisClient.js");
const fs = require("fs");

// create redis lint and connecting to redis
(async () => {    
    
    const handlerRedisEvent = (data) => {
        const parseData = JSON.parse(data) || {};
        const { uid: room, method, } = parseData.data;
    
        if (method === config.redis.event) {
            io.to(room).emit(method, parseData.data);
        }
    
        console.log(data)
    }

    try {
        const redis = new RedisClient(config.redis.setting) 
        redis.createClient();
        await redis.connect();
        await redis.subscribe(config.redis.subscriber, handlerRedisEvent);
    } catch (error) {
        throw error;
    }
})()

const ssl = () => {
    if (config.ssl === "true") {
        const https = require('https');    
        
        const options = {
            key:   fs.readFileSync('./config/keys/2200199937-00.pem'),
            cert:  fs.readFileSync('./config/keys/websocket_gerchikco_com.crt'),
            ca:  fs.readFileSync('./config/keys/websocket_gerchikco_com.ca-bundle'),
        };
          
        const serverHttps = https.createServer(options, app);
        serverHttps.listen(config.port);
    
        return serverHttps;
    }
            
    const serverHttp = http.createServer({}, app);
    serverHttp.listen(config.port);
    
    return serverHttp;
};

// options socket server
const options = {
    transports: ["websocket"]
};

const io = new Server(ssl(), options);

// run when new user is connected
io.on(config.on.connection, (socket) => {
    let room = null;
    let token = null;
    
    console.log("New connection", socket.id);
    
    // run when user is auth
    socket.on(config.on.auth, () => {
        token = socket.handshake.auth.token;
        room = getuserIdFromToken(token);
        
        let message = messages.wrong_auth;

        if (token && verifyToken(token)) {
            // join socket to "room" room
            socket.join(room);
            message = messages.success_auth;
        }
        
        sendInfo({ socket, message });
    })

    // run when user is logout
    socket.on(config.on.logout, () => {
        if (room) {
            // make all Socket instances leave the "room"
            io.socketsLeave(room);
            // make all Socket instances in the "room" room disconnect (and close the low-level connection)
            io.in(room).disconnectSockets(true);
        }

        console.log(`user ${ socket.id } is logout`);
    })

    // run when user is disconnect
    socket.on(config.on.disconnect, () => {
        // leave socket from "room" room
        io.in(socket.id).socketsLeave(room);

        console.log(`user ${ socket.id } is disconnected`)
    })
});

// middleware
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if (verifyToken(token)) {
            next();
        }
        
    } catch (err) {
        return next(new Error(messages.error_server));
    }
});
