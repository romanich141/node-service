// https://www.npmjs.com/package/jsonwebtoken
require('dotenv').config();

const jwt = require('jsonwebtoken');

const getuserIdFromToken = (token) => {
    return jwt.verify(
        token, 
        process.env.JWT_SECRET,
        (error, payload) => {
            if (error === null) return payload.sub;
        }
    )
}

const verifyToken = (token) => {
    const checkExpireToken = (exp) => {
        return Date.now() < exp * 1000;
    }
    // jwt.verify( token, secretOrPublicKey, [options, callback] )
    return jwt.verify(
        token, 
        process.env.JWT_SECRET,
        (error, payload) => {
            if (error === null && checkExpireToken(payload.exp)) { 
                return true; 
            }
    })
}

module.exports = { 
    verifyToken, 
    getuserIdFromToken,
};