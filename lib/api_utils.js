/**
 * Created by Administrator on 2016/7/8 0008.
 */

'use strict'

var uuid = require('node-uuid');

var utils = module.exports = {};

utils.createInt16Number = function () {
    return Math.floor(Math.random() * 10000000000000000);
}

utils.getUuid = function () {
    return uuid.v1();
}

utils.isNullOrUndefined = function (str) {
    return str === undefined || str === null;
}

utils.convert = function (model) {
    var type = toString.call(model)
    if (type === '[object Object]') {
        Object.keys(model).forEach(item=> {
            if (toString.call(model[item]) === '[object Date]') {
                model[item] = model[item].toUnix()
            }
        });
    } else if (type === '[object Date]') {
        model = model.toUnix()
    } else if (type === '[object Array]') {
        model.forEach(utils.convert)
    }
    return model
}

utils.convertToPage = function (page, pageSize, totalItem, pageList) {
    return {
        page,
        pageSize,
        totalCount: totalItem,
        pageCount: Math.ceil(totalItem / pageSize),
        pageList: pageList
    }
}


String.prototype.curString = function (length, additional = '', startIndex = 0) {
    return this.length > length
        ? this.substr(startIndex, length) + additional
        : this.substr(startIndex, length)
}

Array.prototype.groupBy = function (key) {
    var batchGroup = {};
    this.forEach(item=> {
        if (!batchGroup[item[key]]) {
            batchGroup[item[key]] = [];
        }
        batchGroup[item[key]].push(item);
    })
    return Object.keys(batchGroup).map(item=> {
        return {key: item, value: batchGroup[item]}
    });
}

Date.prototype.toUnix = function () {
    return this.valueOf() / 1000;
}