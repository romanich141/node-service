require('dotenv').config();
const { Server } = require("socket.io");
const http = require('http');
const express = require('express');
const { verifyToken } = require('./helpers/token-helper.js');
const sendInfo = require('./helpers/info-helper.js')
const config = require('./config/config.js')
const messages = require('./messages/index.js');
const app = express();
const server = http.createServer(app);

const PORT = process.env.NODE_PORT;

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
        // console.log({ data });

        sendInfo({ socket, message: data });
    })

    // run when user is auth
    socket.on(config.on.auth, (data) => {
        token = data.token;
        room = data.room;

        let message = messages.wrong_auth;

        if (token && verifyToken(token)) {
            // join socket to "room" room
            socket.join(room);
            message = messages.success_auth;
        }
        
        sendInfo({ socket, message });
    })

    // run when user is logout
    socket.on(config.on.logout, (data) => {
        const { room } = data;

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
server.listen(PORT, () => {
    console.log(`server started in port ${ PORT }`)
})