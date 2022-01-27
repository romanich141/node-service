require('dotenv').config();

module.exports = {
    secret_key: 'proxy',
    // ssl: process.env.SSL,
    port: process.env.NODE_PORT,
    on: {
        connection: 'connection',
        auth: 'auth',
        logout: 'logout',
        disconnect: 'disconnect',
        test: 'test',
    },
    emit: {
        connect: 'connect',
        info: 'info'
    },
};