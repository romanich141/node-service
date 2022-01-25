const proxyConf = require('../config/config.js');

const info = (io, message, id) => {
    try {
        io.sockets.connected[id].emit(proxyConf.emit.info, message);
    } catch (err) {
        return console.log(err);
    }
};

module.exports = info;