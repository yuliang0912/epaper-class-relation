/**
 * Created by yuliang on 2016/6/10.
 */

"use strict"
var _ = require('lodash');
var apiCode = require('./api_code_enum');
var co = require('co');
var hostIpAddress;

function buildReturnObject(ret, errCode, msg, data) {
    var result = {ret: apiCode.retCodeEnum.success, errcode: apiCode.errCodeEnum.success, msg: "success"};
    if (_.isNumber(ret)) {
        result.ret = ret;
    }
    if (_.isNumber(errCode)) {
        result.errcode = parseInt(errCode);
    }
    result.msg = (msg || "success").toString();

    if (!Object.is(data, undefined)) {
        result.data = data;
    }
    return result;
}

function getIPAdress() {
    if (!hostIpAddress) {
        var interfaces = require('os').networkInterfaces();
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && !alias.internal) {
                    hostIpAddress = alias.address;
                } else {
                    hostIpAddress = '0.0.0.0';
                }
            }
        }
    }
    return hostIpAddress;
}

//定义apiResponse的输出响应结果
module.exports = function (app) {
    return co.wrap(function *(ctx, next) {
        console.log(ctx.request.url)
        if (ctx.request.url === "/favicon.ico") {
            ctx.status = 200;
            return;
        }
        ctx.success = (data) => {
            ctx.body = buildReturnObject(apiCode.retCodeEnum.success, apiCode.errCodeEnum.success, 'success', data);
        };
        ctx.error = ctx.apiError = (msg, errCode = apiCode.errCodeEnum.apiError) => {
            throw Object.assign(new Error(msg || '接口口内部异常'),
                {errCode: _.isNumber(errCode) ? errCode : apiCode.errCodeEnum.apiError});
        };
        ctx.validateError = function () {
            var msg = "参数校验失败,details:" + JSON.stringify(this.errors);
            throw Object.assign(new Error(msg),
                {errCode: apiCode.errCodeEnum.paramTypeError});
        };
        ctx.allow = (passMethod = 'GET')=> {
            var validateResult = false;
            if (_.isString(passMethod)) {
                passMethod = passMethod.toUpperCase();
                validateResult = passMethod === 'ALL' || ctx.req.method === passMethod;
            }
            else if (Array.isArray(passMethod)) {
                validateResult = passMethod.some(item => item.toUpperCase() === ctx.req.method);
            }
            if (!validateResult) {
                throw Object.assign(new Error("接口不支持" + ctx.req.method + "请求"),
                    {errCode: apiCode.errCodeEnum.refusedRequest});
            }
            return ctx;
        };
        ctx.allowJson = (()=> {
            if (ctx.headers['content-type'] !== 'application/json') {
                ctx.error('content-type错误,必须是application/json');
            }
            return ctx;
        });
        try {
            ctx.set("X-Response-For", getIPAdress());
            yield next();
            if (ctx.response.status === 404 && ctx.body === undefined) {
                ctx.body = buildReturnObject(apiCode.retCodeEnum.success,
                    apiCode.errCodeEnum.notReturnData, 'success', null);
            }
        } catch (e) {
            if (e == undefined) {
                e = new Error("未定义的错误")
            }
            ctx.body = buildReturnObject(e.retCode || apiCode.retCodeEnum.serverError,
                e.errCode || apiCode.errCodeEnum.autoSnapError, e.toString());
        }
    });
} 






