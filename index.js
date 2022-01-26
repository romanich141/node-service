require('dotenv').config();

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { verifyToken } = require('./helpers/token-helper.js');
const sendInfo = require('./helpers/info-helper.js')
const config = require('./config/config.js')
const messages = require('./messages/index.js');

const { addUserSocketIdToRoom, removeUserSocketIdFromRoom, getRooms, removeRoom } = require("./rooms.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.NODE_PORT;

// run when new user connected
io.on(config.on.connection, (socket) => {
    console.log("New connection", socket.id);

    let uid = null;
    let token = null;

    socket.on(config.on.test, data => {
        console.log({ data });

        sendInfo(socket, data);
    })

    // run when user is auth
    socket.on(config.on.auth, (data) => {
        token = data.token;
        uid = data.uid;
       
        let sendMsg = messages.wrong_auth;

        if (token && verifyToken(token)) {
            addUserSocketIdToRoom(socket.id, uid);
            socket.join(uid);
            sendMsg = messages.success_auth;
        }

        sendInfo(socket, sendMsg);
    })

    // run when user is logout
    socket.on(config.on.logout, (data) => {
        let sendMsg = messages.wrong_logout;

        const { uid } = data;
        
        if (uid) {
            socket.leave(uid);
            removeRoom(uid);
            sendMsg = proxyMessage.success_logout;
        }

        sendInfo(socket, uid, sendMsg, socket.id);
    })

    // run when user is disconnect
    socket.on(config.on.disconnect, () => {
        removeUserSocketIdFromRoom(socket.id, uid);

        if (!getRooms.length) {
            removeRoom(uid);
        }

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

server.listen(PORT, () => {
    console.log(`server started in port ${ PORT }`)
})