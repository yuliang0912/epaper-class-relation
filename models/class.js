/**
 * Created by yuliang on 2016/9/30.
 */

var Sequelize = require('sequelize');

module.exports = function (relationSequelize) {
    return relationSequelize.define(
        'classInfo',
        {
            classId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            className: {
                type: Sequelize.STRING
            },
            schoolId: {
                type: Sequelize.INTEGER
            },
            schoolName: {
                type: Sequelize.STRING
            },
            classYear: {
                type: Sequelize.INTEGER,
            },
            grade: {
                type: Sequelize.INTEGER,
            },
            period: {
                type: Sequelize.INTEGER,
            },
            studentNum: {
                type: Sequelize.INTEGER,
            },
            teacherNum: {
                type: Sequelize.INTEGER,
            },
            brandId: {
                type: Sequelize.INTEGER,
            },
            createUserId: {
                type: Sequelize.INTEGER,
            },
            createDate: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updateDate: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            status: {
                type: Sequelize.INTEGER,
            }
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "classInfo",
            classMethods: {
                associate: function (models) {
                    this.belongsTo(models.schoolInfo, {foreignKey: 'schoolId'});
                    this.hasMany(models.classMembers, {foreignKey: 'classId'});
                }
            }
        }
    );
}