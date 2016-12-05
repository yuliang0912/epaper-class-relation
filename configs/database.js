/**
 * Created by yuliang on 2016/9/30.
 */

var Sequelize = require('sequelize');
var sequelizeExpand = require('../libs/sequelize_expand')()
var dbConfig = process.env.NODE_ENV === 'production'
    ? require('./dbconfig_production.json')
    : require('./dbconfig_development.json');

var DbContents = function () {
    var relationDbConfig = dbConfig.classRelation;
    var relationSequelize = new Sequelize(relationDbConfig.database, relationDbConfig.username, relationDbConfig.password, relationDbConfig.config);

    var models = {
        schoolInfo: require('../models/school')(relationSequelize),
        classInfo: require('../models/class')(relationSequelize),
        classMembers: require('../models/class_member')(relationSequelize),
    }
    InitDbModels(models);
    return Object.assign(relationSequelize, models);
}

function InitDbModels(models) {
    Object.keys(models).forEach(item=> {
        models[item] = Object.assign(models[item], sequelizeExpand)
        if (typeof models[item].associate === 'function') {
            models[item].associate(models);
        }
    });
}

module.exports = function () {
    return new Promise(function (resolve, reject) {
        resolve(getDbContents());
    });
}

var getDbContents = module.exports.getDbContents = function () {
    return {
        Sequelize: Sequelize,
        relation: DbContents(),
    }
}





