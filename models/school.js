/**
 * Created by yuliang on 2016/9/30.
 */

var Sequelize = require('sequelize');

module.exports = function (relationSequelize) {
    return relationSequelize.define(
        'schoolInfo',
        {
            schoolId: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            schoolName: {
                type: Sequelize.STRING
            },
            schoolArea: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING
            },
            period: {
                type: Sequelize.INTEGER,
            },
            masterName: {
                type: Sequelize.STRING,
            },
            masterMobile: {
                type: Sequelize.STRING,
            },
            createDate: {
                type: Sequelize.DATE,
            },
            status: {
                type: Sequelize.INTEGER,
            }
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "schoolInfo",
            classMethods: {
                associate: function (models) {
                    this.hasMany(models.classInfo, {foreignKey: 'schoolId'});
                    this.hasMany(models.classMembers, {foreignKey: 'schoolId'});
                }
            }
        }
    );
}