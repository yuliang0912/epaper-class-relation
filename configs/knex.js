/**
 * Created by yuliang on 2016/11/4.
 */

var dbConfig = process.env.NODE_ENV === 'production'
    ? require('./dbconfig_production.json')
    : require('./dbconfig_development.json');

var newRelationKnex = require('knex')({
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
    debug: process.env.NODE_ENV !== 'production'
});

var oldRelationKnex = require('knex')({
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
    //debug: process.env.NODE_ENV !== 'production'
});

module.exports = {
    newRelationKnex: newRelationKnex,
    oldRelationKnex: oldRelationKnex
}