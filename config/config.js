require('dotenv').config();

const { 
    NODE_PORT, 
    REDIS_DOCKER_NAME,
    REDIS_PORT } = process.env;

module.exports = {
    secret_key: 'proxy',
    // ssl: process.env.SSL,
    port: NODE_PORT,
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

    redis: {
        setting: {
            host: REDIS_DOCKER_NAME,
            port: REDIS_PORT,
        },
        subscriber: ['laravel_database_po_event'],
        event: 'export_to_excel_po_event',
    }
};