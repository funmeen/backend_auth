const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('/etc/ssl/private.key'),
    cert: fs.readFileSync('/etc/ssl/certificate.crt')
};

const server = https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('Hello, HTTPS World!');
});

server.listen(443);
