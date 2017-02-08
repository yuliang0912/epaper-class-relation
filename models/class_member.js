/**
 * Created by yuliang on 2016/9/30.
 */

var Sequelize = require('sequelize');

module.exports = function (relationSequelize) {
    return relationSequelize.define(
        'classMembers',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            userName: {
                type: Sequelize.STRING,
            },
            userRole: {
                type: Sequelize.INTEGER,
            },
            subjectId: {
                type: Sequelize.INTEGER,
            },
            mobile: {
                type: Sequelize.STRING,
            },
            isMaster: {
                type: Sequelize.INTEGER,
            },
            schoolId: {
                type: Sequelize.INTEGER
            },
            classId: {
                type: Sequelize.INTEGER,
            },
            brandId: {
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
                defaultValue: 0
            }
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "classMember",
            classMethods: {
                associate: function (models) {
                    this.belongsTo(models.classInfo, {foreignKey: 'classId'});
                    this.belongsTo(models.schoolInfo, {foreignKey: 'schoolId'});
                }
            }
        }
    );
}