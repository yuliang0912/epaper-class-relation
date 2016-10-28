/**
 * Created by yuliang on 2016/10/19.
 */

var redis = require('redis');
var bluebird = require('bluebird')
var redisConfig = require('../../configs/main').redisConfig
var client;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

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
    console.log("BEGIN:=========================redis重新连接======================")
    console.log(options)
    console.log("END:===========================redis重新连接======================")
}

function createClient(host) {
    redisConfig.connOptions.options.retry_strategy = retry_strategy
    var newClient = redis.createClient(redisConfig.connOptions.port, host || redisConfig.connOptions.host, redisConfig.connOptions.options)
    clientEvents(newClient)
    return newClient
}

const prefix = 'c:relation:'

module.exports.getKeys = {
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

module.exports.setData = {
    hsetModel: function (key, model) {
        var commendParams = [key]
        Object.keys(model).forEach(item=> {
            commendParams.push(item)
            commendParams.push(model[item])
        });
        if (commendParams.length == 1) {
            return
        }
        return client && client.hmsetAsync(commendParams)
    },
    setModel: function (key, model) {
        return client && client.setAsync(key, JSON.stringify(model))
    }
}

module.exports.getClient = function () {
    if (client === undefined && redisConfig.isOpen) {
        client = createClient()
    }
    return client
}