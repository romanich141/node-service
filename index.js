require('dotenv').config();
const { Server } = require("socket.io");
const http = require('http');
const express = require('express');
const { verifyToken, getuserIdFromToken } = require('./helpers/token-helper.js');
const sendInfo = require('./helpers/info-helper.js')
const config = require('./config/config.js')
const messages = require('./messages/index.js');
const app = express();
const server = http.createServer(app);


const ssl = () => {
    if (config.ssl === "true") {
        const https = require('https');    
        
        const serverHttps = https.createServer({
            key: fs.readFileSync('./config/keys/privkey.pem'),
            cert: fs.readFileSync('./config/keys/fullchain.pem'),
        }, app);
        serverHttps.listen(config.port);
    
        return serverHttps;
    }
            
    return config.port;
};

// options socket server
const options = {
    transports: ["websocket"]
};

const io = new Server(server, options);

// run when new user is connected
io.on(config.on.connection, (socket) => {
    console.log("New connection", socket.id);

    let room = null;
    let token = null;

    socket.on(config.on.test, data => {
        
        sendInfo({ socket, message: data });
    })

    // run when user is auth
    socket.on(config.on.auth, (data) => {
        token = data.token;
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
        next();
    } catch (err) {
        return next(new Error(messages.error_server));
    }
});

// start serve
server.listen(ssl())

// todo ssl //done
// parse token //done
// add
// ADD TOKEN TO HEADERS