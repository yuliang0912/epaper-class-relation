/**
 * Created by yuliang on 2016/10/14.
 */

'use strict'

module.exports = function () {
    var dataBase = {}

    //分页查询
    dataBase.getPageList = function (condition, page, pageSize, orderBy, option) {
        var settings = {
            where: condition,
            offset: (page - 1) * pageSize,
            limit: pageSize,
            order: orderBy
        }
        return this.findAndCount(Object.assign(settings, option || {raw: true})).then(result => {
            return {
                page,
                pageSize,
                totalCount: result.count,
                pageCount: Math.ceil(result.count / pageSize),
                pageList: result.rows
            }
        })
    }

    return dataBase
}







