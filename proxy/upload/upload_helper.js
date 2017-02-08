/**
 * Created by yuliang on 2017/1/2.
 */

'use strict';

var oss = require('ali-oss').Wrapper;

var client = new oss({
    accessKeyId: "1vcKwSuGcxa4xkyN",
    accessKeySecret: "Oo0WzBlTQ2zmPfgYGBbBBKuu6nBCTE",
    bucket: "epbank",
    region: "oss-cn-shenzhen"
});

module.exports = {
    client: function () {
        return client;
    },
    upload: function (key, stream, progress) {
        return client.upload(key, stream, {progress: progress})
    }
};

