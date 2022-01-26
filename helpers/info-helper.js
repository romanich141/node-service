const conf = require('../config/config.js');

const info = ({ 
    socket, 
    message, 
}) => {
    try {
        socket.emit(conf.emit.info, message);
    } catch (err) {
        return console.log(err);
    }
};

module.exports = info;