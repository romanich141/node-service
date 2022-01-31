require('dotenv').config();

const { 
    NODE_PORT, 
    REDIS_HOST,
    REDIS_PORT,
    SSL, } = process.env;

module.exports = {
    secret_key: 'proxy',
    ssl: SSL,
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
            host: REDIS_HOST,
            port: REDIS_PORT,
        },
        subscriber: ['laravel_database_po_event'],
        event: 'export_to_excel_po_event',
    }
};