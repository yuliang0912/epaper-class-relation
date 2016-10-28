/**
 * Created by yuliang on 2016/10/24.
 */

var redis = require('redis');
var Promise = require('bluebird')
var redisConfig = require('../../configs/main').redisConfig
const prefix = 'c:relation:'

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

function cache() {
    this.client = getClient()
}

cache.prototype.get = function (key) {
    if (!this.client) {
        return Promise.resolve(null)
    }
    return this.client.getAsync(key)
}

cache.prototype.getModel = function (key) {
    if (!this.client) {
        return Promise.resolve(null)
    }
    return this.client.getAsync(key).then(JSON.parse)
}

cache.prototype.set = function (key, value) {
    if (!this.client || value === null || value === undefined) {
        return Promise.resolve(null)
    }
    return this.client.setAsync(key, value)
}

cache.prototype.setModel = function (key, value) {
    if (!this.client || !value) {
        return Promise.resolve(null)
    }
    return this.client.setAsync(key, JSON.stringify(value))
}

cache.prototype.del = function (key) {
    if (!this.client) {
        return Promise.resolve(null)
    }
    return this.client.delAsync(key)
}

cache.prototype.getKeys = {
    classInfo: function (classId) {
        return prefix + classId
    },
    classMembers: function (classId) {
        return prefix + 'members:' + classId
    },
    memberInfo: function (classId, userId) {
        return prefix + 'member:' + classId + ':' + userId
    },
    userClasses: function (userId) {
        return prefix + 'member:class:' + userId
    }
}

var client;
function getClient() {
    if (client === undefined && redisConfig.isOpen) {
        client = createClient()
    }
    return client
}

function createClient(host) {
    redisConfig.connOptions.options.retry_strategy = retry_strategy
    var newClient = redis.createClient(redisConfig.connOptions.port, host || redisConfig.connOptions.host, redisConfig.connOptions.options)
    clientEvents(newClient)
    return newClient
}

function clientEvents(currClient) {
    currClient.on("error", function (err) {
        console.log("redis error :" + err);
    });
    currClient.on('end', function () {
        client = null
        redisConfig.connOptions.host = '192.168.40.150'
        setTimeout(createClient, 10000)
    });
    currClient.on('ready', function () {
        redisConfig.isOpen = true;
        console.log("redis is on ready");
        client = currClient
    });
}

function retry_strategy(options) {
    console.log("==================redis重新连接中======================")
}


module.exports = cache