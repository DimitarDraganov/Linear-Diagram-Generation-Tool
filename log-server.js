const express = require('express');
const parser = require('body-parser').text();
const winston = require('winston');
const http = require('http');
const app = express();

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
           filename: 'output.txt',
           level: 'debug',
           format: winston.format.simple()
        })
    ]
});

app.post('/log', parser, (req, res) => {
    logger.debug(req.body);
    console.log(req.body);

});

app.use(express.static(`${__dirname}/`));

http.createServer(app).listen(3000, () => {
    console.log('listen 3000;');
});