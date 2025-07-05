'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('../models/cryptof.model');
var crypto = require('crypto'); 

const jwt = require('jsonwebtoken');
const tableName = 'am_users'
const tableKey = 'am_username'

//User object create
var StaffSetting = function(adminBankList) {
    // this.am_username = userlist.am_username;
    // this.am_password = userlist.am_password;
    // this.am_fullname = userlist.am_fullname;
    // this.am_rank = userlist.am_rank;
    // this.am_group = userlist.am_group;
    // this.is_parent = userlist.is_parent;
    // this.parent = userlist.parent;
    // this.am_status = userlist.am_status;
};

StaffSetting.findAll = function(searchword, result) {   

    searchword=searchword?searchword:"";

    let sqlStr = "Select "+tableName+".* ,am_group.name  ";        
    sqlStr += " FROM "+tableName;        
    sqlStr += " INNER JOIN am_group ON am_group.id="+tableName+".am_group ";
    sqlStr += " where 1=1 AND ("+tableKey+" like '%"+searchword+"%') ";
    
    let datas = dbConn.query(sqlStr);

    dbConn.end;
    return datas;
};

StaffSetting.findByID = function(id, result) {   
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " INNER JOIN am_group ON am_group.id="+tableName+".am_group ";
    sqlStr += " where 1=1 AND ("+tableKey+" = "+id+") ";
    
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    dbConn.end;
    return datas[0]?datas[0]:[];
};

function compareMeta(inputData,metaData)
{   
    // console.log("compareMeta");
    // console.log(inputData);
    // console.log(metaData);
    if (inputData!='' && inputData!=metaData) 
    {
        inputData = Cryptof.encryption(metaData);
    }
    // console.log(inputData);
    return inputData;
}

StaffSetting.create = function(objData,encryptedPassword, result) {   
    
    let sqlStr = "Select *  ";        
    sqlStr += " FROM key_check "; 
    const dataByID = dbConn.query(sqlStr);
    
    // let metadata = JSON.parse(dataByID[0].meta_data);

    var key = 'SuperSumohmomo';
    var encrypted = crypto.createHmac('sha1', key).update(objData.am_password).digest('hex');
    let password = encrypted;

    try {

        // console.log(dataByID[0].parent
        //     ,dataByID[0].parent
        //     ,objData.am_username
        //     ,password
        //     ,objData.am_fullname
        //     ,objData.am_mobile
        //     ,objData.am_rank
        //     ,objData.am_group
        //     ,objData.is_parent
        //     ,objData.am_status);
               
        const datas = dbConn.query("INSERT INTO "+tableName+" ("+ 
        "parent "       
        +",_id " 
        +",am_username " 
        +",am_password "
        +",am_fullname "
        +",am_mobile "
        +",am_rank "
        +",am_group "
        +",is_parent "
        +",am_status "         
        +" ) VALUES (?,?,?,?,?,?,?,?,?,?)"
        , [
            dataByID[0].parent 
            ,dataByID[0].parent 
            ,objData.am_username 
            ,password 
            ,objData.am_fullname 
            ,objData.am_mobile 
            ,objData.am_rank 
            ,objData.am_group 
            ,objData.is_parent 
            ,objData.am_status 
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
    
    
};

StaffSetting.updateByID = function(objData, result) {   

    const rowid = objData.am_username;

    let password = objData.am_password;
    
    if (objData.oldPassword!=objData.am_password) 
    {
        var key = 'SuperSumohmomo';
        var encrypted = crypto.createHmac('sha1', key).update(password).digest('hex');
        password = encrypted;
    }
   
    try {
            
        const datas = dbConn.query("UPDATE " +tableName+" SET "
        +"am_username=? " 
        +",am_password=? "
        +",am_fullname=? "
        +",am_mobile=? "
        +",am_rank=? "
        +",am_group=? "
        +",am_status=? "        
        +"WHERE "+tableKey+" = ?"
        , [     
            objData.am_username     
            ,password
            ,objData.am_fullname
            ,objData.am_mobile
            ,objData.am_rank
            ,objData.am_group
            ,objData.am_status
            , rowid]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
    
};

StaffSetting.deleteByID = function(objData, result) {   

    try {
        //  console.log(objData.listId);
        // console.log(tmpData);

        // const datesWrappedInQuotes = objData.listId.map(date => `'${date}'`);
        // const withCommasInBetween = datesWrappedInQuotes.join(',')

        let lstID =objData.listId.join(",");
        // console.log(lstID);
        console.log("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");

        const datas = dbConn.query("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }

};

StaffSetting.inactiveByID = function(objData, result) {   
    
    
    // const datesWrappedInQuotes = objData.listId.map(date => `'${date}'`);
    // const withCommasInBetween = datesWrappedInQuotes.join(',')
    // console.log( withCommasInBetween );
    let lstID = objData.listId.join(",");

    // console.log(lstID);
    // console.log(objData);
    
    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    " `am_status` = (am_status-1)*-1 "
    +" WHERE id in ("+lstID+") "
    );   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
    
};

module.exports = StaffSetting;