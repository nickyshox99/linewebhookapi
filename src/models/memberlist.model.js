'use strict';

var dbConn = require('../../config/db.config');
const Secret = require('../../config/secret');

const jwt = require('jsonwebtoken');
const timerHelper = require('../modules/timehelper');
const MainModel = require('./main.model');
const tableName = 'sl_users'
const tableKey = 'id'

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

//User object create
var MemberList = function(memberlist) {
    // this.am_username = userlist.am_username;
    // this.am_password = userlist.am_password;
    // this.am_fullname = userlist.am_fullname;
    // this.am_rank = userlist.am_rank;
    // this.am_group = userlist.am_group;
    // this.is_parent = userlist.is_parent;
    // this.parent = userlist.parent;
    // this.am_status = userlist.am_status;
};

MemberList.login = function(id, password, result) {
    const datas = dbConn.query("SELECT * FROM " + tableName + " WHERE (mobile_no = ? or id=?) AND password= ?", [id,id, password]);    
    dbConn.end;
    // console.log(datas.values);
    return datas;    
}

MemberList.findAll = function(searchword, result) {   
    searchword = searchword?searchword:'';
    let sqlStr = "Select sl_users.*, (CASE WHEN status=1 THEN 'active' ELSE 'inactive' END ) as statusstr ";        
    sqlStr += ",bank_info.bank_ico,bank_info.bank_color ";
    sqlStr += " FROM sl_users ";
    sqlStr += " LEFT JOIN bank_info ON bank_info.bank_id = sl_users.bank_id "
    sqlStr += " where 1=1 AND (mobile_no like '%"+searchword+"%' or id like'%"+ searchword+"%' or fullname like'%"+ searchword+"%'  or bank_acc_no like'%"+ searchword+"%'  ) limit 0,1000";
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.findAllByKnowUs = function(knowus, result) {   
    knowus = knowus?knowus:'';
    let sqlStr = "Select sl_users.*, (CASE WHEN status=1 THEN 'active' ELSE 'inactive' END ) as statusstr ";        
    sqlStr += ",bank_info.bank_ico,bank_info.bank_color ";
    sqlStr += " FROM sl_users ";
    sqlStr += " LEFT JOIN bank_info ON bank_info.bank_id = sl_users.bank_id "
    sqlStr += " where 1=1 AND (knowus ='"+knowus+"' ) limit 0,10000";
    //console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.findAllByAllianceID = function(alliance_id, result) {   
    alliance_id = alliance_id?alliance_id:'';
    let sqlStr = "Select sl_users.*, (CASE WHEN status=1 THEN 'active' ELSE 'inactive' END ) as statusstr ";        
    sqlStr += ",bank_info.bank_ico,bank_info.bank_color ";
    sqlStr += " FROM sl_users ";
    sqlStr += " LEFT JOIN bank_info ON bank_info.bank_id = sl_users.bank_id "
    sqlStr += " where 1=1 AND (alliance_id ='"+alliance_id+"' ) limit 0,10000";
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.findByID = function(username,avatar, result) {   
    let sqlStr = "Select sl_users.*, (CASE WHEN status=1 THEN 'active' ELSE 'inactive' END ) as statusstr ";    
    sqlStr += ",'"+avatar+"' as avatar ";
    sqlStr += ",bank_info.bank_ico,bank_info.bank_color ";
    sqlStr += " FROM sl_users ";
    sqlStr += " LEFT JOIN bank_info ON bank_info.bank_id = sl_users.bank_id "
    sqlStr += " where 1=1 AND (mobile_no = '"+username+"' or id ='"+ username+"' or alias_id ='"+ username+"' )  ";
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas[0]?datas[0]:[];
};

MemberList.getAccountCreditByID = function(username, result) {   
    let sqlStr = "Select sl_users.id,sl_users.credit,sl_users.alias_credit,sl_users.alias_id,sl_users.accept_promotion";            
    sqlStr += " FROM sl_users ";    
    sqlStr += " where 1=1 AND (mobile_no = '"+username+"' or id ='"+ username+"' or alias_id ='"+ username+"' ) ";
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas[0]?datas[0]:[];
};

MemberList.updateByID = function(objData, result) {   
    
    const rowid = objData.id;

    // console.log(rowid);
    // console.log(objData);
    
    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "bank_id=?"   
    +",fullname=?" 
    +",mobile_no=?" 
    +",bank_acc_no=?" 
    +",bank_name=?"
    +",is_vip=?"
    +" WHERE id = ? "
    , [
        objData.bank_id        
        ,objData.fullname 
        ,objData.mobile_no 
        ,objData.bank_acc_no 
        ,objData.bank_name
        ,objData.is_vip
        , rowid]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
    
};

MemberList.updateLastLoginByID = function(mobile_no, result) {   
    
    // console.log(rowid);
    // console.log(objData);
    let sDateFrom = new Date((new Date()).getTime() + (offsetTime)); 
    
    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "last_login=?"       
    +" WHERE (mobile_no = ? or id=?) "
    , [        
        timerHelper.convertDatetimeToString(sDateFrom)
        , mobile_no,mobile_no]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
    
};

MemberList.inactiveByID = function(objData, result) {   
    
    
    const datesWrappedInQuotes = objData.listId.map(date => `'${date}'`);
    const withCommasInBetween = datesWrappedInQuotes.join(',')
    // console.log( withCommasInBetween );
    // let lstID = objData.listId.join(",");

    // console.log(lstID);
    // console.log(objData);
    
    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    " `status` = (status-1)*-1 "
    +" WHERE id in ("+withCommasInBetween+") "
    );   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
    
};

MemberList.getMemberDepWitByID = function(username, result) {   
    let sqlStr = "select sl_users.id username, refw.CountAW, refw.SumAW, refd.CountAD,refd.SumAD, SumAD-SumAW as Profit ";            
    sqlStr += " from sl_users, (select username ,count(credit) CountAW, sum(credit) SumAW from report_transaction where transaction_type like 'WIT%' and approve_status=1  group by username) refw, (select username ,count(credit) CountAD,sum(credit) SumAD from report_transaction where transaction_type like 'DEP%' and approve_status=1  group by username) refd  ";    
    sqlStr += " where sl_users.id = refw.username and sl_users.id = refd.username and sl_users.id = '"+username+"'";
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas[0]?datas[0]:[];
};

MemberList.register = function(objData, result) {   
    
    try {
        
        const datas = MainModel.insert("sl_users",objData);
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
    
    
};

MemberList.generateMemberID = function(prefix,randomlength, result) {   
    const plus = 0;
    let sqlStr = "SELECT running FROM userid_running WHERE id = 1 limit 0,1 ";    
    const datas = dbConn.query(sqlStr);
    if (datas.length==0) 
    {
        const RequestID = (1).toString().padStart(randomlength, '0');
        return RequestID;
    }
    else
    {
        let RequestID="";
        let tmp_id = datas[0].running;
        if(!isNaN(tmp_id)){
            let row = (parseInt(tmp_id) + 1 + plus).toString().padStart(randomlength, '0');
            RequestID = row;
        }else{
            RequestID = (1).toString().padStart(randomlength, '0');
        }
        return RequestID;
    }
    
};

MemberList.isDuplicateUsername = function(username, result) {   
    
    let sqlStr = "SELECT count(id) as counts FROM sl_users WHERE id = '"+ username +"' ";       
    const datas = dbConn.query(sqlStr);    
    if (datas[0].counts>0) 
    {
        return true;
    }
    else
    {
        return false;
    }
    
};

MemberList.increaseRunningID = function(result) {   
    
    const datas = dbConn.query("UPDATE userid_running SET "+ 
    "running=running+1 "       
    +" WHERE id = 1 "
    );   
    
    
    dbConn.end;
    return datas;
    
};

MemberList.increaseCredit = function(username,credit,result)
{
    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "credit=credit + (?) "
    +" WHERE id = ? "
    , [
        credit       
        , username]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
}

MemberList.updateCredit = function(username,credit,result)
{
    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "credit=? "
    +" WHERE id = ? "
    , [
        credit       
        , username]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
}

MemberList.updateCreditAndAlias = function(username,credit,alias_credit,result)
{
    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "credit=? "
    +",alias_credit=? "
    +" WHERE id = ? "
    , [
        credit
        ,alias_credit?alias_credit:0
        , username]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
}

MemberList.increseCreditAndAutoBank = function(username,credit,autobank,result)
{
    const datas = dbConn.query("UPDATE " +tableName+" SET "
    + "credit=credit + (?) "
    +",AutoBank=? "
    +" WHERE id = ? "
    , [
        credit  
        ,autobank     
        , username]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
}

MemberList.increaseCreditAndTurnOver = function(username,credit,turnover,result)
{
    let sDateFrom = new Date((new Date()).getTime() + (offsetTime)); 

    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "credit = credit + (?) "
    + ",turn = ?"
    + ",turn_date = ?"
    +" WHERE id = ? "
    , [
        credit    
        ,turnover   
        , timerHelper.convertDatetimeToString(sDateFrom)
        , username]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
}

MemberList.updateCreditAndAutoBank = function(username,credit,autobank,result)
{
    const datas = dbConn.query("UPDATE " +tableName+" SET "
    + "credit=? "
    +",AutoBank=? "
    +" WHERE id = ? "
    , [
        credit  
        ,autobank     
        , username]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
}

MemberList.updateCreditAndTurnOver = function(username,credit,turnover,result)
{

    let sDateFrom = new Date((new Date()).getTime() + (offsetTime)); 

    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "credit = ? "
    + ",turn = ?"
    + ",turn_date = ?"
    +" WHERE id = ? "
    , [
        credit    
        ,turnover   
        , timerHelper.convertDatetimeToString(sDateFrom)
        , username]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
}

MemberList.updateCreditAndTurnOverAlias = function(username,credit,turnover,result)
{
    let sDateFrom = new Date((new Date()).getTime() + (offsetTime)); 

    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "alias_credit = ? "
    + ",turn = ?"
    + ",turn_date = ?"
    +" WHERE id = ? "
    , [
        credit    
        ,turnover   
        , timerHelper.convertDatetimeToString(sDateFrom)
        , username]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
}

MemberList.increaseCreditAff = function(username,creditaff,result)
{
    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "credit_aff=credit_aff + (?) "
    +" WHERE id = ? "
    , [
        creditaff       
        , username]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
}

MemberList.updateCreditAff = function(username,creditaff,result)
{
    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "credit_aff= ? "
    +" WHERE id = ? "
    , [
        creditaff       
        , username]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
}

MemberList.refreshAliasAccount = function(username,result)
{
    const row_user = this.findByID(username);
    let oldalias_user = row_user['alias_id']?row_user['alias_id']:'';
    let running=1;
    if (oldalias_user=='') {
        running = 1;
    }	
    else
    {
        running = parseInt(oldalias_user.substring(oldalias_user.indexOf('x')+1));
        running += 1;
    }	
    
    let newalias_user = row_user['id']+'x'+(running).toString();

    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "alias_id=?"
    +",alias_credit = ? "
    +",turn = ? "
    +",accept_promotion = ? "
    +" WHERE id = ? "
    , [
        newalias_user   
        ,0
        ,0
        ,0    
        , username]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;

    return newalias_user;
    
}

MemberList.getMemberByBankAccNo = function(condition, result) {   

    if (condition.length==0) {
        return [];
    }

    let sqlStr = "Select * ";            
    sqlStr += " FROM sl_users ";    
    sqlStr += " where 1=1 ";
    sqlStr += condition;

    console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas?datas:[];
};

MemberList.getAllMemberByBankAccNo = function(condition, result) {   

    if (condition.length==0) {
        return [];
    }

    let sqlStr = "Select * ";            
    sqlStr += " FROM sl_users ";    
    sqlStr += " where 1=1 ";
    sqlStr += condition;

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas?datas:[];
};

MemberList.isAuthenicated = function(userid, authToken, result) {

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

MemberList.updateAutoBank = function(username,result)
{
    const datas = dbConn.query("UPDATE " +tableName+" SET "        
    + " `AutoBank` = (AutoBank-1)*-1 "
    + " WHERE id = ? "
    , [ username]);   
    
    dbConn.end;
    return datas;
}

MemberList.updateVIPStatus = function(username,result)
{
    const datas = dbConn.query("UPDATE " +tableName+" SET "        
    + " `user_status` = 'VIP'"
    + " WHERE id = ? "
    , [ username]);   
    
    dbConn.end;
    return datas;
}

MemberList.changePromotion = function(username,promotionid,turn_date,result)
{
    const datas = dbConn.query("UPDATE " +tableName+" SET "        
    + " `accept_promotion` = "+promotionid
    + " ,`turn_date` = '"+ turn_date+"'"
    + " WHERE id = ? "
    , [ username]);   
    
    dbConn.end;
    return datas;
}

MemberList.getHistoryDepWitMemberByID = function(username, result) {   
    
    let sqlStr = `Select *,
        CASE WHEN transaction_type LIKE '%DEP%' THEN 'DEP' 
             WHEN transaction_type LIKE '%WIT%'THEN 'WIT' 
             WHEN transaction_type LIKE '%BONUS%'THEN 'BONUS'
        ELSE '' END as transaction_type2 
    FROM report_transaction `;
    sqlStr += " where 1=1 AND (username like '"+username+"') AND (transaction_type like 'DEP%' || transaction_type like 'WIT%' || transaction_type like 'BONUS%' ) ORDER BY DATE DESC LIMIT 0,30";
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getHistoryDepMemberByID = function(username, result) {   
    
    let sqlStr = `Select *,
        CASE WHEN transaction_type LIKE '%DEP%' THEN 'DEP' 
             WHEN transaction_type LIKE '%WIT%'THEN 'WIT' 
        ELSE '' END as transaction_type2 
    FROM report_transaction `;
    sqlStr += " where 1=1 AND (username like '"+username+"') AND (transaction_type like 'DEP%' )  ORDER BY DATE DESC LIMIT 0,30";
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getHistoryWitMemberByID = function(username, result) {   
    
    let sqlStr = `Select *,
        CASE WHEN transaction_type LIKE '%DEP%' THEN 'DEP' 
             WHEN transaction_type LIKE '%WIT%'THEN 'WIT' 
        ELSE '' END as transaction_type2 
    FROM report_transaction `;
    sqlStr += " where 1=1 AND (username like '"+username+"') AND (transaction_type like 'WIT%' )  ORDER BY DATE DESC LIMIT 0,30";
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getHistoryBetLogByID = function(username, result) {   
    
    let sqlStr = `Select * From bet_log `;
    sqlStr += " where 1=1 AND (username like '"+username+"') ORDER BY date DESC LIMIT 0,48";
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.checkPassword = function(username,password, result) {   
    let sqlStr = "Select * FROM sl_users ";       
    sqlStr += " where 1=1 AND (mobile_no = '"+username+"' or id ='"+ username+"') ";
    sqlStr += " AND (password = '"+password+"' ) ";
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);        
    return datas[0]?datas[0]:[];
};

MemberList.changePassword = function(objData, result) {   
    
    const rowid = objData.username;

    // console.log(rowid);
    // console.log(objData);
    
    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "password=?"       
    +" WHERE id = ? "
    , [
        objData.newpassword
        , rowid]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
    
};

MemberList.getAffiliateMemberByID = function(username, result) {   
    
    let sqlStr = `SELECT mobile_no,id,create_at
    FROM sl_users 
    WHERE aff = '${username}'`;
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getAffiliateCreditMemberByID = function(username, result) {   
    
    let sqlStr = `select sum(aff_credit) Scredit, count(*) Ccredit
    from report_transaction
    where username = '${username}' and (transaction_type like 'AFFG' ) and aff_ref_id is null `;
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getCurrentAffiliateCreditMemberByID = function(username, result) {   
    
    let sqlStr = `select credit_aff 
    from sl_users
    where id = '${username}'  `;
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas[0]?datas[0]:[];
};

MemberList.getActiveUserPromotion = function(username,mobile_no, result) {   
    
    let sqlStr = `SELECT meta_promotion.* ,meta_promotion_setting.meta,meta_promotion_setting.promotion_type 
    FROM meta_promotion LEFT JOIN 
    meta_promotion_setting ON meta_promotion.proid=meta_promotion_setting.id 
    WHERE (meta_promotion.username = '${username}' or meta_promotion.mobile_no = '${mobile_no}') and meta_promotion.status=1 order by date desc `;
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getDailyDepositMemberByID = function(morecredit,userid,parent,countday,result) {   
    
    let sqlStr;
    const today = new Date();
    const previousDate = new Date();
    previousDate = new Date(previousDate.getTime() + (offsetTime)); 
    previousDate.setDate(today.getDate() - countday);
    let startdate = timerHelper.convertDatetimeToString(previousDate);

    sqlStr = `SELECT * FROM (SELECT DISTINCT(date(date)) as date FROM report_transaction `;
    sqlStr += ` WHERE (transaction_type like 'DEP%') AND credit>=${morecredit} AND username='${userid}' AND parent='${parent}' AND Approve_status=1 AND date(date)>='${startdate}' `;
    sqlStr += ` AND date(date) not in (SELECT Date FROM daily_deposit_claimed WHERE claimed=1 AND daily_deposit_claimed.username='${userid}' AND daily_deposit_claimed.parent='${parent}' ) `;
    sqlStr += ` ORDER BY DATE DESC LIMIT 0,${countday} ) tb order by date asc `;

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getCountAllianceMember = function(knowus, result) {   
    // searchword = searchword?searchword:'';
    let sqlStr = "select count(*) C from sl_users WHERE knowus='"+knowus+"'";            
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getCountMember = function( result) {   
    // searchword = searchword?searchword:'';
    let sqlStr = "select count(*) C from sl_users ";            
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getCountNewMember = function(searchData, result) {   

    let sDateFrom = (searchData.dateFrom)?searchData.dateFrom:new Date();
    let sDateTo = (searchData.dateTo)?searchData.dateTo:new Date();
    
    let searchQuery="";

    if(sDateFrom != ''){
        searchQuery += " and create_at >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and create_at <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // searchword = searchword?searchword:'';
    let sqlStr = "select count(*) C from sl_users WHERE 1=1 "+ searchQuery;
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getCountNewMemberAndDeposit = function(searchData, result) {   

    let sDateFrom = (searchData.dateFrom)?searchData.dateFrom:new Date();
    let sDateTo = (searchData.dateTo)?searchData.dateTo:new Date();
    
    let searchQuery="";

    if(sDateFrom != ''){
        searchQuery += " and create_at >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and create_at <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // searchword = searchword?searchword:'';
    let sqlStr = "select count(*) C from sl_users WHERE 1=1 "+ searchQuery + " AND ((SELECT COUNT(id) FROM report_transaction WHERE transaction_type like 'DEP%' AND approve_status=1 AND report_transaction.username=sl_users.id)>0)";
    //console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getCountMemberFromInvite = function(searchData, result) {   

    let sDateFrom = (searchData.dateFrom)?searchData.dateFrom:new Date();
    let sDateTo = (searchData.dateTo)?searchData.dateTo:new Date();
    
    let searchQuery="";

    if(sDateFrom != ''){
        searchQuery += " and create_at >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and create_at <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // searchword = searchword?searchword:'';
    let sqlStr = "select count(*) C from sl_users WHERE 1=1 "+ searchQuery + " AND (aff is not null AND aff <>'null') ";
    //console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getCountMemberGroupByKnowUs = function(searchData, result) {   

    let sDateFrom = (searchData.dateFrom)?searchData.dateFrom:new Date();
    let sDateTo = (searchData.dateTo)?searchData.dateTo:new Date();
    
    let searchQuery="";

    if(sDateFrom != ''){
        searchQuery += " and create_at >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and create_at <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // searchword = searchword?searchword:'';
    let sqlStr = "select refer as knowus,(select count(*) from sl_users WHERE sl_users.knowus=refer.refer "+ searchQuery +" ) as counts from refer ";
    //console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MemberList.getOnlineUser = function( result) {   

    let fromDate = new Date();
    let toDate = new Date();

    fromDate = new Date(fromDate.getTime() + (offsetTime)); 
    fromDate.setMinutes(fromDate.getMinutes()-10);
    toDate = new Date(toDate.getTime() + (offsetTime)); 
    toDate.setMinutes(toDate.getMinutes()+10);

    let sqlStr = "Select count(*) as counts ";        
    sqlStr += " FROM sl_users ";        
    sqlStr += " where last_login between '"+ timerHelper.convertDatetimeToString(fromDate) +"' and '"+timerHelper.convertDatetimeToString(toDate)+"' ";
    //  console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    dbConn.end;
    return datas;
};

MemberList.updateLineIdByID = function(objData, result) {   
            
    const datas = dbConn.query("UPDATE " +tableName+" SET "+ 
    "line_userid = ? "    
    +" WHERE id = ? or mobile_no=?"
    , [
        objData.line_userid 
        , objData.id 
        , objData.id         
    ]);   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    dbConn.end;
    return datas;
    
};

module.exports = MemberList;