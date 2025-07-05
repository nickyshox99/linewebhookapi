'use strict';

var dbConn = require('../../config/db.config');
const Secret = require('../../config/secret');

const jwt = require('jsonwebtoken');
const tableName = 'am_users'
const tableKey = 'am_username'

//User object create
var AdminList = function(userlist) {
    this.am_username = userlist.am_username;
    this.am_password = userlist.am_password;
    this.am_fullname = userlist.am_fullname;
    this.am_rank = userlist.am_rank;
    this.am_group = userlist.am_group;
    this.is_parent = userlist.is_parent;
    this.parent = userlist.parent;
    this.am_status = userlist.am_status;
};

AdminList.create = function(newUser, result) {
    console.log(newUser);
    const datas = dbConn.query("INSERT INTO " + tableName + " (am_username,am_password)VALUES(?,?) ", [newUser.am_username, newUser.am_password]);
    dbConn.end;
    return datas.insertId;
};

AdminList.findById = function(id, result) {   
    const datas = dbConn.query("Select * from " + tableName + " where " + tableKey + " = ?", [id]);
    dbConn.end;
    // console.log(datas);
    return datas[0]?datas[0]:[];
};

AdminList.login = function(id, password, result) {
    const datas = dbConn.query("SELECT * FROM " + tableName + " WHERE " + tableKey + " = ? AND am_password= ?", [id, password]);    
    dbConn.end;
    console.log(datas.values);
    return datas;    
}

AdminList.isAuthenicated = function(userid, authToken, result) {

    // console.log("userid :", userid);
    // console.log("authToken :", authToken);

    try {
        let jwtToken = jwt.verify(authToken, Secret.SecretKey);
        // console.log("Decode userid :", jwtToken.userid);        
        if (jwtToken.userid == userid) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

AdminList.AddAllowIPAdddress = function(ipAddress)
{
    console.log(ipAddress);
    const datas = dbConn.query("INSERT INTO ip_allowed (ip_address)VALUES(?) ", [ipAddress]);
    dbConn.end;
    return datas;
}

AdminList.findByIdWithGroup = async function(id, result) {   
    try {        
        let sqlStr = "Select "+tableName+".*,am_group.permission,am_group.default_page,am_group.name from " + tableName;
        sqlStr += " LEFT JOIN am_group ON am_group.id="+ tableName+ ".am_group ";
        sqlStr += " WHERE "+ tableName+ "."+tableKey+"='"+id+"'";
        console.log(sqlStr);
        const datas = dbConn.query(sqlStr);    
        return datas;
    } catch (error) {
        console.log(error);
        return [];
    }
    
};


module.exports = AdminList;