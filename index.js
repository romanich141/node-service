require('dotenv').config();

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const verifyToken = require('./helper.js');
const { addUserSocketIdToRoom, removeUserSocketIdFromRoom, getRooms, removeRoom } = require("./rooms.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.NODE_PORT;

// run when new user connected
io.on('connection', (socket) => {
    console.log("New connection", socket.id);

    let uid = null;
    let token = null;

    // run when user is auth
    socket.on("auth", (data) => {
        token = data.token;
        uid = data.uid;

        if (verifyToken(token)) {
            addUserSocketIdToRoom(socket.id, uid);
            socket.join(uid)
        }
    })

    // run when user is logout
    socket.on("logout", (data) => {
        const { uid } = data;
        
        socket.leave(uid);
        removeRoom(uid);
    })

    // run when user is disconnect
    socket.on("disconnect", () => {
        removeUserSocketIdFromRoom(socket.id, uid);

        if (!getRooms.length) {
            removeRoom(uid);
        }

        console.log(`user ${ socket.id } is disconnected`)
    })
});

server.listen(PORT, () => {
    console.log(`server started in port ${ PORT }`)
})