const auth = require('basic-auth');
// const bcrypt = require('bcrypt');

// const saltRounds = 10;
// const hashedPassword = bcrypt.hashSync(process.env.API_PASSWORD, saltRounds);

function checkCredentials(username, password) {
     return username === 'admin'&& password === '123123';
    // return username === process.env.BASIC_AUTH_USERNAME_XRIDE && password === process.env.BASIC_AUTH_PASSWORD_XRIDE;
}

function xrideBasicAuth(req, res, next) {
    const credentials = auth(req);
    if (!credentials || !checkCredentials(credentials.name, credentials.pass)) {
        res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
        res.status(401).send('Authentication required');
    } else {
        next();
    }
}

module.exports = { xrideBasicAuth };
