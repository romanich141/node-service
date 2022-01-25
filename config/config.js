require('dotenv').config();

module.exports = {
    secret_key: 'proxy',
    // ssl: process.env.SSL,
    // port: process.env.PROXY_PORT,
    on: {
        connection: 'connection',
        auth: 'auth',
        logout: 'logout',
        disconnect: 'disconnect'
    },
    emit: {
        connect: 'connect',
        info: 'info'
    },
};