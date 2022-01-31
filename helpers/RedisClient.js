const { createClient } = require('redis');

class RedisClient {
    constructor({ host, port = 6379, }) {
        this.host = host;
        this.port = port;
        this.client = null;
    }
    
    createClient() {
        this.client = createClient({
            url: `redis://${ this.host }:${ this.port }`
        })
    }
    
    async connect() {
        await this.client.connect();
    }

    async subscribe(events, cb) {
        await this.client.subscribe(events, cb);
    }

    async unsubscribe(events) {
        await this.client.unsubscribe(events);
    }
}

module.exports = RedisClient;