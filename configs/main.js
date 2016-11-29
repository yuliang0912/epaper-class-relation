"use strict";
var path = require('path')

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 8896;
var host = 'http://localhost' + (port != 80 ? ':' + port : '');

var DEBUG = env !== 'production'

module.exports = {
    //http://koajs.com/#application
    name: "epaper-class-relation",
    keys: ['87b6a58e4d127b89373df32dcbb0fdb22b0c42ce'],
    env: env,
    port: port,
    //https://github.com/koajs/static#options
    static: {
        directory: path.resolve(__dirname, '../web')
    },
    //https://github.com/koajs/body-parser#options
    bodyparser: {},
    auth: {},
    view: {
        root: path.resolve(__dirname, '../web'),
        cache: DEBUG ? false : 'memory',
    },
    redisConfig: {
        isOpen: true,
        connOptions: {
            host: '192.168.2.111',
            port: 6379,
            options: {
                string_numbers: true,
                url:"redis://root:ciwong567@"
            }
        },
    },
}