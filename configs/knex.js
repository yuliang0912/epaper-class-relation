/**
 * Created by yuliang on 2016/11/4.
 */

const kenx = require('knex')

var dbConfig =
    process.env.NODE_ENV === 'production'
        ? require('./dbconfig_production.json')
        : process.env.NODE_ENV === 'test'
        ? require('./dbconfig_test.json')
        : require('./dbconfig_development.json')

var newRelationKnex = kenx({
    client: 'mysql',
    connection: {
        host: dbConfig.classRelation.config.host,
        user: dbConfig.classRelation.username,
        password: dbConfig.classRelation.password,
        database: dbConfig.classRelation.database
    },
    pool: {
        min: dbConfig.classRelation.config.minConnections,
        max: dbConfig.classRelation.config.maxConnections,
    },
    acquireConnectionTimeout: dbConfig.classRelation.config.maxIdleTime,
    debug: false
});

var oldRelationKnex = kenx({
    client: 'mysql',
    connection: {
        host: dbConfig.oldRelation.config.host,
        user: dbConfig.oldRelation.username,
        password: dbConfig.oldRelation.password,
        database: dbConfig.oldRelation.database
    },
    pool: {
        min: dbConfig.oldRelation.config.minConnections,
        max: dbConfig.oldRelation.config.maxConnections,
    },
    acquireConnectionTimeout: dbConfig.oldRelation.config.maxIdleTime,
    debug: false
});

var userInfo = kenx({
    client: 'mysql',
    connection: {
        host: dbConfig.userInfo.config.host,
        user: dbConfig.userInfo.username,
        password: dbConfig.userInfo.password,
        database: dbConfig.userInfo.database,
        charset: 'utf8'
    },
    pool: {
        min: dbConfig.userInfo.config.minConnections,
        max: dbConfig.userInfo.config.maxConnections,
    },
    acquireConnectionTimeout: dbConfig.userInfo.config.maxIdleTime,
    debug: false // process.env.NODE_ENV !== 'production'
})

module.exports = {
    newRelationKnex: newRelationKnex,
    oldRelationKnex: oldRelationKnex,
    userInfo: userInfo
}