'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'am_group'
const tableKey = 'id'

//User object create
var StaffGroupSetting = function(adminBankList) {
    // this.am_username = userlist.am_username;
    // this.am_password = userlist.am_password;
    // this.am_fullname = userlist.am_fullname;
    // this.am_rank = userlist.am_rank;
    // this.am_group = userlist.am_group;
    // this.is_parent = userlist.is_parent;
    // this.parent = userlist.parent;
    // this.am_status = userlist.am_status;
};

StaffGroupSetting.findAll = function(searchword, result) {   

    searchword=searchword?searchword:"";

    let sqlStr = "Select * ";        
    sqlStr += " FROM "+tableName;        
    sqlStr += " where 1=1 AND (name like '%"+searchword+"%') ";
    // console.log(sqlStr);
    let datas = dbConn.query(sqlStr);

    // let newDatas = [];    
    // let i = 0;
    // datas.forEach(element => {
    //     newDatas[i] = element;        
        
    //     let tmpMeta = JSON.parse(element.meta);        
    //     for (const [key, value] of Object.entries(tmpMeta)) 
    //     {            
    //         newDatas[i][key] = value;
    //     }
    //     i++;
    // });


    // console.log(datas);
    dbConn.end;
    return datas;
};

StaffGroupSetting.getAllPage = function(result) {   

    let sqlStr = "Select * ";        
    sqlStr += " FROM page_admin ";        
    sqlStr += " WHERE 1=1 ORDER BY page_name_th ";
    // console.log(sqlStr);
    let datas = dbConn.query(sqlStr);
   
    // console.log(datas);
    dbConn.end;
    return datas;
};

StaffGroupSetting.getPageByAmPermission = function(am_permission,result) {   

    let sqlStr = "Select * ";        
    sqlStr += " FROM page_admin ";        
    sqlStr += " WHERE 1=1  ";
    sqlStr += " AND id in ("+am_permission +") ";
    sqlStr += " ORDER BY page_name_th ";
    // console.log(sqlStr);
    let datas = dbConn.query(sqlStr);
   
    // console.log(datas);
    dbConn.end;
    return datas;
};

StaffGroupSetting.findByID = function(id, result) {   
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
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

StaffGroupSetting.create = function(objData, result) {   
    
    let sqlStr = "Select * FROM "+tableName;
    sqlStr += " where status=1 ";
    
    const dataByID = dbConn.query(sqlStr);    
    
    // let metadata = JSON.parse(dataByID[0].meta_data);

     
   
    
    try {
        // console.log(dataByID[0].parent
        //     ,objData.name
        //     ,objData.permission
        //     ,objData.status );
        // console.log(tmpData);
        const datas = dbConn.query("INSERT INTO "+tableName+" ("+ 
        "parent "       
        +",name " 
        +",permission " 
        +",status "         
        +" ) VALUES (?,?,'"+objData.permission+"',?)"
        , [
            dataByID[0].parent
            ,objData.name            
            ,objData.status                     
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

StaffGroupSetting.updateByID = function(objData, result) {   

    const rowid = objData.id;
   
    try {
        
        const datas = dbConn.query("UPDATE " +tableName+" SET "
         +" permission='"+objData.permission+"'"
         +",name=? "    
        +",status=? "        
        +",default_page=? "    
        +",default_page_th=? "
        +",default_page_id=? "    
        +"WHERE id = ? "
        , [ 
             objData.name           
            ,objData.status            
            ,objData.default_page 
            ,objData.default_page_th 
            ,objData.default_page_id 
            ,rowid]);  
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
    
};

StaffGroupSetting.deleteByID = function(objData, result) {   

    try {
        //  console.log(objData.listId);
        // console.log(tmpData);
        
        let lstID =objData.listId.join(",");
        // console.log(lstID);
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

StaffGroupSetting.inactiveByID = function(objData, result) {   
    
    
    const datesWrappedInQuotes = objData.listId.map(date => `'${date}'`);
    const withCommasInBetween = datesWrappedInQuotes.join(',')
    // console.log( withCommasInBetween );
    // let lstID = objData.listId.join(",");

    // console.log(lstID);
    // console.log(objData);

    let lstID =objData.listId.join(",");
    
    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    " `deleted` = (deleted-1)*-1 "
    +" WHERE id in ("+lstID+") "
    );   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
    
};

StaffGroupSetting.checkStaffPageAuthen = function(userid,pagename,result) {   

    let sqlStr = "SELECT * FROM am_users WHERE am_username='"+userid+"'";

    const amusers = dbConn.query(sqlStr);
    if (amusers[0]) {
        
        if (amusers[0].am_rank==4) 
        {
            return true;
        }
        else
        {
            if (pagename=="") 
            {
                return false;
            }
            else
            {
                const amgroup = amusers[0].am_group;
                sqlStr ="SELECT * FROM am_group WHERE id="+amgroup;
                const am_group = dbConn.query(sqlStr);

                if (am_group[0]['permission']) {
                    let permission = am_group[0]['permission'];
                    sqlStr ="SELECT * FROM page_admin WHERE id in ("+am_group[0]['permission']+") AND page_name='"+pagename+"'";
                    const checkPermission = dbConn.query(sqlStr);                    
                    if (checkPermission.length>0) {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
        }
    }    
    
    return false;
};

StaffGroupSetting.getPermissionByAmGroup = function(amgroup,result)
{
    let sqlStr ="SELECT * FROM am_group WHERE id="+amgroup;
    const am_group = dbConn.query(sqlStr);
    return am_group;
}

module.exports = StaffGroupSetting;