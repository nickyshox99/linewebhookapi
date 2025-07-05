'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const IpAllowList = require('../models/ipallowlist.model');
const MainModel = require('../models/main.model');
const LineManage = require('../models/linemanage.model');
const AdminSetting = require('../models/adminsetting.model');

const Secret = require('../../config/secret');

// const bcrypt = require('bcrypt');
// const saltRounds = 60;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

var crypto = require('crypto'); 

const Cryptof = require('../models/cryptof.model');

var session = require('express-session');
const { count } = require('console');
const timerHelper = require('../modules/timehelper');
const { getDateTimeNowString } = require('../modules/timehelper');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;


exports.default = async function(req, res) {
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            res.status(200).send('member api');
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    
    
};

exports.getmember = async function(req, res) {
    console.log('getmember');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = req.body.userid;
                // const token = req.body.token;

                // let IsAuth = AdminList.isAuthenicated(userid,token);
                let IsAuth = true;

                if (IsAuth) 
                {
                    let tmpData = MemberList.findAll(req.body.searchWord);
                    for (let i = 0; i < tmpData.length; i++) {
                        // delete tmpData[i]['password'];
                    }
                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    
    

    
};

exports.getCountMember = async function(req, res) {
    console.log('getCountMember');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = req.body.userid;
                // const token = req.body.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    let tmpData = MemberList.getCountMember();
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    
    

    
};

exports.getCountNewMember = async function(req, res) {
    console.log('getCountNewMember');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = req.body.userid;
                // const token = req.body.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    let tmpData = MemberList.getCountNewMember();
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    
    

    
};

exports.getmemberbyid = async function(req, res) {
    console.log('getmember');

    try 
    {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                // const userid = req.body.userid;
                // const token = req.body.token;
    
                // let IsAuth = AdminList.isAuthenicated(userid,token);
    
                let IsAuth = true;
    
                if (IsAuth) 
                {
                    let tmpData = MemberList.findByID(req.body.username,req.body.avatar);

                    // for (let index = 0; index < tmpData.length; index++) {
                    //     delete tmpData[index].password;                        
                    // }

                    // console.log('getmemberbyid');
                    //console.log(tmpData);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            total : count(tmpData),
                            data : tmpData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } 
    catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    
   
    

   
};

exports.getMemberDepWitByID = async function(req, res) {
    console.log('getMemberDepWitByID');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
            {
                res.status(200).send('Unauthorize ip. ('+ipAddress+')');
            }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = req.body.userid;
                // const token = req.body.token;

                // let IsAuth = AdminList.isAuthenicated(userid,token);

                let IsAuth = true;

                if (IsAuth) 
                {
                    let tmpData = MemberList.getMemberDepWitByID(req.body.username);                
                    // console.log(tmpData);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    
    

   
};

exports.updatememberbyid = async function(req, res) {
    console.log('getmember');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);        
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                // const userid = req.body.userid;
                // const token = req.body.token;
    
                // let IsAuth = AdminList.isAuthenicated(userid,token);
                let IsAuth = true;
    
                if (IsAuth) 
                {
                    console.log('updatememberbyid');
                    console.log(req.body);            
                    let tmpData = MemberList.updateByID(req.body);
                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }

   

    
   
};

exports.inactivememberbyid = async function(req, res) {
    console.log('getmember');    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = req.body.userid;
                // const token = req.body.token;

                // let IsAuth = AdminList.isAuthenicated(userid,token);
                let IsAuth = true;

                if (IsAuth) 
                {
                    console.log('updatememberbyid');
                    // console.log(req.body);            
                    let tmpData = MemberList.inactiveByID(req.body);
                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }

        
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }

  
   
};

exports.create = async function(req, res) {
    
    try {            
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            console.log("insertRefer")
            //handles null error
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = MemberList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    
                    let mobile_no = req.body.mobile_no?req.body.mobile_no:'';
                    let password = req.body.password?req.body.password:'';
                    let aff = req.body.aff?req.body.aff:null;
                    if (aff=='') {
                        aff=null;
                    }
                    let bank_acc_no = req.body.bank_acc_no?req.body.bank_acc_no:'';
                    let bank_id = req.body.bank_id?req.body.bank_id:1;
                    let knowus = req.body.knowus?req.body.knowus:'';
                    let fullname = req.body.fullname?req.body.fullname:'';
                    
                    let checkNumber = MemberList.findByID(mobile_no);                    
                    if (checkNumber.length>0) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'This number is used register.',
                                auth : true,
                                data : [],
                            }
                            );

                        return;
                    }

                    let checkBankAcc = MainModel.query(`SELECT id FROM sl_users WHERE bank_acc_no='${bank_acc_no}' `);
                    if (checkBankAcc.length>0) {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'This bank account number is used register.',
                                auth : true,
                                data : [],
                            }
                            );

                        return;
                    }

                    let checkTelNo = MainModel.query(`SELECT id FROM sl_users WHERE mobile_no='${mobile_no}' `);
                    if (checkTelNo.length>0) {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'This mobile number is used register.',
                                auth : true,
                                data : [],
                            }
                            );

                        return;
                    }

                    //Create with agent
                    let tmpCreate = await AgentMain.createUser(password);
                    if (tmpCreate.msgerror) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: tmpCreate.msgerror,
                                auth : false,
                                data : [],
                            }
                        );
                        return;
                    }

                    // console.log("tmpCreate");
                    // console.log(tmpCreate);
                    
                    let sqlStr = "Select *  ";        
                    sqlStr += " FROM agent_account WHERE status=1"; 
                    const dataKeyCheck = MainModel.query(sqlStr);

                    let objData = {

                    }

                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    let charactersLength =  characters.length;
                    let randomString = '';
                    
                    for (let index = 0; index < 6; index++) {                        
                        randomString += characters[Math.floor(Math.random() * (charactersLength - 1))];
                    }                    

                    let tmpBankInfo = AdminBankList.getBankInfoByBankID(bank_id);
                    let bank_name = tmpBankInfo.bank_name;
                    
                    objData["codefree"] = randomString+"-"+ mobile_no;

                    console.log("codefree :"+ objData["codefree"]);
                    console.log("new username :"+tmpCreate.username);

                    objData.id = tmpCreate.username;
                    objData.uid = '';
                    objData.mobile_no = mobile_no;
                    objData.password = password;
                    objData.lineid = '';
                    objData.fullname = fullname;

                    objData.bank_name = bank_name;
                    objData.bank_id = bank_id;
                    objData.bank_acc_no = bank_acc_no;

                    objData.agent = dataKeyCheck[0].agent;
                    objData.prefix = dataKeyCheck[0].prefix;
                    objData.parent = dataKeyCheck[0].parent;
                    objData.turn =0;
                    objData.bet =0;
                    objData.credit =0;
                    objData.credit_free =0;
                    objData.credit_aff =0;
                    objData.accept_promotion  =0 ;
                    objData.last_check_aff = timerHelper.convertDatetimeToString(cTime);
                    objData.create_at = timerHelper.convertDatetimeToString(cTime);
                    objData.last_login = timerHelper.convertDatetimeToString(cTime);
                    objData.aff = aff;

                    objData.ticket_wheel  =0 ;
                    objData.ticket_wheel_used  =0 ;
                    objData.ticket_card  =0 ;
                    objData.ticket_card_used  =0 ;
                    objData.rank  = 999 ;
                    objData.rank_note  ='' ;

                    objData.game_login = null;
                    objData.status = 1;
                    objData.user_status = 'ยังไม่พร้อมใช้งาน';
                    objData.knowus = knowus;

                    objData.alias_id = '';
                    objData.alias_credit = 0;
                    objData.accept_promotion = 0;
                    
                    console.log("MemberList.register");                    
                    let tmpData = MemberList.register(objData);

                    if (tmpData===true) 
                    {
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                            }
                            );
                    }
                    else
                    { 
                        res.status(200).json(
                        { 
                            status: 'error', 
                            message: tmpData.message,
                            auth : false,
                            data : [],
                        }
                        );
                    }
                    
                    
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }

    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
   
};

exports.registerMember = async function(req, res) {
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);    
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            console.log("registerMember")
            //handles null error
            // const headers = req.headers;

            //handles null error
            // if (headers.userid.length === 0 || headers.token.length === 0) 
            if (false) 
            {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } 
            else 
            {
                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                // let IsAuth = MemberList.isAuthenicated(userid,token);
                let IsAuth = true;
                if (IsAuth) 
                {
                    let mobile_no = req.body.mobile_no?req.body.mobile_no:'';
                    let password = req.body.password?req.body.password:'';
                    let aff = req.body.aff?req.body.aff:null;
                    let afftype = req.body.afftype?req.body.afftype:null;
                    let alliance_id = req.body.alliance_id?req.body.alliance_id:null;
                                        
                    let bank_acc_no = req.body.bank_acc_no?req.body.bank_acc_no:'';
                    let bank_id = req.body.bank_id?req.body.bank_id:1;
                    let knowus = req.body.knowus?req.body.knowus:'';
                    let fullname = req.body.fullname?req.body.fullname:'';
                    
                    let checkNumber = MemberList.findByID(mobile_no);                    
                    if (checkNumber.length>0) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'This number is used register.',
                                auth : true,
                                data : [],
                            }
                            );

                        return;
                    }

                    let checkBankAcc = MainModel.query(`SELECT id FROM sl_users WHERE bank_acc_no='${bank_acc_no}' `);
                    if (checkBankAcc.length>0) {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'This bank account number is used register.',
                                auth : true,
                                data : [],
                            }
                            );

                        return;
                    }

                    let checkTelNo = MainModel.query(`SELECT id FROM sl_users WHERE mobile_no='${mobile_no}' `);
                    if (checkTelNo.length>0) {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'This mobile number is used register.',
                                auth : true,
                                data : [],
                            }
                            );

                        return;
                    }

                    //Create with agent
                    let tmpCreate = await AgentMain.createUser(password);
                    if (tmpCreate.msgerror) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: tmpCreate.msgerror,
                                auth : false,
                                data : [],
                            }
                        );
                        return;
                    }

                    // console.log("tmpCreate");
                    // console.log(tmpCreate);
                    
                    let sqlStr = "Select *  ";        
                    sqlStr += " FROM agent_account WHERE status=1"; 
                    const dataKeyCheck = MainModel.query(sqlStr);

                    let objData = {

                    }

                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    let charactersLength =  characters.length;
                    let randomString = '';
                    
                    for (let index = 0; index < 6; index++) {                        
                        randomString += characters[Math.floor(Math.random() * (charactersLength - 1))];
                    }                    

                    let tmpBankInfo = AdminBankList.getBankInfoByBankID(bank_id);
                    let bank_name = tmpBankInfo.bank_name;
                    
                    objData["codefree"] = randomString+"-"+ mobile_no;

                    console.log("codefree :"+ objData["codefree"]);
                    console.log("new username :"+tmpCreate.username);

                    objData.id = tmpCreate.username;
                    objData.uid = '';
                    objData.mobile_no = mobile_no;
                    objData.password = password;
                    objData.lineid = '';
                    objData.fullname = fullname;

                    objData.bank_name = bank_name;
                    objData.bank_id = bank_id;
                    objData.bank_acc_no = bank_acc_no;

                    objData.agent = dataKeyCheck[0].agent;
                    objData.prefix = dataKeyCheck[0].prefix;
                    objData.parent = dataKeyCheck[0].parent;
                    objData.turn =0;
                    objData.bet =0;
                    objData.credit =0;
                    objData.credit_free =0;
                    objData.credit_aff =0;
                    objData.accept_promotion  =0 ;
                    objData.last_check_aff = timerHelper.convertDatetimeToString(cTime);
                    objData.create_at = timerHelper.convertDatetimeToString(cTime);
                    objData.last_login = timerHelper.convertDatetimeToString(cTime);
                    objData.aff = aff;

                    objData.ticket_wheel  =0 ;
                    objData.ticket_wheel_used  =0 ;
                    objData.ticket_card  =0 ;
                    objData.ticket_card_used  =0 ;
                    objData.rank  = 999 ;
                    objData.rank_note  ='' ;

                    objData.game_login = null;
                    objData.status = 1;
                    objData.user_status = 'ยังไม่พร้อมใช้งาน';
                    objData.knowus = knowus;

                    objData.alias_id = '';
                    objData.alias_credit = 0;
                    objData.accept_promotion = 0;
                    objData.alliance_id = alliance_id;
                    
                    console.log("MemberList.register");                    
                    let tmpData = MemberList.register(objData);

                    if (tmpData) 
                    {

                        const lineSetting = await AdminSetting.findByID("line_token");
                        if (lineSetting) {
                            const token = JSON.parse(lineSetting.value);
                            const line_token = token['Register'];
                   
                            let msgformat = "";
                            msgformat += "═════════════\n";
                            msgformat += "❄ สมัครสมาชิกใหม่ ❄\n";                            
                            msgformat += "Username : " + tmpCreate.username + "\n";
                            msgformat += "ชื่อ : " + fullname + "\n";
                            msgformat += "เบอร์มือถือ : " + mobile_no + "\n";                            
                            msgformat += "ธนาคาร " + bank_name + " \n";
                            msgformat += "เลขบัญชี " + bank_acc_no + "  \n";                            
                            msgformat += "ip : " + ipAddress + "\n";
                            msgformat += "วันที่ : " + timerHelper.convertDatetimeToString(cTime) + "\n";
                            msgformat += "═════════════\n";

                            let response = "";
                            if (line_token) {
                                response = await LineManage.sendNotify(line_token, msgformat);
                            }
                        }
                        
                        let userdata = MemberList.findByID(tmpCreate.username);
                        NoticeManage.createAdmin(userdata, 'success', '', 'สมัครสมาชิกเรียบร้อยแล้ว' + timerHelper.convertDatetimeToString(cTime), '', 1);     
                        
                        
                        let newuserid = objData.id+'x1';
                        MainModel.update("sl_users",{alias_id:newuserid},{id:objData.id});                        

                        await AgentMain.reCreateUser(newuserid,objData.password);
                        
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                            }
                        );

                        //Add Alliance

                        return;
                    }
                    else
                    { 
                        res.status(200).json(
                        { 
                            status: 'error', 
                            message: "Can't Register Member "+ tmpData.message,
                            auth : false,
                            data : [],
                        }
                        );
                    }
                    
                    
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    

    
   
};

exports.login = async function(req, res) {

    console.log("Login");

    try {
        console.log(req.body.userid);
        console.log(req.body.password);
    
        // const salt = bcrypt.genSaltSync(saltRounds);
        // const passwordCrypted = bcrypt.hashSync(req.body.password, salt);
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        console.log("ipAddress");
        console.log(ipAddress);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
            
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            var key = 'SuperSumohmomo';
            // var encrypted = crypto.createHmac('sha1', key).update(req.body.password).digest('hex');
            var encrypted = req.body.password;
        
            console.log("Encrypted");
            // console.log(encrypted);
        
            const userlist = MemberList.login(req.body.userid, encrypted);
            
            if (userlist.length > 0) {

                MemberList.updateLastLoginByID(req.body.userid);

                let curTime = new Date();
                // let expiredAt = curTime + Secret.ExpiresIn;
                let jwtToken = jwt.sign({
                        userid: userlist[0].id,
                    },
                    Secret.SecretKey, {
                        expiresIn: Secret.ExpiresLabel
                    });
        
                // console.log(userlist[0].id);
                // console.log(jwtToken);
        
                res.status(200).json({
                    token: jwtToken,
                    createAt: curTime,            
                    expireAt: new Date(new Date(curTime).getTime() + (Secret.ExpiresIn*1000) ) , 
                    id: userlist[0].id,
                    mobile_no: userlist[0].mobile_no,
                    fullName: userlist[0].fullname,                
                    message: "Login is successful.",
                    status:"success",
        
                });
            } else {
                res.status(200).json({
                    message: "Authentication failed",
                    status:"error",
                });
            }
        }
    
    
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    
};

exports.refreshtoken = async function(req, res) {

    console.log('refresh token');

    try {
                
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // console.log("Client ip");
        // console.log(ipAddress);
        
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            let tmpWebSiteOnline = await AdminSetting.findByID('website_online_setting');
            let tmpValue = [];
            if (tmpWebSiteOnline) 
            {                
               tmpValue = JSON.parse(tmpWebSiteOnline['value']);
            }

            // console.log('website_online_setting');
            // console.log(tmpValue);

            if (tmpValue['enable']==0)
            {
                res.status(200).json({
                    message: "Website is close",
                    status:"error",
                });
                return;
            }
            
            let jwtToken = jwt.verify(req.body.token, Secret.SecretKey);
            if (jwtToken.userid) {
                // console.log("Decode userid :", jwtToken.userid); 

                if (jwtToken.userid == req.body.userid) {
                    let curTime = new Date();
                    // let expiredAt = curTime + Secret.ExpiresIn;
                    let jwtToken = jwt.sign({
                            userid: req.body.userid,
                        },
                        Secret.SecretKey, {
                            expiresIn: Secret.ExpiresLabel
                        });
            
                    // console.log(req.body.userid);
                    // console.log(jwtToken);

                    MemberList.updateLastLoginByID(req.body.userid);
            
                    res.status(200).json({
                        token: jwtToken,
                        createAt: curTime,
                        expireAt: new Date(new Date(curTime).getTime() + (Secret.ExpiresIn*1000) ) , 
                        id: jwtToken.userid,            
                        message: "Refresh Token is successful.",
                        status:"success",
                    });
            
                } else {
                    res.status(200).json({
                        message: "Refresh Token failed",
                        status:"error",
                    });
                }
            }else {
                res.status(200).json({
                    message: "Refresh Token failed",
                    status:"error",
                });
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }

    console.log(req.body.userid);
    console.log(req.body.token);

    

};

exports.updateAutoBank = async function(req, res) {
    console.log('updateAutoBank');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    let tmpData = MemberList.updateAutoBank(req.body.id);
                    if (tmpData['affectedRows']) 
                    {
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: 'Update Successful',
                                auth : true,
                            }
                        );
                    }
                    else
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: tmpData.message,
                                auth : true,                            
                            }
                            );
                    }
                
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    

};

exports.cancelPromotion = async function(req, res) {
    console.log('cancelPromotion');

    try {        
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    
                    let tmpMember = await MemberList.findByID(req.body.id);
                    AgentMain.withdrawCreditByUsername("",tmpMember['alias_id'],tmpMember['alias_credit']);
                                                            
                    let newAliasId = MemberList.refreshAliasAccount(req.body.id);
                    await AgentMain.reCreateUser(newAliasId,tmpMember.password);

                    // MainModel.update("sl_users",{bet:0,turn:0,accept_promotion:0},{id:req.body.id});
                    MainModel.update("meta_promotion",{status:0},{username:req.body.id});

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: 'Update Successful',
                            auth : true,
                        }
                    );
                    
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    

};

exports.getCreditByUsername = async function(req, res) {
    console.log('getCreditByUsername');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {                    
                    const pgsoftProductId = "PGSOFT";
                    let pgsoftLockEnabled = false;
                    const tmpData1 = AdminSetting.findByID("pgsoftlock");
                    const PgsoftLockSetting = JSON.parse(tmpData1['value']);                    
                    if (PgsoftLockSetting) 
                    {                  
                        if (PgsoftLockSetting['enable']==1) 
                        {
                            console.log("getPgsoftNotReturnedCredit");

                            const pgsoftNotReturned = await GameList.getPgsoftNotReturnedCredit(userid);                            

                            if (pgsoftNotReturned['id']) 
                            {
                                //Withdraw credit from pgsoft and put to main agent                            
                                const pgsoftLoginID = pgsoftNotReturned['id'];

                                let tmpMember2 = await MemberList.getAccountCreditByID(req.body.id);
                                let getUserId = userid;
                                // if (tmpMember2.accept_promotion>0) {
                                //     getUserId = tmpMember2['alias_id'];
                                // }

                                //Withdraw from pgsoft
                                console.log("AgentMainTF.getCredit : "+getUserId);
                                const tmpGetCredit = await AgentMainTF.getCredit(pgsoftProductId,getUserId);
                                console.log(tmpGetCredit);

                                if (tmpGetCredit.credit>0 || tmpGetCredit.alias_credit>0) 
                                {
                                    let tmpCredit = tmpGetCredit.credit;
                                    if (tmpMember2.accept_promotion>0) {
                                        tmpCredit = tmpGetCredit.alias_credit;
                                    }

                                    const resultWithdraw = await AgentMainTF.withdrawCredit(pgsoftProductId,getUserId,tmpCredit);
                                    console.log('AgentMainTF.withdrawCredit');
                                    console.log(resultWithdraw);
                                    if (resultWithdraw==null)
                                    {
                                        console.log("Error PGSOFTLock Withdraw");                                        
                                        PGSoftLog.create("Error PGSOFTLock Withdraw : Cannot Wtihdraw Credit");
                                    }
                                    else if( resultWithdraw.msgerror) 
                                    {
                                        console.log("Error PGSOFTLock Withdraw");
                                        console.log(resultWithdraw.msgerror);
                                        PGSoftLog.create("Error PGSOFTLock Withdraw : " + JSON.stringify(resultWithdraw.msgerror));
                                    }
                                    else
                                    {
                                        const resultDeposit = await AgentMain.depositCredit("",getUserId,tmpCredit);
                                        if (resultDeposit.msgerror) 
                                        {
                                            console.log("Error Agent Main Deposit");
                                            console.log(resultDeposit.msgerror);
                                            PGSoftLog.create("Error Agent Main Deposit : " + JSON.stringify(resultDeposit.msgerror));
                                        }
                                        else
                                        {
                                            await GameList.updatePgsoftNotReturnedCreditByID(pgsoftLoginID,
                                                {
                                                    returned_credit : 1,
                                                    credit_return : tmpCredit,
                                                }                                                    
                                            );
                                        }
                                    }
                                    const resultWithdraw2 = await AgentMainTF.depositCredit(pgsoftProductId,userid,1);
                                    const resultWithdraw3 = await AgentMainTF.withdrawCredit(pgsoftProductId,userid,1);
                                }
                            }
                        }
                    }

                    let tmpMember = await MemberList.getAccountCreditByID(req.body.id);
                    //delete tmpMember['password'];

                    let loadCredit = await AgentMain.getCredit("",req.body.id);
                    // console.log(loadCredit);
                    if (loadCredit.msgerror) 
                    {
                        console.log(loadCredit.msgerror);
                    }
                    else
                    {
                        // console.log("updateCreditAndAlias");
                        // console.log(req.body.id,loadCredit.credit,loadCredit.alias_credit);
                        
                        if (parseFloat(tmpMember['credit']) != parseFloat(loadCredit.credit) || parseFloat(tmpMember['alias_credit']) != parseFloat(loadCredit.alias_credit) ) 
                        {
                            MemberList.updateCreditAndAlias(req.body.id,loadCredit.credit,loadCredit.alias_credit);  
                            tmpMember['credit'] = loadCredit.credit;
                            tmpMember['alias_credit'] = loadCredit.alias_credit;
                        }

                        if (loadCredit.alias_credit <1 && tmpMember['accept_promotion']!=0) 
                        {
                            await MemberList.refreshAliasAccount(req.body.id);
                            tmpMember = await MemberList.getAccountCreditByID(req.body.id);
                            let newAliasId = tmpMember.alias_id;
                            await AgentMain.reCreateUser(newAliasId,tmpMember.password);
                            await MemberList.updateCreditAndAlias(req.body.id,loadCredit.credit,0);
                            MainModel.update("meta_promotion",{status:0},{username:req.body.id});
                        }
                        
                    }
                    

                    
                    // console.log(tmpData);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                
                            data : tmpMember
                        }
                    );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    

    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }

    
   
};

exports.depositCreditMemberByid = async function(req, res) {
    console.log('depositCreditMemberByid');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (IsAuth) 
                {
                    // body.username = this.depositRow.id;
                    // body.depositAmount= this.depositAmount;
                    
                    // body.entertimeSelected= this.entertimeSelected;
                    // body.depositDateTime= this.depositDateTime;
                    // body.depositAccNo = this.depositAccNo;
                    // body.depositBankApp = this.depositBankApp;
                    // body.depositRemark= this.depositRemark;
    
                    let row_admin = AdminList.findById(headers.userid);
                    let credit = parseFloat(req.body.depositAmount);
                    let username = req.body.id;
                    let aliaswallet = req.body.aliaswallet;
                    if (req.body.entertimeSelected==1) 
                    {
                        let tmp_data = {
                            "id" 			: null,
                            "tr_bank"		: "SCB",
                            "bank_app"		: req.body.depositBankApp,
                            "acc"			: req.body.depositAccNo,
                            "credit"		: credit,
                            "type"			: "DEPOSIT",
                            "date"			: timerHelper.convertDatetimeToString(req.body.depositDateTime),
                            "note"			: "Manual Deposit",
                            "status" 		: 0,
                            "parent"		: req.body.parent,
                            "manual"		: 1
                        };
        
                        MainModel.insert("transfer_ref",tmp_data);
                    }
    
                    let total_deposit_credit = credit;
                    let note="";
                    if(!req.body.note||req.body.note==""){
                        note = "Deposit Credit By " + row_admin.am_username;
                    }else{
                        note = req.body.note;
                    }
                   
                    let row_user = MemberList.findByID(username,"");
    
                    let aff = await AffManage.calculateAffByUsername(row_user,credit);
                        
                    let id = TransactionList.generateRequestID();
    
                    // let oldusername= row_user['id'];
                    // if (row_user['accept_promotion']>0) 
                    // {							
                    //     row_user['id']	= row_user['alias_id'];
                    // }	
                        
                    let response;
                    
                    if(aliaswallet=="1")
                    {
                        response = await AgentMain.depositCreditByUsername("",row_user['alias_id'],credit);
                    }
                    else
                    {
                        response = await AgentMain.depositCreditByUsername("",row_user['id'],credit);
                    }
                    
                    // console.log(response);

                    // row_user['id']	= oldusername;
                    if (response.msgerror) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Agent Problem : ' + response.msgerror,
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
                    else
                    {
                        let cTime = new Date();
                        cTime = new Date(cTime.getTime() + (offsetTime));

                        let transaction_type = "DEPOSITM";
                        let userdata = row_user;                        
    
                        TransactionManage.create(id, row_user, "STAFF",
                            credit, 0, userdata.credit, userdata.credit + credit, transaction_type
                            , userdata.bank_acc_no, userdata.bank_name
                            , timerHelper.convertDatetimeToString(cTime), ''
                            , null
                            , null
                            , null,row_admin.am_username, 1
                            , timerHelper.convertDatetimeToString(cTime), 0, timerHelper.convertDatetimeToString(cTime)
                            , note
                            ,null,null,null
                            , aff['aff_user'], null, aff['aff_user_credit']
                        )
    
                        let nextTurnOver = row_user['turn'];

                        
                        
                        if(aliaswallet=="1")
                        {
                            MemberList.updateCreditAndTurnOverAlias(username,row_user['alias_credit']+credit,nextTurnOver);
                        }
                        else
                        {
                            if (row_user['credit']<5) 
                            {
                                nextTurnOver = 0;
                            }
                            MemberList.updateCreditAndTurnOver(username,row_user['credit']+credit,nextTurnOver);
                        }
                        
    
                        NoticeManage.createAdmin(userdata, 'success', 'เติมเงินจากแอดมิน', 'หมายเลขโทรศัพท์: ' + userdata.mobile_no + '<br>เติมเงิน : ' + credit + ' บาท<br>เวลาที่ฝากเงิน: ' + timerHelper.convertDatetimeToString(cTime), '', 1);
                        NoticeManage.createMember(userdata, 'success', 'เติมเงินจากแอดมิน', 'หมายเลขโทรศัพท์: ' + userdata.mobile_no + '<br>เติมเงิน : ' + credit + ' บาท<br>เวลาที่ฝากเงิน: ' + timerHelper.convertDatetimeToString(cTime), '', 1);
    
                        LogList.create(
                            "เติมเครดิตยูเซอร์ ยอดก่อนเติม "+ row_user['credit']+" หลังเติม "+ (row_user['credit']+ credit)+" เติมจำนวน "+credit
                            ,row_admin.am_username
                            ,timerHelper.convertDatetimeToString(cTime)
                            ,req.body.parent);

                        
    
                        let depositmessage = AdminSetting.findByID("depositmessage");
                        if (depositmessage) {
                            let tmpFormat = JSON.parse(depositmessage.value);
                            if (tmpFormat['dep_textfomrat']) {
                                let msgformat = tmpFormat['dep_textfomrat'];
                                const tag_value = {
                                    "<@userid>": userdata['id'],
                                    "<@fullname>": userdata['fullname'],
                                    "<@telno>": userdata['mobile_no'],
                                    "<@bankaccno>": userdata['bank_acc_no'],
                                    "<@bankname>": userdata['bank_name'],
                                    "<@amount>": total_deposit_credit,
                                    "<@date>": timerHelper.convertDatetimeToString(cTime),
                                    "<@approveby>": "SYSTEM",
                                };
    
                                for (const [key, value] of Object.entries(tag_value)) {
                                    msgformat = msgformat.replaceAll(key, value);
                                }
    
                                const lineSetting = AdminSetting.findByID("line_token");
                                if (lineSetting) {                                    
                                    const token = JSON.parse(lineSetting.value);
                                    const line_token = token['Deposit'];
    
                                    let response = "";
                                    if (line_token) {
                                        response = await LineManage.sendNotify(line_token, msgformat);
                                    }
                                }
                            }
                        } else {
                            const lineSetting = AdminSetting.findByID("line_token");
                            if (lineSetting) {
                                
                                const token = JSON.parse(lineSetting.value);
                                const line_token = token['Deposit'];
    
                                let msgformat = "";
                                msgformat += "═════════════\n";
                                msgformat += "🙁 มีรายการแจ้งฝาก 🙁\n";
                                msgformat += "โอนจาก : (" + admin_bank + ") \n";
                                msgformat += "🥰 ฝากเงิน : " + credit + " บาท 🥰') \n";
                                msgformat += "Username : " + userdata['id'] + "\n";
                                msgformat += "ชื่อ : " + userdata['fullname'] + "\n";
                                msgformat += "เบอร์มือถือ : " + row_user['mobile_no'] + "\n";                            
                                msgformat += "เงินล่าสุดมี " + userdata['credit'] + total_deposit_credit + " บาท \n";
                                msgformat += "เงินก่อนหน้ามี " + userdata['credit'] + " บาท \n";
                                msgformat += "เลขที่รายการ : " + id + "\n";
                                msgformat += "วันที่ : " + timerHelper.convertDatetimeToString(cTime) + "\n";
                                msgformat += "═════════════\n";
    
                                let response = "";
                                if (line_token) {
                                    response = await LineManage.sendNotify(line_token, msgformat);
                                }
                            }
                        }
    
                        MemberList.updateVIPStatus(username);
    
                        row_user = MemberList.findByID(username);
                                            
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: 'เพิ่มเงินให้ ' + userdata['id'] + ' จำนวน ' + total_deposit_credit + ' บาท สำเร็จ',
                                data: {
                                    credit : row_user['credit'],
                                    alias_credit : row_user['alias_credit'],
                                },
                                auth : true,
                            }
                        );
                    }
    
                                 
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        // console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }

   

};

exports.withdrawCreditMemberByid = async function(req, res) {
    console.log('withdrawCreditMemberByid');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
        
                    let row_admin = AdminList.findById(headers.userid);
                    let credit = parseFloat(req.body.withdrawAmount);
                    let username = req.body.id;
                    let aliaswallet = req.body.aliaswallet;
                    
                    let total_deposit_credit = credit;
                    let note="";
                    if(!req.body.note||req.body.note=="" && row_admin.length>0){
                        note = "Withdraw Credit By " + row_admin.am_username;
                    }else{
                        note = req.body.note;
                    }
                
                    let row_user = MemberList.findByID(username,"");

                    let remain_credit = 0;
                    if(aliaswallet=="1")
                    {
                        remain_credit = row_user['alias_credit'];
                    }
                    else
                    {
                        remain_credit = row_user['credit'];
                    }

                    if (credit > remain_credit) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Member credit is not enough to withdraw : '+credit,
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
                    let id = TransactionList.generateRequestID();

                    // let oldusername= row_user['id'];
                    // if (row_user['accept_promotion']>0) 
                    // {							
                    //     row_user['id']	= row_user['alias_id'];
                    // }

                    let selectUserID = "";
                    if(aliaswallet=="1")
                    {
                        selectUserID = row_user['alias_id'];
                    }
                    else
                    {
                        selectUserID = row_user['id'];
                    }

                    let response = await AgentMain.withdrawCreditByUsername("",selectUserID,credit);
                    // row_user['id']	= oldusername;
                    if (response.msgerror) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Agent Problem : ' + response.msgerror,
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
                    else
                    {
                        let cTime = new Date();
                        cTime = new Date(cTime.getTime() + (offsetTime));

                        let transaction_type = "WITHDRAWM";
                        let userdata = row_user;

                        let aff = await AffManage.calculateAffByUsername(userdata, credit);
                        
                        TransactionManage.create(id, row_user, "STAFF",
                            credit, 0, userdata.credit, userdata.credit - credit, transaction_type
                            , userdata.bank_acc_no, userdata.bank_name
                            , timerHelper.convertDatetimeToString(cTime), ''
                            , null
                            , null
                            , null,row_admin.am_username?row_admin.am_username:'', 1
                            , timerHelper.convertDatetimeToString(cTime), 0, timerHelper.convertDatetimeToString(cTime)
                            , note
                            ,null,null,null
                            , aff['aff_user'], null, aff['aff_user_credit']
                        )

                        let nextTurnOver = row_user['turn'];
                        if (row_user['credit']<5) 
                        {
                            nextTurnOver = 0;
                            let check_withdraw = MainModel.queryFirstRow(`
                                SELECT * FROM report_transaction					
                                where username = '${row_user['id']}' and approve_status IS NULL
                            `);
                            if (check_withdraw) 
                            {
                                
                            }
                            else
                            {
                                MemberList.refreshAliasAccount(row_user['id']);                            
                                let tmpMember = await MemberList.findByID(row_user['id']);
                                let newAliasId = tmpMember.alias_id;
                                await AgentMain.reCreateUser(newAliasId,tmpMember.password);

                                // MainModel.update("sl_users",{"turn_date" : null,"turn" : 0,"bet" : 0,"accept_promotion":0 },{id:row_user['id']});
                                MainModel.update("meta_promotion",{"status":0},{"username":row_user['id']});
                                
                            }
                        }
                        
                        if(aliaswallet=="1")
                        {
                            MemberList.updateCreditAndTurnOverAlias(username,row_user['alias_credit']-credit,nextTurnOver);
                        }
                        else
                        {
                            MemberList.updateCreditAndTurnOver(username,row_user['credit']-credit,nextTurnOver);
                        }

                        NoticeManage.createAdmin(userdata, 'success', 'ถอนเงินโดยแอดมิน', 'หมายเลขโทรศัพท์: ' + userdata.mobile_no + '<br>จำนวน : ' + credit + ' บาท<br>เวลาที่ถอนเงิน: ' + timerHelper.convertDatetimeToString(cTime), '', 1);
                        NoticeManage.createMember(userdata, 'success', 'ถอนเงินโดยแอดมิน', 'หมายเลขโทรศัพท์: ' + userdata.mobile_no + '<br>จำนวน : ' + credit + ' บาท<br>เวลาที่ถอนเงิน: ' + timerHelper.convertDatetimeToString(cTime), '', 1);

                        LogList.create(
                            "ถอนเครดิตยูเซอร์ ยอดก่อนถอน "+ row_user['credit']+" หลังถอน "+ (row_user['credit']+ credit)+" ถอนจำนวน "+credit                        
                            ,row_admin.am_username
                            ,timerHelper.convertDatetimeToString(cTime)
                            ,req.body.parent);
                        

                        let withdrawmessage = AdminSetting.findByID("withdrawmessage");
                        if (withdrawmessage) {
                            let tmpFormat = JSON.parse(withdrawmessage.value);
                            if (tmpFormat['wit_textfomrat']) {
                                let msgformat = tmpFormat['wit_textfomrat'];
                                const tag_value = {
                                    "<@userid>": userdata['id'],
                                    "<@fullname>": userdata['fullname'],
                                    "<@telno>": userdata['mobile_no'],
                                    "<@bankaccno>": userdata['bank_acc_no'],
                                    "<@bankname>": userdata['bank_name'],
                                    "<@amount>": total_deposit_credit,
                                    "<@date>": timerHelper.convertDatetimeToString(cTime),
                                    "<@approveby>": "SYSTEM",
                                };

                                for (const [key, value] of Object.entries(tag_value)) {
                                    msgformat = msgformat.replaceAll(key, value);
                                }

                                const lineSetting = AdminSetting.findByID("line_token");
                                if (lineSetting) {
                                    const token = JSON.parse(lineSetting.value);
                                    const line_token = token['Withdraw'];

                                    let response = "";
                                    if (line_token) {
                                        response = await LineManage.sendNotify(line_token, msgformat);
                                    }
                                }
                            }
                        } else {
                            const lineSetting = AdminSetting.findByID("line_token");
                            if (lineSetting) {
                                const token = JSON.parse(lineSetting.value);
                                const line_token = token['Withdraw'];

                                let msgformat = "";
                                msgformat += "═════════════\n";
                                msgformat += "🙁 อนุมัติถอนสำเร็จ 🙁\n";
                                msgformat += row_admin['am_username']+' อนุมัติ  \n';
                                msgformat += '😡 ถอนจำนวน: '+credit+' 😡 \n';
                                msgformat += "เงินล่าสุดมี " + userdata['credit'] - credit + " บาท \n";
                                msgformat += "เงินก่อนหน้ามี " + userdata['credit'] + " บาท \n";
                                msgformat += "Username : " + userdata['id'] + "\n";
                                msgformat += "ชื่อ : " + userdata['fullname'] + "\n";
                                msgformat += "เลขบัญชี : " + userdata['bank_acc_no'] + "\n";
                                msgformat += "ธนาคาร : " + userdata['bank_name'] + "\n";
                                msgformat += "เบอร์มือถือ : " + row_user['mobile_no'] + "\n";                                                        
                                msgformat += "เลขที่รายการ : " + id + "\n";
                                msgformat += "วันที่ : " + timerHelper.convertDatetimeToString(cTime) + "\n";
                                msgformat += "═════════════\n";

                                let response = "";
                                if (line_token) {
                                    response = await LineManage.sendNotify(line_token, msgformat);
                                }
                            }
                        }

                        row_user = MemberList.findByID(username);
                                            
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: 'ถอนเงินออกจาก ' + userdata['id'] + ' จำนวน ' + credit + ' บาท สำเร็จ',
                                data: {
                                    credit : row_user['credit'],
                                    alias_credit : row_user['alias_credit'],
                                },
                                auth : true,
                            }
                        );
                    }

                                
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }

    

};

exports.changePromotionMemberByid = async function(req, res) {
    console.log('changePromotionMemberByid');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = MemberList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
        
                    let row_admin = AdminList.findById(headers.userid);                                
                    let username = req.body.id;
                    let row_user = MemberList.findByID(username);
                    let promotionid = req.body.promotionSelected;

                    if (promotionid==null ) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Not have this promotion id',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
                    else
                    {
                        let promotion_setting = PromotionSetting.findByID(promotionid);                    
                        let check_promotion = PromotionManage.check(username,promotion_setting,true);
                        
                        if (check_promotion.can_get_pro) 
                        {
                            if (promotion_setting['status']==1) 
                            {
                                let sqlStr = `SELECT * FROM report_transaction WHERE username='${row_user['id']}' AND transaction_type like 'DEP%' AND transaction_type<>'DEPMIN' AND (promotion_meta is null or (promotion_meta is not null and promotion_meta<>'used for promotion')) AND approve_status = 1 ORDER BY date DESC `;
                                
                                let rowTrans = MainModel.queryFirstRow(sqlStr);

                                if (rowTrans['credit']) 
                                {
                                    let reqId = rowTrans['id'];
                                    let credit =  parseFloat(rowTrans['credit']);
                                    row_user['accept_promotion'] = promotionid;

                                    console.log("calPromotion");
                                    let promotion_cal = PromotionManage.calPromotion(row_user,credit);
                                    console.log(promotion_cal);

                                    let bonus = promotion_cal['bonus'] ? parseFloat(promotion_cal['bonus']) : 0;
                                    let turnover = promotion_cal['turnover'] ? parseFloat(promotion_cal['turnover']) : 0;
                                    let total_deposit_credit = promotion_cal['total_deposit_credit'] ? parseFloat(promotion_cal['total_deposit_credit']) - credit : credit;

                                    total_deposit_credit = bonus;
                                    let id =  TransactionList.generateRequestID();

                                    if(promotion_cal['ForCreateTurn']['create_pro'] == true){
                                        PromotionManage.createTurn(promotion_cal['ForCreateTurn']);
                                    }
                                    else
                                    {
                                        res.status(200).json(
                                            { 
                                                status: 'error', 
                                                message: 'Cannot get promotion becuase some condition',
                                                auth : true,
                                                data : [],
                                            }
                                        );
                                        return;
                                    }

                                    row_user = MemberList.findByID(username);
                                    let oldusername= row_user['id'];
                                    if (row_user['accept_promotion']>0) 
                                    {							
                                        row_user['id']	= row_user['alias_id'];
                                    }	
                                    
                                    let response = await AgentMain.depositCredit("",row_user['id'],total_deposit_credit);
                                    row_user['id']	= oldusername;
                                    
                                    if (response.msgerror) 
                                    {
                                        res.status(200).json(
                                            { 
                                                status: 'error', 
                                                message: 'Agent Problem : ' + response.msgerror,
                                                auth : true,
                                                data : [],
                                            }
                                        );
                                        return;
                                    }
                                    else
                                    {
                                        let userdata = row_user;

                                        TransactionManage.create(id, row_user, "STAFF",
                                            credit, bonus, userdata.credit, parseFloat(userdata.credit) + total_deposit_credit, "BONUS"
                                            , '', ''
                                            , timerHelper.convertDatetimeToString(new Date()), ''
                                            , promotion_setting.Title?promotion_setting.Title:''
                                            , promotionid?promotionid:0
                                            , null,row_admin.am_username, 1
                                            , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                                            , 'โบนัสโปรโมชั่น'
                                            ,null,null,null
                                            , null, null, 0
                                        )

                                        let nextTurnOver = turnover;
                                                                            

                                        MemberList.updateCredit(username,parseFloat(row_user['credit'])-total_deposit_credit);
                                        MemberList.updateCreditAndTurnOverAlias(username,parseFloat(row_user['credit'])+total_deposit_credit,nextTurnOver);
                                        MemberList.changePromotion(username,promotionid,timerHelper.convertDatetimeToString(new Date()));
                                        
                                        MainModel.update("report_transaction",{"promotion_meta" : "used for promotion"},{id:reqId});                                    

                                        LogList.create(
                                            "เปลี่ยนโปรโมชั่น user :"+ row_user['id']+" , promotion id : "+ promotionid
                                            ,row_admin.am_username
                                            ,timerHelper.convertDatetimeToString(new Date())
                                            ,req.body.parent);
                                        
                                            res.status(200).json(
                                                { 
                                                    status: 'success', 
                                                    message: '',
                                                    auth : true,
                                                    data : [],
                                                }
                                            );
                                            return;
                                    }

                                }
                                else if(promotion_setting['Type']=="CodeFree")
                                {
                                    MemberList.changePromotion(username,promotionid,timerHelper.convertDatetimeToString(new Date()));

                                    res.status(200).json(
                                        { 
                                            status: 'success', 
                                            message: '',
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                    return;

                                }
                                else
                                {
                                    res.status(200).json(
                                        { 
                                            status: 'error', 
                                            message: 'Not have deposit transaction.',
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                    return;
                                }
                            }
                            else
                            {
                                res.status(200).json(
                                    { 
                                        status: 'error', 
                                        message: 'This promotion is inactivated.',
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;
                            }
                        }
                        else
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: check_promotion.message,
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }
                        
                    }
                                
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                        return;
                }
            
            }
        }
    } 
    catch (error) 
    {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
            );
            return;
    }
    

};

exports.changePromotionMemberByid2 = async function(req, res) {
    console.log('changePromotionMemberByid2');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
    // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
    // const ipAllowList = IpAllowList.findById(ipAddress);        
    const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
    if (ipBlockList.length>0)
    {
        res.status(200).send('Unauthorize ip. ('+ipAddress+')');
    }
    else
    {
        const headers = req.headers;

        //handles null error
        if (headers.userid.length === 0 || headers.token.length === 0) {
            res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
        } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            res.status(400).send({ status: 'error', message: 'Please provide all required field' });
        } else {

            const userid = headers.userid;
            const token = headers.token;

            let IsAuth = MemberList.isAuthenicated(userid,token);
            // let IsAuth = true;

            if (IsAuth) 
            {
     
                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                let username = req.body.username;
                let row_user = MemberList.findByID(username);
                let promotionid = req.body.promotionSelected;

                if (promotionid==null ) 
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Not have this promotion id',
                            auth : true,
                            data : [],
                        }
                    );
                    return;
                }
                else
                {
                    console.log("promotionid");
                    console.log(promotionid);
                    let promotion_setting = PromotionSetting.findByID(promotionid);                    
                    let check_promotion = PromotionManage.check(username,promotion_setting,true);
                    
                    if (check_promotion.can_get_pro) 
                    {
                        if (promotion_setting['status']==1) 
                        {
                            let sqlStr = `SELECT * FROM report_transaction WHERE username='${row_user['id']}' AND transaction_type like 'DEP%' AND transaction_type<>'DEPMIN' AND (promotion_meta is null or (promotion_meta is not null and promotion_meta<>'used for promotion')) AND approve_status = 1 ORDER BY date DESC `;
                            //console.log(sqlStr);
                            let rowTrans = MainModel.queryFirstRow(sqlStr);

                            if (rowTrans['credit']) 
                            {
                                let reqId = rowTrans['id'];
                                let credit =  parseFloat(rowTrans['credit']);
                                row_user['accept_promotion'] = promotionid;

                                console.log("calPromotion");
                                let promotion_cal = PromotionManage.calPromotion(row_user,credit);

                                //console.log(promotion_cal);
                                
                                let bonus = promotion_cal['bonus'] ? parseFloat(promotion_cal['bonus']) : 0;
                                let turnover = promotion_cal['turnover'] ? parseFloat(promotion_cal['turnover']) : 0;
                                let total_deposit_credit = promotion_cal['total_deposit_credit'] ? parseFloat(promotion_cal['total_deposit_credit']) : credit;

                                //total_deposit_credit = bonus;
                                let id =  TransactionList.generateRequestID();

                                if(promotion_cal['ForCreateTurn']['create_pro'] == true){
                                    PromotionManage.createTurn(promotion_cal['ForCreateTurn']);
                                }
                                else
                                {
                                    res.status(200).json(
                                        { 
                                            status: 'error', 
                                            message: 'Cannot get promotion becuase : ' + promotion_cal['ForCreateTurn']['note'] ,
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                    return;
                                }

                                row_user = MemberList.findByID(username);                                

                                let response = await AgentMain.withdrawCreditByUsername("",row_user['id'], parseFloat(rowTrans['credit']));    
                                let mainCredit = 0.0;                                                            
                                if (response.msgerror) 
                                {
                                    res.status(200).json(
                                        { 
                                            status: 'error', 
                                            message: 'Agent Problem : ' + response.msgerror,
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                    return;
                                }
                                else
                                {
                                    mainCredit = parseFloat(rowTrans['credit']);
                                }

                                let oldusername= row_user['id'];
                                if (row_user['accept_promotion']>0) 
                                {							
                                    row_user['id']	= row_user['alias_id'];
                                }	
                                
                                response = await AgentMain.depositCreditByUsername("",row_user['id'],total_deposit_credit);
                                row_user['id']	= oldusername;
                                
                                if (response.msgerror) 
                                {
                                    res.status(200).json(
                                        { 
                                            status: 'error', 
                                            message: 'Agent Problem : ' + response.msgerror,
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                    return;
                                }
                                else
                                {
                                    let userdata = row_user;

                                    TransactionManage.create(id, row_user, "STAFF",
                                        credit, bonus, userdata.credit, userdata.credit + total_deposit_credit, "BONUS"
                                        , '', ''
                                        , timerHelper.convertDatetimeToString(cTime), ''
                                        , promotion_setting.Title?promotion_setting.Title:''
                                        , promotionid?promotionid:0
                                        , null,"SYSTEM", 1
                                        , timerHelper.convertDatetimeToString(cTime), 0, timerHelper.convertDatetimeToString(cTime)
                                        , 'โบนัสโปรโมชั่น'
                                        ,null,null,null
                                        , null, null, 0
                                    )

                                    let nextTurnOver = turnover;
                                                                
                                    MemberList.updateCredit(username,parseFloat(row_user['credit'])-total_deposit_credit - parseFloat(rowTrans['credit']) );
                                    MemberList.updateCreditAndTurnOverAlias(username,parseFloat(row_user['credit'])+total_deposit_credit,nextTurnOver);
                                    MemberList.changePromotion(username,promotionid,timerHelper.convertDatetimeToString(cTime));
                                    
                                    MainModel.update("report_transaction",{"promotion_meta" : "used for promotion"},{id:reqId});                                    

                                    LogList.create(
                                        "เปลี่ยนโปรโมชั่น user :"+ row_user['id']+" , promotion id : "+ promotionid
                                        ,"SYSTEM"
                                        ,timerHelper.convertDatetimeToString(cTime)
                                        ,row_user['parent']);
                                    
                                        res.status(200).json(
                                            { 
                                                status: 'success', 
                                                message: '',
                                                auth : true,
                                                data : [],
                                            }
                                        );
                                        return;
                                }

                            }
                            else if(promotion_setting['Type']=="CodeFree")
                            {
                                MemberList.changePromotion(username,promotionid,timerHelper.convertDatetimeToString(cTime));

                                res.status(200).json(
                                    { 
                                        status: 'success', 
                                        message: '',
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;

                            }
                            else
                            {
                                res.status(200).json(
                                    { 
                                        status: 'error', 
                                        message: 'Not have deposit transaction.',
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;
                            }
                        }
                        else
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'This promotion is inactivated.',
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }
                    }
                    else
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: check_promotion.message,
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
                    
                }
                             
            }
            else
            {
                res.status(200).json(
                    { 
                        status: 'error', 
                        message: 'Authenication Failed',
                        auth : false,
                        data : [],
                    }
                    );
                    return;
            }
        
        }
    }
    } 
    catch (error) 
    {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
            );
            return;
    }
    

};

exports.getQuestDataMemberByid = async function(req, res) {
    console.log('getQuestDataMemberByid');
    
    try {
        
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {
            
                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);
                
                if (IsAuth) 
                {
                    // let tmpData = MemberList.getMemberDepWitByID(req.body.username);
                    let dailyWin = AdminSetting.findByID('quest_daily_win');
                    let dailyTurn = AdminSetting.findByID('quest_daily_turn');
                    let dailyDep = AdminSetting.findByID('quest_daily_dep');

                    let user = MemberList.findByID(userid,'');

                    for (const [key, value] of Object.entries(JSON.parse(dailyWin.value))) 
                    {
                        dailyWin[key] = value;
                    }

                    for (const [key, value] of Object.entries(JSON.parse(dailyTurn.value))) 
                    {
                        dailyTurn[key] = value;
                    }

                    for (const [key, value] of Object.entries(JSON.parse(dailyDep.value))) 
                    {
                        dailyDep[key] = value;
                    }

                    let dailyWinData = MainModel.queryFirstRow(`
                        select sum(winloss) as sum from bet_log where username='${userid}' and date(date)='${timerHelper.getDateNowString()}' and winloss>0 
                    `);

                    let dailyTurnData = MainModel.queryFirstRow(`
                        select sum(turnover) as sum from bet_log where username='${userid}' and date(date)='${timerHelper.getDateNowString()}' and winloss>0 
                    `);

                    let dailyDepData = MainModel.queryFirstRow(`
                        SELECT SUM(credit) as sum from report_transaction WHERE username='${userid}' AND transaction_type like 'DEP%' AND approve_status=1 AND date like '${timerHelper.getDateNowString()}%'
                    `);

                    let getRewardDailyWin = MainModel.queryFirstRow(`
                        select * from reward_history where username='${user['mobile_no']}' and date like '${timerHelper.getDateNowString()}%' and reward_type='QDAILYWIN'
                    `);

                    let getRewardDailyTurn = MainModel.queryFirstRow(`
                        select * from reward_history where username='${user['mobile_no']}' and date like '${timerHelper.getDateNowString()}%' and reward_type='QDAILYTURN'
                    `);

                    let getRewardDailyDep = MainModel.queryFirstRow(`
                        select * from reward_history where username='${user['mobile_no']}' and date like '${timerHelper.getDateNowString()}%' and reward_type='QDAILYDEP'
                    `);


                    let returnData={
                        quest_daily_win_sum: dailyWinData['sum']?dailyWinData['sum']:0,
                        quest_daily_win_target: dailyWin['target']?dailyWin['target']:0,
                        quest_daily_win_percent: (dailyWin['target'] && dailyWinData['sum'])?dailyWinData['sum']/dailyWin['target']*100:0,
                        
                        quest_daily_turn_sum: dailyTurnData['sum']?dailyTurnData['sum']:0,
                        quest_daily_turn_target: dailyTurn['target']?dailyTurn['target']:0,
                        quest_daily_turn_percent: (dailyTurn['target'] && dailyTurnData['sum'])?dailyTurnData['sum']/dailyTurn['target']*100:0,

                        quest_daily_dep_sum: dailyDepData['sum']?dailyDepData['sum']:0,
                        quest_daily_dep_target: dailyDep['target']?dailyDep['target']:0,
                        quest_daily_dep_percent: (dailyDep['target'] && dailyDepData['sum'])?dailyDepData['sum']/dailyDep['target']*100:0,
                        
                        get_reward_daily_win: getRewardDailyWin.length>0?1:0,
                        get_reward_daily_turn: getRewardDailyTurn.length>0?1:0,
                        get_reward_daily_dep: getRewardDailyDep.length>0?1:0,

                        daily_win_reward_point : dailyWin['reward_point']?dailyWin['reward_point']:0,
                        daily_turn_reward_point : dailyTurn['reward_point']?dailyTurn['reward_point']:0,
                        daily_dep_reward_point : dailyDep['reward_point']?dailyDep['reward_point']:0,

                        daily_win_reward_credit : dailyWin['reward_credit']?dailyWin['reward_credit']:0,
                        daily_turn_reward_credit : dailyTurn['reward_credit']?dailyTurn['reward_credit']:0,
                        daily_dep_reward_credit : dailyDep['reward_credit']?dailyDep['reward_credit']:0,

                        daily_win_enable : dailyWin['enable']?dailyWin['enable']:0,
                        daily_turn_enable : dailyTurn['enable']?dailyTurn['enable']:0,
                        daily_dep_enable : dailyDep['enable']?dailyDep['enable']:0,
                    }
                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : returnData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
        
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    

   
};

exports.getTurnGraphDataMemberByid = async function(req, res) {
    console.log('getTurnGraphDataMemberByid');
   
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {
            
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = AdminList.isAuthenicated(userid,token);
                
                if (IsAuth) 
                {
                    let user = MemberList.findByID(userid,'');
    
                    let toDate = new Date();
                    let fromDate = new Date();
                    fromDate.setDate(fromDate.getDate() - 7);
                 
                    let turnOverData = MainModel.query(`
                        SELECT sum(turnover) as turnover,date(date) as date
                        FROM bet_log WHERE 
                        bet_log.username='${user['id']}' AND ( bet_log.date >= '${timerHelper.convertDatetimeToString(fromDate)}' AND bet_log.date <= '${timerHelper.convertDatetimeToString(toDate)}' )  group by date(date) order by date(date)
                    `);
                    
                    let sumTurnOver = 0.00;
                    let maxBar = 1000.00;
    
                    let tmpDate = new Date();

                    let betList = [];      
                    let daysName = ['Sun', 'Mon', 'Tue', 'Wed','Thu','Fri', 'Sat'];
                    for (let i=0; i < 7; i++) {
    
                        
                        tmpDate.setDate(tmpDate.getDate()-i);
    
                        let tmpArray={
                            turnover :0.0,
                            progressbar :0,
                            datenum :tmpDate.getDate(),
                            dayofweek : daysName[tmpDate.getDay()],
                        }
                        // console.log(tmpArray)
                        betList.push(tmpArray);
    
                        for (let j=0; j < count(turnOverData) ; j++) 
                        { 						
                            if ( (new Date(turnOverData[j]['date'])).getDate() == betList[i]['datenum'] ) {
                                betList[i]['turnover'] = turnOverData[j]['turnover']/1000;
                                sumTurnOver += turnOverData[j]['turnover'];
    
                                if(turnOverData[j]['turnover']/maxBar>=1)
                                {
                                    betList[i]['progressbar'] = 100;
                                }
                                else
                                {
                                    betList[i]['progressbar'] = turnOverData[j]['turnover']/maxBar * 100;
                                }
    
                            }
                        }
                    }
    
                    let returnData={
                        betList:betList,
                        sumTurnOver:sumTurnOver,
                    }
    
                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : returnData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }


    

   
};

exports.getHistoryDepWitMemberByID = async function(req, res) {
    console.log('getHistoryDepWitMemberByID');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let tmpData = MemberList.getHistoryDepWitMemberByID(req.body.username);                
                    // console.log(tmpData);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
                        }
                    );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error(),
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getHistoryDepMemberByID = async function(req, res) {
    console.log('getHistoryDepMemberByID');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = MemberList.isAuthenicated(userid,token);
    
                if (IsAuth) 
                {
                    let tmpData = MemberList.getHistoryDepMemberByID(req.body.username);                
                    // console.log(tmpData);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error(),
                auth : true,
                data : [],
            }
        );
    }
   
    

   
};

exports.getHistoryWitMemberByID = async function(req, res) {
    console.log('getHistoryWitMemberByID');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let tmpData = MemberList.getHistoryWitMemberByID(req.body.username);                
                    // console.log(tmpData);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error(),
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getHistoryBetLogByID = async function(req, res) {
    console.log('getHistoryBetLogByID');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let tmpData = MemberList.getHistoryBetLogByID(req.body.username);                
                    // console.log(tmpData);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error(),
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.withdrawCreateByMemberId = async function(req, res) {    
    console.log('withdrawCreateByMemberId');
    
    try 
    {
        
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = MemberList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                if (IsAuth) 
                {
                    let username = req.body.id;
                    let user_info = MemberList.findByID(username);
                    
                    let withdraw_amount = parseFloat(req.body.withdrawAmount.replace(',',''));
                    const parent =user_info['parent'];
    
                    let withdraw_setting = AdminSetting.findByID("withdraw_setting");
                    if (withdraw_setting) {
                        withdraw_setting = JSON.parse(withdraw_setting.value);      
                    }
                    else
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Withdraw is not configured please contact the administrator',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    
    
                    const autoWithdraw = withdraw_setting['enable_auto']?withdraw_setting['enable_auto']:0;
                    const maxAutoWithdraw = withdraw_setting['MinAutoWithdraw']?parseFloat(withdraw_setting['MinAutoWithdraw']):1;
                    let minWithdraw = withdraw_setting['MinWithdraw']?parseFloat(withdraw_setting['MinWithdraw']):0;
    
                    if(withdraw_setting['enable']==0)
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Withdraw system is not service',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                        
                    if(withdraw_amount < minWithdraw){
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Minimum of withdraw amount is '+ minWithdraw,
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

    
                    if(withdraw_amount > 0)
                    {
                        let create_at = user_info['create_at'];
					    let turn_date = user_info['turn_date']?user_info['turn_date']:create_at;
                        let needTurn = user_info['turn'];
                        let toDate = new Date();
                        toDate.setDate(toDate.getDate()+1);

                        let tmp_pro =[];
                        let note = '';
                        
                        let MaxWithdraw = withdraw_amount;

                        if (needTurn||user_info['accept_promotion']!=0) 
                        {
                            let sumwinloss =0;
                            let sumwinloss2 =0;
                            let tmpDataHist = [];
                            if (user_info['accept_promotion']!=0) 
                            {
                                tmpDataHist = await AgentMain.getCreditHistoryAlias("",user_info['id'],turn_date ,toDate,0,0);
                                if (tmpDataHist.msgerror) 
                                {
                                    res.status(200).json(
                                        { 
                                            status: 'error', 
                                            message: 'มีปัญหาการดึงยอดเทิน กรุณารอสักครู่ :  '+tmpDataHist.msgerror,
                                            auth : false,
                                            data : [],
                                        }
                                    );
                                    return;
                                }
                            }
                            else
                            {
                                tmpDataHist = await AgentMain.getCreditHistory("",user_info['id'],turn_date ,toDate,0,0);
                                if (tmpDataHist.msgerror) 
                                {
                                    res.status(200).json(
                                        { 
                                            status: 'error', 
                                            message: 'มีปัญหาการดึงยอดเทิน กรุณารอสักครู่ :  '+tmpDataHist.msgerror,
                                            auth : false,
                                            data : [],
                                        }
                                    );
                                    return;
                                }
                            }
                            

                            for (let index = 0; index < tmpDataHist.length; index++) 
                            {
                                const element = tmpDataHist[index];
                                sumwinloss += Math.abs(tmpDataHist[index]['amount']);
                                sumwinloss2 += tmpDataHist[index]['amount'];
                            }

                            // let sql = `SELECT turnover,winloss FROM bet_log WHERE username='${user_info['id']}' and date >= '${timerHelper.convertDatetimeToString(turn_date)}' and date <= '${timerHelper.convertDatetimeToString(toDate)}' `;
                            // let tmpTurn = MainModel.query(sql);

                            
                            // for (let index = 0; index < tmpTurn.length; index++) 
                            // {
                            //     const element = tmpTurn[index];
                            //     sumwinloss += Math.abs(tmpTurn[index]['winloss']);
                            //     sumwinloss2 += tmpTurn[index]['winloss'];
                            // }

                            let user_bankid = user_info['bank_id'];
                            let currentCredit = user_info['credit'];
                            if (user_info['accept_promotion']!=0) 
                            {
                                currentCredit = user_info['alias_credit'];    
                            }

                            
                            if((currentCredit >= withdraw_amount) && currentCredit != 0)
                            {
                                
						        MaxWithdraw = withdraw_amount;

                                let tmp_check_promotion2 =  MainModel.query(`
                                    select * 
                                    from meta_promotion
                                    where username = '${user_info['id']}' and status = 1 order by date desc
                                    `);
                                                      
                                    
                                if (tmp_check_promotion2.length > 0) 
                                {
                                    let tmp_check_promotion = tmp_check_promotion2[0];
                                    
                                    tmp_pro = JSON.parse(tmp_check_promotion['value']);
                                    withdraw_amount = parseFloat(currentCredit);                                    
                                    let tmp_pro_MaxWithdraw = tmp_pro['MaxWithdraw'] ? parseFloat(tmp_pro['MaxWithdraw']) : 0;
                                    if(tmp_pro_MaxWithdraw!=0 && MaxWithdraw > tmp_pro_MaxWithdraw){
                                        MaxWithdraw = tmp_pro_MaxWithdraw;
                                    }
                                    note = 'You still use promotion '+tmp_pro['bonus_name']+' max withdraw = '+tmp_pro_MaxWithdraw+' decrease all credit '+withdraw_amount;
                                    
                                    if(tmp_pro['TurnTypeWithdraw'] == "turnover")
                                    {
                                        if(needTurn != 0)
                                        {
                                            //New Turn Over
                                            let bet = sumwinloss;
                                            if (bet < needTurn)
                                            {
                                                res.status(200).json(
                                                    { 
                                                        status: 'error', 
                                                        message: 'sum betting less than turn over. please bet '+ (needTurn-bet),
                                                        auth : true,
                                                        data : [],
                                                    }
                                                );
                                                return;
                                            }                                          

                                        }
                                    }
                                    else if(tmp_pro['TurnTypeWithdraw'] == "credit")
                                    {
                                        if(currentCredit < needTurn){
                                            res.status(200).json(
                                                { 
                                                    status: 'error', 
                                                    message: 'Remain credit less than turn ',
                                                    auth : true,
                                                    data : [],
                                                }
                                            );
                                            return;
                                        }
                                    }

                                }
                                else if (needTurn > 0)
                                {

                                    let bet = sumwinloss;
                                    
                                    if (bet < needTurn ) 
                                    {                
                                        
                                        res.status(200).json(
                                            { 
                                                status: 'error', 
                                                message: 'Need turn over more remain : '+ (needTurn-bet),
                                                auth : true,
                                                data : [],
                                            }
                                        );
                                        return;
                                    }

                                    
                                }
                            }
                            else 
                            {
                                res.status(200).json(
                                    { 
                                        status: 'error', 
                                        message: 'Credit is insufficient your credit is '+currentCredit,
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;
                            }

                        }
                      
                        

                        let id =  TransactionList.generateRequestID('withdraw');

                        let aff = {
                            aff_user:null,
                            aff_user_credit:0,
                        };
                        
                        if (user_info['accept_promotion']!=0)
                        {
                            const resultWithdraw = await AgentMain.withdrawCreditByUsername("",user_info['alias_id'],withdraw_amount);
                            if (resultWithdraw.msgerror) 
                            {                                
                                res.status(200).json(
                                    { 
                                        status: 'error', 
                                        message: 'Agent Problem : ' +resultWithdraw.msgerror,
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;
                            }
                            else
                            {
                                if (withdraw_amount>MaxWithdraw) 
                                {
                                    withdraw_amount=MaxWithdraw;
                                }

                                console.log("withdraw_amount");
                                console.log(withdraw_amount);

                                await TransactionManage.create(id, user_info, null,
                                    withdraw_amount, 0, user_info.alias_credit, 0, "WITHDRAW"
                                    , user_info.bank_acc_no, user_info.bank_name
                                    , timerHelper.convertDatetimeToString(cTime), ''
                                    , tmp_pro['bonus_name'] ? tmp_pro['bonus_name'] : null
                                    , tmp_pro['pro_id'] ? tmp_pro['pro_id'] : null
                                    , null,null,null
                                    , null,0, timerHelper.convertDatetimeToString(cTime)
                                    , note
                                    ,null,null,null
                                    , aff['aff_user'], null, aff['aff_user_credit']
                                );                            
                            
                                MemberList.updateCreditAndAlias(user_info['id'],user_info['credit'],user_info['alias_credit']-withdraw_amount);
                                MemberList.refreshAliasAccount(user_info['id']);
                                let tmpMember = await MemberList.findByID(user_info['id']);
                                let newAliasId = tmpMember.alias_id;
                                await AgentMain.reCreateUser(newAliasId,tmpMember.password);

                                
                            }
                            
                        }
                        else
                        {
   
                            const resultWithdraw = await AgentMain.withdrawCreditByUsername("",user_info['id'],withdraw_amount);
                            if (resultWithdraw.msgerror) 
                            {                                
                                res.status(200).json(
                                    { 
                                        status: 'error', 
                                        message: 'Agent Problem : ' +resultWithdraw.msgerror,
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;
                            }
                            else
                            {
                                console.log('Create Transaction');
                                await TransactionManage.create(id, user_info, null,
                                withdraw_amount, 0, user_info.credit, user_info.credit - withdraw_amount, "WITHDRAW"
                                , user_info.bank_acc_no, user_info.bank_name
                                , timerHelper.convertDatetimeToString(cTime), ''
                                , tmp_pro['bonus_name'] ? tmp_pro['bonus_name'] : null
                                , tmp_pro['pro_id'] ? tmp_pro['pro_id'] : null
                                , null,null,null
                                , null,0, timerHelper.convertDatetimeToString(cTime)
                                , note
                                ,null,null,null
                                , aff['aff_user'], null, aff['aff_user_credit']
                                );
                        
                                console.log("updateCreditAndAlias");
                                console.log(user_info['id'],user_info['credit']-withdraw_amount,user_info['alias_credit']);
                                MemberList.updateCreditAndAlias(user_info['id'],user_info['credit']-withdraw_amount,user_info['alias_credit']);
                            }
                            
                        }

                        console.log('update meta_promotion');
                        MainModel.update("meta_promotion",{status:0},{username:user_info['id']});

                        let userdata = user_info;


                        //Auto Transfer                                                
                        console.log('Auto Transfer');                                           
                        let withdraw_row = await TransactionList.findByID(id);        
                        
                        if ((withdraw_row.length>0) && autoWithdraw==1 && withdraw_amount<=maxAutoWithdraw) 
                        {
                            
                            let admin_banks = MainModel.queryFirstRow(`
									select *
									from admin_bank
									where status = 1 and bank_id in (1,5) and (bank_type = 'WITHDRAW' or bank_type = 'BOTH' ) and (work_type = 'NODE' or work_type = 'IBK')
                                `);
                            

                            if (admin_banks) 
                            {
                                

                                let tmpMeta = JSON.parse(admin_banks['meta_data']);
                                admin_banks['meta_data']= tmpMeta;
                                for (const [key,value] of Object.entries(tmpMeta))
                                {
                                    admin_banks[key] = value;
                                }

                                let admin_info = admin_banks;
                                
                                if(user_info['bank_id']==29)
								{
                                    
                                    //True Account
                                    // let acc = row_user['bank_acc_no'];									
									// let amount = parseFloat(withdraw_amount);

                                    // admin_banks = MainModel.query(`
									// 	select *
									// 	from admin_truewallet
									// 	where status = 1 
									// `);

                                    // let tmp_tw = [];
									// let bank_meta = [];

                                    // for (let index = 0; index < admin_banks.length; index++) {                                        
                                    //     tmp_tw[index] = admin_banks[index];
                                    //     let tmp_meta = JSON.parse(admin_banks[index]['meta_data']);
                                    //     for (const [key,value] of Object.entries(tmpMeta))
                                    //     {
                                    //         tmp_tw[index][key] = val;
                                    //     }
                                    // }

                                    // admin_info = [];
                                    // for (let index = 0; index < tmp_tw.length; index++) {
                                    //     const element = tmp_tw[index];
                                    //     if(element['tw_type_wallet'] == 'WITHDRAW'){
									// 		admin_info = element;				
									// 		break;
									// 	}
                                    // }

                                    // if (admin_info) 
                                    // {
                                        
                                    // }
                                
                                }
                                else
                                {
                                    //Bank Account                                                                        
                                    if (admin_info) 
                                    {
                                        
                                        if(admin_info['bank_id']==5)
                                        {                                            
                                            const scb_app_lib = new Scb_app_lib();
									        let scbtoken = admin_info['scb_app_token'] ? Cryptof.decryption(admin_info['scb_app_token']) : "";
                                            let token = admin_info['scb_app_token'] ? Cryptof.decryption(admin_info['scb_app_token']) : "";

                                            let amount 	= withdraw_amount;
											let acc 	= userdata['bank_acc_no'];
                                            const bankInfo = MainModel.getBankInfo(userdata['bank_id']);
											let bank_id = bankInfo['scb_id']?bankInfo['scb_id']:'';
                                            
                                            let resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                                            let data = [];
                                            let i = 0;

                                            let loginPass = false;

                                            // console.log(resp.data);
                                            if (resp['status'] && resp['status']!='error') 
                                            {
                                                if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                                {          
                                                    admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                                    SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);        
                                                    console.log(admin_info['bank_acc_number'] + "Auto Transfer Login : (Balance : $"+ admin_info['meta_data']['balance']  +")");
                                                    loginPass = true;
                                                }
                                                else
                                                {
                                                    console.log("Auto Transfer New Login");                                        
                                                    token = "";										

                                                    let api_refresh = admin_info['meta_data']['api_refresh']!=''?Cryptof.decryption(admin_info['meta_data']['api_refresh']):'';
                                                    let deviceid  = admin_info['meta_data']['deviceid']!=''?Cryptof.decryption(admin_info['meta_data']['deviceid']):'';
                                                        
                                                    token = await scb_app_lib.Login2(deviceid,admin_info['meta_data']['password']);

                                                    scbtoken = token;
                                                    
                                                    if (token) 
                                                    {                                            
                                                        admin_info['meta_data']['scb_app_token'] = Cryptof.encryption(token);                                            
                                                        resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                                                        console.log(resp.data);
                                                        if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                                        {
                                                            admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                                        }                                            
                                                        SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);                                            
                                                        console.log(admin_info['bank_acc_number'] + " : Auto Transfer Relogin (Balance : $"+ admin_info['meta_data']['balance']  +")");    
                                                        
                                                        loginPass = true;
                                                    }
                                                    else
                                                    {                                            
                                                        console.log('Login Failed '+ admin_info['bank_acc_number']);                                                        
                                                    }
                                                }
                                            }
                                            else
                                            {                                    
                                                console.log('Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message);                                               
                                            }

                                            console.log("Login Pass : ",loginPass);

                                            if (bank_id!='' && loginPass) 
                                            {
                                                let response = await scb_app_lib.TransferAuto(scbtoken,admin_info['bank_acc_number'],acc,bank_id,amount);    
                                                if(response['status'] == "success")
                                                {
                                                    
                                                    TransactionManage.withdrawApprove(id,user_info,"SYSTEM",1,timerHelper.convertDatetimeToString(cTime),"อนุมัติ ถอนเงิน โดย SYSTEM AUTO BANK"
                                                        ,admin_info['bank_acc_number'],admin_info['bank_acc_number'],admin_info['bank_name'],"SCBAPI"
                                                    )
                                                    
                                                    NoticeManage.createAdmin(userdata, 'success', 'อนุมัติถอนเงินแล้ว', 'รหัสทำรายการ : '+ withdraw_row['id'], '', 1);
                                                    NoticeManage.createMember(userdata, 'success', 'อนุมัติถอนเงินแล้ว', 'หมายเลขโทรศัพท์: ' + userdata.mobile_no + '<br>จำนวน : ' + amount + ' บาท<br>เวลาที่ถอนเงิน: ' + timerHelper.convertDatetimeToString(cTime), '', 1);
                                                    

                                                    let withdrawmessage = AdminSetting.findByID("withdrawmessage");
                                                    if (withdrawmessage) {
                                                        let tmpFormat = JSON.parse(withdrawmessage.value);
                                                        if (tmpFormat['wit_textfomrat']) {
                                                            let msgformat = tmpFormat['wit_textfomrat'];
                                                            const tag_value = {
                                                                "<@userid>": userdata['id'],
                                                                "<@fullname>": userdata['fullname'],
                                                                "<@telno>": userdata['mobile_no'],
                                                                "<@bankaccno>": userdata['bank_acc_no'],
                                                                "<@bankname>": userdata['bank_name'],
                                                                "<@amount>": amount,
                                                                "<@date>": timerHelper.convertDatetimeToString(cTime),
                                                                "<@approveby>": "SYSTEM",
                                                            };

                                                            for (const [key, value] of Object.entries(tag_value)) {
                                                                msgformat = msgformat.replaceAll(key, value);
                                                            }

                                                            const lineSetting = AdminSetting.findByID("line_token");
                                                            if (lineSetting) {
                                                                const token = JSON.parse(lineSetting.value);
                                                                const line_token = token['Withdraw'];

                                                                let response = "";
                                                                if (line_token) {
                                                                    response = await LineManage.sendNotify(line_token, msgformat);
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        const lineSetting = AdminSetting.findByID("line_token");
                                                        if (lineSetting) {
                                                            const token = JSON.parse(lineSetting.value);
                                                            const line_token = token['Withdraw'];

                                                            let msgformat = "";
                                                            msgformat += "═════════════\n";
                                                            msgformat += "🙁 อนุมัติถอนสำเร็จ 🙁\n";
                                                            msgformat += row_admin['am_username']+' อนุมัติ  \n';
                                                            msgformat += '😡 ถอนจำนวน: '+amount+' 😡 \n';
                                                            msgformat += "เงินล่าสุดมี " + userdata['credit'] - amount + " บาท \n";
                                                            msgformat += "เงินก่อนหน้ามี " + userdata['credit'] + " บาท \n";
                                                            msgformat += "Username : " + userdata['id'] + "\n";
                                                            msgformat += "ชื่อ : " + userdata['fullname'] + "\n";
                                                            msgformat += "เลขบัญชี : " + userdata['bank_acc_no'] + "\n";
                                                            msgformat += "ธนาคาร : " + userdata['bank_name'] + "\n";
                                                            msgformat += "เบอร์มือถือ : " + row_user['mobile_no'] + "\n";                                                        
                                                            msgformat += "เลขที่รายการ : " + id + "\n";
                                                            msgformat += "วันที่ : " + timerHelper.convertDatetimeToString(cTime) + "\n";
                                                            msgformat += "═════════════\n";

                                                            let response = "";
                                                            if (line_token) {
                                                                response = await LineManage.sendNotify(line_token, msgformat);
                                                            }
                                                        }
                                                    }
                    
                                                    res.status(200).json(
                                                        { 
                                                            status: 'success', 
                                                            message: 'Auto withdraw system is operationing.',
                                                            auth : true,
                                                            data : [],
                                                        }
                                                    );

                                                    return;

                                                }
                                               
                                            }
                                            
                                        }    
                                        else if(admin_info['bank_id']==1)
                                        {

                                            let kPlus =new KPlusClass();                                            
                                            let kbankurl = admin_info['url'] ? Cryptof.decryption(admin_info['url']) : "";    
                                            kPlus.endpoint =  kbankurl;

                                            let amount 	= withdraw_amount;
											let acc 	= userdata['bank_acc_no'];
                                            const bankInfo =MainModel.getBankInfo(userdata['bank_id']);
											let bank_id = bankInfo['kbank_id']?bankInfo['kbank_id']:'';

                                            let loginPass = false;
                                            const check = await kPlus.getBalance();
                                            if (check['availableBalance']) 
                                            {
                                                admin_info['meta_data']['balance'] = check['availableBalance'] ? parseFloat(check['availableBalance'].replace(',','')) : 0.00;
                                                admin_info['balance'] = check['availableBalance'] ? parseFloat(check['availableBalance'].replace(',','')) : 0.00;                                                

                                                KBankModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);

                                                console.log(admin_info['bank_acc_number'] + " : "+admin_info['meta_data']['balance']);
                                                loginPass = true;
                                            }
                                            else
                                            {              
                                                console.log('Cannot Login '+ admin_info['bank_acc_number'] +' : '+ check['error']);
                                                
                                            }
                                            
                                            if (bank_id!='' && loginPass) 
                                            {
                                                let bank_code = bank_id.toString().padStart(3, "0");
                                                let response = kPlus.KbankTransferAuto(kbankurl , bank_code ,acc,amount );
                                                if(response['status'] == "success")
                                                {                                                    
                                                    
                                                    TransactionManage.withdrawApprove(id,user_info,"SYSTEM",1,timerHelper.convertDatetimeToString(cTime),"อนุมัติ ถอนเงิน โดย SYSTEM AUTO BANK"
                                                        ,admin_info['bank_acc_number'],admin_info['bank_acc_number'],admin_info['bank_name'],"KBANKAPI"
                                                    )
                                                    
                                                    NoticeManage.createAdmin(userdata, 'success', 'อนุมัติถอนเงินแล้ว', 'รหัสทำรายการ : '+ withdraw_row['id'], '', 1);
                                                    NoticeManage.createMember(userdata, 'success', 'อนุมัติถอนเงินแล้ว', 'หมายเลขโทรศัพท์: ' + userdata.mobile_no + '<br>จำนวน : ' + amount + ' บาท<br>เวลาที่ถอนเงิน: ' + timerHelper.convertDatetimeToString(cTime), '', 1);
                                                    

                                                    let withdrawmessage = AdminSetting.findByID("withdrawmessage");
                                                    if (withdrawmessage) {
                                                        let tmpFormat = JSON.parse(withdrawmessage.value);
                                                        if (tmpFormat['wit_textfomrat']) {
                                                            let msgformat = tmpFormat['wit_textfomrat'];
                                                            const tag_value = {
                                                                "<@userid>": userdata['id'],
                                                                "<@fullname>": userdata['fullname'],
                                                                "<@telno>": userdata['mobile_no'],
                                                                "<@bankaccno>": userdata['bank_acc_no'],
                                                                "<@bankname>": userdata['bank_name'],
                                                                "<@amount>": total_deposit_credit,
                                                                "<@date>": timerHelper.convertDatetimeToString(cTime),
                                                                "<@approveby>": "SYSTEM",
                                                            };

                                                            for (const [key, value] of Object.entries(tag_value)) {
                                                                msgformat = msgformat.replaceAll(key, value);
                                                            }

                                                            const lineSetting = AdminSetting.findByID("line_token");
                                                            if (lineSetting) {
                                                                const token = JSON.parse(lineSetting.value);
                                                                const line_token = token['Withdraw'];

                                                                let response = "";
                                                                if (line_token) {
                                                                    response = await LineManage.sendNotify(line_token, msgformat);
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        const lineSetting = AdminSetting.findByID("line_token");
                                                        if (lineSetting) {
                                                            const token = JSON.parse(lineSetting.value);
                                                            const line_token = token['Withdraw'];

                                                            let msgformat = "";
                                                            msgformat += "═════════════\n";
                                                            msgformat += "🙁 อนุมัติถอนสำเร็จ 🙁\n";
                                                            msgformat += row_admin['am_username']+' อนุมัติ  \n';
                                                            msgformat += '😡 ถอนจำนวน: '+amount+' 😡 \n';
                                                            msgformat += "เงินล่าสุดมี " + userdata['credit'] - amount + " บาท \n";
                                                            msgformat += "เงินก่อนหน้ามี " + userdata['credit'] + " บาท \n";
                                                            msgformat += "Username : " + userdata['id'] + "\n";
                                                            msgformat += "ชื่อ : " + userdata['fullname'] + "\n";
                                                            msgformat += "เลขบัญชี : " + userdata['bank_acc_no'] + "\n";
                                                            msgformat += "ธนาคาร : " + userdata['bank_name'] + "\n";
                                                            msgformat += "เบอร์มือถือ : " + row_user['mobile_no'] + "\n";                                                        
                                                            msgformat += "เลขที่รายการ : " + id + "\n";
                                                            msgformat += "วันที่ : " + timerHelper.convertDatetimeToString(cTime) + "\n";
                                                            msgformat += "═════════════\n";

                                                            let response = "";
                                                            if (line_token) {
                                                                response = await LineManage.sendNotify(line_token, msgformat);
                                                            }
                                                        }
                                                    }
                    
                                                    res.status(200).json(
                                                        { 
                                                            status: 'success', 
                                                            message: 'Auto withdraw system is operationing.',
                                                            auth : true,
                                                            data : [],
                                                        }
                                                    );

                                                    return;

                                                }
                                            }
                                        }
                                        else
                                        {

                                        }
                                    }
                                }


                            }


                        }


                        //Send Line                        
                        const lineSetting = AdminSetting.findByID("line_token");
                        if (lineSetting) {
                            const token = JSON.parse(lineSetting.value);
                            const line_token = token['Withdraw'];

                            let msgformat = "";
                            msgformat += "═════════════\n";
                            msgformat += "🙁 มีรายการแจ้งถอน 🙁\n";                            
                            msgformat += '😡 ถอนจำนวน: '+withdraw_amount+' 😡 \n';
                            
                            if (user_info['accept_promotion']!=0) 
                            {
                                msgformat += "เงินล่าสุดมี " + (parseInt(user_info['alias_credit']) - withdraw_amount) + " บาท \n";
                                msgformat += "เงินก่อนหน้ามี " + parseInt(user_info['alias_credit']) + " บาท \n";
                            }
                            else
                            {
                                msgformat += "เงินล่าสุดมี " + (parseInt(user_info['credit']) - withdraw_amount) + " บาท \n";
                                msgformat += "เงินก่อนหน้ามี " + parseInt(user_info['credit']) + " บาท \n";
                            }
                            
                            msgformat += "Username : " + user_info['id'] + "\n";
                            msgformat += "ชื่อ : " + user_info['fullname'] + "\n";
                            msgformat += "เลขบัญชี : " + user_info['bank_acc_no'] + "\n";
                            msgformat += "ธนาคาร : " + user_info['bank_name'] + "\n";
                            msgformat += "เบอร์มือถือ : " + user_info['mobile_no'] + "\n";                                                        
                            msgformat += "เลขที่รายการ : " + id + "\n";
                            msgformat += "วันที่ : " + timerHelper.convertDatetimeToString(cTime) + "\n";
                            msgformat += "═════════════\n";

                            let response = "";
                            if (line_token) {
                                response = await LineManage.sendNotify(line_token, msgformat);
                            }
                        }

                        //Notice
                        NoticeManage.createAdmin(userdata, 'info', 'ขอถอนเงิน', 'หมายเลขโทรศัพท์: ' + user_info.mobile_no + '<br>จำนวน : ' + withdraw_amount + ' <br>เวลา: ' + timerHelper.convertDatetimeToString(cTime), '', 1);

                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: 'Auto withdraw system is operationing.',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                        

                    }
                    else
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Withdraw amount must more than 0',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
    
                                 
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                    );
                }
            
            }
        }
    } 
    catch (error) 
    {
        console.log(error);
        
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
        return;
    }
   

};

exports.changePasswordMemberByID = async function(req, res) {
    console.log('changePasswordMemberByID');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let checkPassword = MemberList.checkPassword(userid,req.body.oldpassword);
                    
                    if (checkPassword) 
                    {
                        let response = await AgentMain.changePassword("",req.body.username,req.body.oldpassword,req.body.newpassword);
                        if (response.msgerror) 
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: response.msgerror,
                                    auth : false,
                                    data : [],
                                }
                            );
                        }
                        else
                        {
                            let tmpData = MemberList.changePassword(req.body);
                            
                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: '',
                                    auth : true,                        
                                    data : tmpData,
                                }
                                );
                        }
                    }
                    else
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Old password is incorrect',
                                auth : false,
                                data : [],
                            }
                            );
                    }
                    

                    
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {        
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getAffiliateMemberByID = async function(req, res) {
    console.log('getAffiliateMemberByID');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
    // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
    const ipAllowList = IpAllowList.findById(ipAddress);    
    const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let tmpData = MemberList.getAffiliateMemberByID(req.body.username);                
                    // console.log(tmpData);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error(),
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getAffiliateCreditMemberByID = async function(req, res) {
    console.log('getAffiliateCreditMemberByID');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let tmpData = MemberList.getAffiliateCreditMemberByID(userid);                
                    // console.log(tmpData);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error(),
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getCurrentAffiliateCreditMemberByID = async function(req, res) {
    console.log('getCurrentAffiliateCreditMemberByID');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let tmpData = MemberList.getCurrentAffiliateCreditMemberByID(userid);                
                    // console.log(tmpData);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error(),
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.withdrawAff = async function(req, res) {
    console.log('withdrawAff');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let row_user = MemberList.findByID(userid);
                    let credit_bonus = row_user['credit_bonus'];

                    let aff_setting = AdminSetting.findByID("affiliate");
                    let tmpMeta = aff_setting.value;

                    for (const [key,value] of Object.entries(tmpMeta)) 
                    {
                        aff_setting[key] = value;                    
                    }
                    let MinTransfer = aff_setting['MinTransfer']? aff_setting['MinTransfer'] : 0;

                    if(row_user['credit_aff'] >= MinTransfer && row_user['credit_aff'] > 0)
                    {
                        let credit = parseFloat(row_user['credit_aff']);
                        let id = TransactionList.generateRequestID("deposit");

                        let response = await AgentMain.depositCredit("",row_user['id'],credit);
                        if (response) 
                        {
                            let aff = {
                                aff_user:null,
                                aff_user_credit:0,
                            };
                        
                            TransactionManage.create(id, row_user, "SYSTEM",
                            0, credit_bonus, row_user.credit, row_user.credit + credit, "AFF"
                            , row_user.bank_acc_no, row_user.bank_name
                            , timerHelper.convertDatetimeToString(new Date()), ''
                            , null
                            , null
                            , null,"SYSTEM", 1
                            , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                            , "ได้รับเงินจากกระเป๋าเชิญเพื่อน"
                            ,null,null,null
                            , aff['aff_user'], null, aff['aff_user_credit']
                            );

                            MainModel.update("sl_users",{credit:row_user['credit']+credit, credit_aff:0},{id:row_user['id']});                        
                            
                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: 'You got credit : '+ credit,
                                    auth : true,
                                    data : [],
                                }
                            );
                        }
                        else
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'Have problem about agent service ',
                                    auth : false,
                                    data : [],
                                }
                                );
                        }
                    
                    }else{
                        
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Minimum for withdraw is '+ MinTransfer,
                                auth : false,
                                data : [],
                            }
                            );
                    }

                    
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {        
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getNameAuto = async function(req, res) {
    console.log('getNameAuto');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            // const headers = req.headers;

            //handles null error
            // if (headers.userid.length === 0 || headers.token.length === 0) 
            if (false) 
            {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } 
            else {

                // const userid = headers.userid;
                // const token = headers.token;

                // let IsAuth = MemberList.isAuthenicated(userid,token);
                let IsAuth = true;

                if (IsAuth) 
                {
                    let tmpSetting = AdminSetting.findByID("getname_auto");
                    
                    let AutoNameSetting = JSON.parse(tmpSetting.value);

                    if (AutoNameSetting.enable==0) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Get Name Auto is off',
                                auth : true,
                                data : [],
                            }
                            );
                    }
                    else
                    {
                        let bank_id = req.body.bank_id;
                        let bank_acc_no = req.body.bank_acc_no;
                        if (bank_id==29) 
                        {
                            //True
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: "True Wallet can't get auto name ",
                                    auth : true,
                                    data : [],
                                }
                            );
                        }
                        else
                        {
                            let admin_banks = AdminBankList.findAllActive("");
                            for (let index = 0; index < admin_banks.length; index++) {
                                const element = admin_banks[index];                                
                                for(const [key,value] of Object.entries(JSON.parse(element.meta_data)))
                                {
                                    admin_banks[index][key] = value;
                                }                                
                            }

                            let admin_info = [];
                            for (let index = 0; index < admin_banks.length; index++) {
                                const element = admin_banks[index];
                                if (element['work_type']=="NODE" || element['work_type']=="IBK") 
                                {
                                    admin_info = element;
                                    break;
                                }
                            }
                            
                            console.log(req.body);

                            if (admin_info['bank_id']==5) 
                            {
                                const scb_app_lib = new Scb_app_lib();                                
                                let scbtoken = admin_info['scb_app_token'] ? Cryptof.decryption(admin_info['scb_app_token']) : "";
                                const bankInfo = MainModel.getBankInfo(bank_id);
                                let bank_code = bankInfo['scb_id']?bankInfo['scb_id']:'';
                                let tmpData = await scb_app_lib.GetName(scbtoken,admin_info['bank_acc_number'],bank_acc_no,bank_code);
                                
                                if(tmpData['status'] == 'success')
                                {										
                                    console.log(tmpData);
                                    let fullname = tmpData['data']['fullname'] ? tmpData['data']['fullname'] : '';
                                    
                                    res.status(200).json(
                                        { 
                                            status: 'success', 
                                            message: "",
                                            auth : true,
                                            data : fullname,
                                        }
                                    );
                                                                        
                                }
                                else
                                {
                                    res.status(200).json(
                                        { 
                                            status: 'error', 
                                            message: "Can't get auto name ",
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                }
                            }
                            else if (admin_info['bank_id']==1) 
                            {
                                let kPlus =new KPlusClass();
                                kbankurl = admin_info['url'] ? Cryptof.decryption(admin_info['url']) : "";      
                                kPlus.endpoint = kbankurl; 

                                let amount 	= 1;                                
                                const bankInfo =MainModel.getBankInfo(bank_id);
                                let bank_code = bankInfo['kbank_id']?bankInfo['kbank_id']:'';
                                
                                if (bank_code!='') 
                                {
                                    bank_code = bank_code.toString().padStart(3, "0");
                                    let response = await kPlus.transferVerify(bank_code ,bank_acc_no,amount);

                                    if(response['toAccountName'])
                                    {                            
                                        let fullname = response['toAccountName'] ? response['toAccountName'] : '';

                                        if(fullname)
                                        {                                            
                                            let str_arr = fullname.split(" ");                                            
                                            fullname = str_arr[1]+' '+str_arr[2];

                                            res.status(200).json(
                                                { 
                                                    status: 'success', 
                                                    message: "",
                                                    auth : true,
                                                    data : fullname,
                                                }
                                            );
                                            return;
                                        }                                       
                                    }

                                    res.status(200).json(
                                        { 
                                            status: 'error', 
                                            message: "Can't get auto name ",
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                    return;
                                }
                                else
                                {
                                    res.status(200).json(
                                        { 
                                            status: 'error', 
                                            message: "Can't get auto name ",
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                }
                            }
                            else
                            {
                                res.status(200).json(
                                    { 
                                        status: 'error', 
                                        message: "Can't get auto name ",
                                        auth : true,
                                        data : [],
                                    }
                                );
                            }
                        }
                    }
                    
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {        
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getUserPromotion = async function(req, res) {
    console.log('getUserPromotion');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        const ipAllowList = IpAllowList.findById(ipAddress);    
        
        if (ipAllowList.length==0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } 
            else 
            {
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = MemberList.isAuthenicated(userid,token);
    
                if (IsAuth) 
                {
                    let tmpUser = MemberList.findByID(req.body.username);
                    let tmpData = MemberList.getActiveUserPromotion(tmpUser.id,tmpUser.mobile_no);

                    let tmpData2 = [];                    
                    let taken_turn = 0;
                    let needTurn = 0;

                    if (tmpUser.accept_promotion!=0) 
                    {
                        if (tmpData.length>0) 
                        {
                            
                            const tmpActivePromotion = JSON.parse(tmpData[0]['value']);

                            if (tmpActivePromotion['TurnTypeWithdraw']=='turnover') 
                            {
                                let create_at = tmpUser['create_at'];
                                let turn_date = tmpUser['turn_date']?tmpUser['turn_date']:create_at;
                                needTurn = tmpUser['turn'];

                                turn_date = new Date(turn_date.getTime() + (offsetTime));                                
                                
                                tmpData.needTurn=needTurn;

                                let toDate = new Date();
                                toDate.setDate(toDate.getDate()+1);
                                toDate = new Date(toDate.getTime() + (offsetTime));

                                console.log(tmpUser['alias_id'],turn_date ,toDate);
                                let tmpDataHist = await AgentMain.getCreditHistoryAlias("",tmpUser['id'],turn_date ,toDate,0,0);
                                if (tmpDataHist.msgerror) 
                                {

                                }
                                else
                                {
                                    for (let index = 0; index < tmpDataHist.length; index++) 
                                    {
                                        const element = tmpDataHist[index];
                                        taken_turn += Math.abs(element['amount']);
                                    }
                                }
                            }
                            else
                            {
                                needTurn = tmpUser['turn'];
                            }
                            
                        }
                        
                    }                    

                    tmpData2 = {
                        taken_turn:taken_turn,
                        credit:tmpUser['credit'],
                        alias_credit:tmpUser['alias_credit'],
                        need_turn:needTurn,
                    };

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
                            data2 : tmpData2,
                        }
                    );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
   
    

   
};

exports.getDailyDepositInfoMemberByID = async function(req, res) {
    console.log('getDailyDepositInfoMemberByID');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let username =req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let tmpSetting = AdminSetting.findByID("dailydepositreward");

                    for (const [key,value] of Object.entries(JSON.parse(tmpSetting.value))) 
                    {
                        tmpSetting[key]=value;
                    }

                    let row_user = MemberList.findByID(username);
                    let morecredit = tmpSetting['morecredit'];
                    let parent = row_user.parent;
                    let countday =  tmpSetting['countday'];
                    let reward = 0;

                    let querydata = MemberList.getDailyDepositMemberByID(morecredit,req.body.username,parent,countday);

                    let dailydata = [];
                    for (let i=0; i < countday; i++) { 
                        dailydata.push({
                            check:0,
                            date:null,
                            date2:null  
                        });                        
                    }

                    let j=0;                    
                    let countDeposit=0;

                    let cTime = new Date();
                    cTime = new Date(cTime.getTime() + (offsetTime));

                    if (!querydata) {
                        tmpDate = querydata[0]['date'];
                        dailydata[j]['check'] = 1;
                        dailydata[j]['date'] =tmpDate;
                    }
                    else
                    {
                        dailydata[j]['check'] = 1;
                        dailydata[j]['date'] = cTime;
                    }

                    for (let i=0; i < querydata.length ; i++) { 
                        let loopDate = new DateTime(querydata[i]['date']);
                        if (loopDate===tmpDate) {
                            dailydata[i]['check'] = 1;
                            dailydata[i]['date'] = loopDate;                            
                            tmpDate.setDate(tmpDate.getDate() + 1);
                            countDeposit++;
                        }
                        else {
                            break;
                        }					
                    }

                    if (countDeposit>=countday) {
                        reward=tmpSetting['reward']?tmpSetting['reward']:0;
                    }


                    let returnData = {
                        dailydata : dailydata,
                        countDeposit : countDeposit,
                        countday : countday,
                        reward : reward
                    };

                    // console.log(tmpData);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : returnData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getDailyDepositMemberByID = async function(req, res) {
    console.log('getDailyDepositMemberByID');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let username =req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let tmpSetting = AdminSetting.findByID("dailydepositreward");

                    for (const [key,value] of Object.entries(JSON.parse(tmpSetting.value))) 
                    {
                        tmpSetting[key]=value;
                    }

                    let row_user = MemberList.findByID(username);
                    let morecredit = tmpSetting['morecredit'];
                    let parent = row_user.parent;
                    let countday =  tmpSetting['countday'];
                    let reward = 0;

                    let querydata = MemberList.getDailyDepositMemberByID(morecredit,req.body.username,parent,countday);

                    let dailydata = [];
                    for (let i=0; i < countday ; i++) { 
                        dailydata.push({
                            check:0,
                            date:null,
                            date2:null  
                        });                        
                    }

                    let j=0;                    
                    let countDeposit=0;

                    let cTime = new Date();
                    cTime = new Date(cTime.getTime() + (offsetTime));

                    if (!querydata) {
                        tmpDate = querydata[0]['date'];
                        dailydata[j]['check'] = 1;
                        dailydata[j]['date'] =tmpDate;
                    }
                    else
                    {
                        
                        dailydata[j]['check'] = 1;
                        dailydata[j]['date'] = cTime;
                    }

                    for (let i=0; i < querydata.length ; i++) { 
                        let loopDate = new DateTime(querydata[i]['date']);
                        if (loopDate===tmpDate) {
                            dailydata[i]['check'] = 1;
                            dailydata[i]['date'] = loopDate;                            
                            tmpDate.setDate(tmpDate.getDate() + 1);
                            countDeposit++;
                        }
                        else {
                            break;
                        }					
                    }

                    if (countDeposit>=countday) {
                        reward=tmpSetting['reward']?tmpSetting['reward']:0;
                    }
                   
                    if (reward==0) {

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Cannot get daily deposit reward',
                                auth : false,
                                data : [],
                            }
                            );
                        return;
                    }
                    else
                    {

                        for (let i=0; i < querydata.length ; i++) {
                            let tmp_data = {
                                'parent'		: parent,	
                                'agent'			: row_user.agent,						
                                "username"		: username,							
                                "date"			: getDateTimeNowString(querydata[i]['date']),
                                "claimed"		: 1,
                                "claimdate"		: getDateTimeNowString()
                            };
                            MainModel.insert('daily_deposit_claimed',tmp_data);                            
                        }

                        let id = TransactionList.generateRequestID("daily_deposit_claimed");

                        let oldusername = row_user['id'];
					
						if (row_user['accept_promotion']>0) 
						{							
							row_user['id']	= row_user['alias_id'];
						}	
					
                        let response = await AgentMain.depositCredit("",username,reward);
                        row_user['id'] = oldusername;

                        if (response.msgerror) 
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'Agent Problem : ' + response.msgerror,
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }
                        else
                        {
                            let tmp_data2 = {
                                "id" 					: id,
                                "username" 				: username,
                                "reward_description" 	: 'Login ติดกัน 15 วัน ได้รับ '+ reward+' เครดิต',
                                "reward_type"			: "DAILYLOGIN",
                                "credit" 				: reward,
                                "date" 					: timerHelper.convertDateToString(cTime),
                                "note" 					: "",
                                "status" 				: 1
                            };

                            MainModel.insert("reward_history",tmp_data2);
                           
                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: 'You got credit '+reward,
                                    auth : true,                        
                                    data : [],
                                }
                                );
                            return;
                         
                        }
                       
                    }
                   
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.chooseLuckyCard = async function(req, res) {
    console.log('chooseLuckyCard');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let username =req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let row_user = MemberList.findByID(username);
                    let tmpSetting = AdminSetting.findByID("card_setting");

                    for (const [key,value] of Object.entries(JSON.parse(tmpSetting.value))) 
                    {
                        tmpSetting[key]=value;
                    }

                    let max_user_collect = tmpSetting['max_user_collect'];

                    if(tmpSetting['enable']==0){                        

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Lucky Card is not service',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    let check_per_day  = MainModel.queryFirstRow(`
                        select count(*) c
                        from reward_history
                        where reward_type = 'CARD' and date like '${timerHelper.getDateNowString()}%'
                    `);

                    check_per_day = check_per_day['c'] ? check_per_day['c'] : 0;

                    if(check_per_day >= tmpSetting['max_collect']){                       

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: "Today Can't open card anymore.",
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    let start_time = new Date();
                    let end_time = new Date()
                    end_time.setDate(end_time.getDate() +1);
                    
                    let tmp_check = MainModel.query(`
                        select *
                        from reward_history
                        where date >= '${timerHelper.convertDatetimeToString(start_time)}"' AND date < '${timerHelper.convertDatetimeToString(end_time)}' and (username = '${username}') and reward_type = 'CARD'
                    `);

                    let countReward = 0;
                    if(tmp_check){
                        if (tmp_check.length > max_user_collect) {
                            let msg ='Open card '+ max_user_collect +' per day';
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: msg,
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                            	
                        }

                        let tmp_data = [];
                        let weights= [];
                        let limit= [];

                        let maxPrice = 5;
                        let sum =0;

                        countReward = tmp_check.length;

                        let tmpCard = AdminSetting.findByID("card");

                        for (const [key,value] of Object.entries(JSON.parse(tmpCard.value))) 
                        {
                            tmpCard[key]=value;
                        }
                            
                        for(let i = 0; i<= maxPrice; i++){

                            tmp_data.push(
                                {
                                    'card_name' : tmpCard['card'][i],
                                    'card_credit' : tmpCard['card_credit'][i],
                                    'card_percent' : tmpCard['card_percent'][i],
                                    'card_percent_cal' : tmpCard['card_percent'][i]/100,
                                }
                            )

                            weights.push(tmpCard['card_percent'][i]/100);
                            limit.push(0);
                            sum += tmpCard['card_percent'][i];
                        }
                        
                        let currentLimit = 0;
                        for(let i = 0; i<= maxPrice; i++){			
                            weights[i] = tmpCard['card_percent'][i]/sum;
                            currentLimit += weights[i];
                            limit[i] = currentLimit;
                        }
                        
                        let sumweight = 0;
                        for(let i = 0;i<=maxPrice;i++){
                            sumweight += weights[i];
                        }

                        let randRound=1;
                        let selectReward =0;
                        for (let r=0; r < randRound; r++) { 
                            let randvalue =  currentLimit * Math.random();                        
                            selectReward = maxPrice;
                            for (let i=1; i <=maxPrice; i++) { 
                                if (randvalue < limit[i] ) {
                                    selectReward=i;
                                    break;
                                }
                            }
                        }

                        let result = selectReward;
				        let credit = parseFloat(tmpCard["card_credit"][result]);

                        if(credit>0)
                        {
                            let id = TransactionList.generateRequestID('card');
                            let response = await AgentMain.depositCredit("",row_user['id'],credit);
                            
                            if (response.msgerror) 
                            {
                                res.status(200).json(
                                    { 
                                        status: 'error', 
                                        message: 'Agent Problem : ' + response.msgerror,
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;
                            }
                            else
                            {

                                let tmp_data = {
                                    "id" 					: id,
                                    "username" 				: username,
                                    "reward_description" 	: 'สุ่มแล้ว ได้รับ '+credit+' เครดิต',
                                    "reward_type"			: "CARD",
                                    "credit" 				: credit,
                                    "date" 					: timerHelper.getDateTimeNowString(),
                                    "note" 					: "",
                                    "status" 				: 1
                                };

                                MainModel.insert("reward_history",tmp_data);

                                let tmpMeta = tmpSetting;
                                if (tmpMeta['turn']) 
                                {
                                    if (tmpMeta['turn']>0 && credit>0) 
                                    {
                                        let turn_check 		= 1;
                                        let turn_name 		= tmpMeta['turn_name']+' เครดิต '+credit+' บาท' ;
                                        let turn_input 		= tmpMeta['turn']*credit;
                                        let TurnTypeWithdraw 	= tmpMeta['TurnTypeWithdraw'];
                                        let turn_MaxWithdraw 	= tmpMeta['MaxWithdraw'];
                                        let promotion_cal = PromotionManage.customTurn(row_user,credit,
                                            {"Title" : turn_name, "turn" : turn_input, "MaxWithdraw" : turn_MaxWithdraw, "turnover_type" :TurnTypeWithdraw}                                            
                                        );
                                        let turnover = (promotion_cal['turnover']) ? promotion_cal['turnover'] : 0;

                                        MemberList.updateCreditAndTurnOver(username,parseFloat(row_user['credit'])+credit,row_user['turn']+turnover);
                                    }
                                }
                                else
                                {
                                    MemberList.updateCredit(username,parseFloat(row_user['credit'])+credit);
                                }

                                let userdata = row_user;

                                let aff = {
                                    aff_user:null,
                                    aff_user_credit:0,
                                };
                                
                                TransactionManage.create(id, row_user, "STAFF",
                                    credit, 0, parseFloat(userdata.credit), parseFloat(userdata.credit) + credit, "CARD"
                                    , userdata.bank_acc_no, userdata.bank_name
                                    , timerHelper.convertDatetimeToString(new Date()), ''
                                    , null
                                    , null
                                    , null,"SYSTEM", 1
                                    , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                                    , "เติมเงินจากการสุ่มไพ่"
                                    ,null,null,null
                                    , aff['aff_user'], null, aff['aff_user_credit']
                                );

                            }

                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'You got '+ credit+' credit',
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }
                        else
                        {                            
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'You got '+ credit+' credit',
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }

                    }
                    else
                    {
                        let msg ='Open card '+ max_user_collect +' ครั้งต่อวัน';                          
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: msg,
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }


                    
                                               
                    res.status(200).json(
                            { 
                                status: 'success', 
                                message: 'You got credit '+reward,
                                auth : true,                        
                                data : [],
                            }
                            );
                    return;
                        
                   
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                    );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getRefundMemberByID = async function(req, res) {
    console.log('getRefundMemberByID');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let username =req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let row_user = MemberList.findByID(username);
                    let tmpSetting = AdminSetting.findByID("refund");

                    for (const [key,value] of Object.entries(JSON.parse(tmpSetting.value))) 
                    {
                        tmpSetting[key]=value;
                    }
                  
                                         
                    let start_time = new Date();
                    let end_time = new Date()
                    start_time.setDate(end_time.getDate() -7);

                    let enable = tmpSetting['enable']?parseInt(tmpSetting['enable']):0;
                    if(enable==0){                       

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'ระบบปิดการใช้งานชั่วคราว',
                                auth : false,
                                data : [],
                            }
                        );
                        return;

                    }

                    // console.log(parseFloat(row_user['credit_free']));
                    // console.log(parseFloat(row_user['Minimum']));
                    // console.log(parseFloat(row_user['credit_free']) >= parseFloat(tmpSetting['Minimum']));
                    if (parseFloat(row_user['credit_free']) >= parseFloat(tmpSetting['Minimum']) ) 
                    {
                        let turn = 0;
			
                        if(parseInt(tmpSetting['Turn'])!=0){
                            turn = parseFloat(row_user['credit_free']) * parseFloat(tmpSetting['Turn']);
                        }

                        let fromDate = new Date();
			            let toDate = new Date();
                        toDate.setDate(toDate.getDate()+1);

                        let refund = MainModel.queryFirstRow(`
                                select sum(credit) Scredit, count(*) Ccredit
                                from report_transaction
                                where username = '${row_user['id']}' and (transaction_type = 'REFUND' )
                                and (date >= '${timerHelper.convertDatetimeToString(fromDate)}' and date< '${timerHelper.convertDatetimeToString(toDate)}')
                            `);

                        let refundcredit = refund['Scredit']?parseFloat(refund['Scredit']):0.00;

                        if(refundcredit>0)
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'คืนเครดิตเสียรับได้วันล่ะ 1 ครั้งเท่านั้น',
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }
                        
                        if(row_user['credit_free']<=0)
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'ไม่มีเครดิตฟรีให้รับ',
                                    auth : true,
                                    data : [],
                                }
                            );          
                            return;               
                        }

                        let response = await AgentMain.depositCredit("",row_user['id'],parseFloat(row_user['credit_free']));
                        // console.log(response);
                        if (response.msgerror) 
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'Agent Problem : ' + response.msgerror,
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }
                        else
                        {
                            let aff = {
                                aff_user:null,
                                aff_user_credit:0,
                            };                           
    
                            let genId = TransactionList.generateRequestID();
                            TransactionManage.create(genId, row_user, "SYSTEM",
                                parseFloat(row_user['credit_free']), 0, parseFloat(row_user['credit']), parseFloat(row_user['credit_free']) + parseFloat(row_user['credit']), "REFUND"
                                , row_user['bank_acc_no'], row_user['bank_name']
                                , timerHelper.convertDatetimeToString(new Date()), ''
                                , null
                                , null
                                , null,'SYSTEM', 1
                                , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                                , 'ได้รับเงินคืน'
                                ,null,null,null
                                , aff['aff_user'], null, aff['aff_user_credit']
                            )
    
                            MainModel.update("sl_users",{credit: parseFloat(row_user['credit']) + parseFloat(row_user['credit_free']),credit_free:0},{id:row_user['id']});

                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: 'ได้รับเงินคืน จำนวน ' + row_user['credit_free'],
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }

                    }
                    else
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'ยอดเงินคืนของคุณยังไม่ถึงยอดขั้นต่ำที่โอนได้',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }            
                   
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                    );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getuseronline = async function(req, res) {
    console.log('getuseronline');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth)             
                {
                    let tmpData = MemberList.getOnlineUser();
                    console.log("Online user : "+tmpData);

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                            
                            data : tmpData,
                        }
                        );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                        );
                }
            
            }
        }
        
    } catch (error) {
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    

   
};


exports.getCodefree = async function(req, res) {
    console.log('getCodefree');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let username =req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let row_user = MemberList.findByID(username);
                    let tmpSetting = AdminSetting.findByID("code_free");

                    for (const [key,value] of Object.entries(JSON.parse(tmpSetting.value))) 
                    {
                        tmpSetting[key]=value;
                    }

                    let promotionid = tmpSetting['promotion_id'];
                
                    if (promotionid==null) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Not have code free setting please contact support.',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
                    else
                    {
                        let promotion_setting = PromotionSetting.findByID(promotionid);                    
                                                       
                        let credit =  parseFloat(tmpSetting['freeCreditRegister']);
                        row_user['accept_promotion'] = promotionid;

                        let promotion_cal = PromotionManage.calPromotion(row_user,credit);

                        let bonus = promotion_cal['bonus'] ? parseFloat(promotion_cal['bonus']) : 0;
                        let turnover = promotion_cal['turnover'] ? parseFloat(promotion_cal['turnover']) : 0;
                        let total_deposit_credit = promotion_cal['total_deposit_credit'] ? parseFloat(promotion_cal['total_deposit_credit']) : credit;

                        total_deposit_credit = bonus;
                        let id =  TransactionList.generateRequestID();

                        if(promotion_cal['ForCreateTurn']['create_pro'] == true){
                            PromotionManage.createTurn(promotion_cal['ForCreateTurn']);
                        }
                        else
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'Cannot get promotion becuase some condition',
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }

                        row_user = MemberList.findByID(username);
                        let oldusername= row_user['id'];
                        if (row_user['accept_promotion']>0) 
                        {							
                            row_user['id']	= row_user['alias_id'];
                        }	
                        
                        let response = await AgentMain.depositCredit("",row_user['id'],total_deposit_credit);
                        row_user['id']	= oldusername;
                        
                        if (response.msgerror) 
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'Agent Problem : ' + response.msgerror,
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }
                        else
                        {
                            let userdata = row_user;

                            TransactionManage.create(id, row_user, "STAFF",
                                credit, bonus, userdata.credit, userdata.credit + total_deposit_credit, "CREDITFREE"
                                , '', ''
                                , timerHelper.convertDatetimeToString(new Date()), ''
                                , promotion_setting.Title?promotion_setting.Title:''
                                , promotionid?promotionid:0
                                , null,"SYSTEM", 1
                                , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                                , 'เครดิตฟรี'
                                ,null,null,null
                                , null, null, 0
                            )

                            let nextTurnOver = turnover;
                                                        
                            MemberList.updateCredit(username,parseFloat(row_user['credit'])-total_deposit_credit);
                            MemberList.updateCreditAndTurnOverAlias(username,parseFloat(row_user['credit'])+total_deposit_credit,nextTurnOver);
                            MemberList.changePromotion(username,promotionid,timerHelper.convertDatetimeToString(new Date()));
                            
                            LogList.create(
                                "รับเครดิตฟรี user :"+ row_user['id']+" , promotion id : "+ promotionid
                                ,"SYSTEM"
                                ,timerHelper.convertDatetimeToString(new Date())
                                ,req.body.parent);
                            
                                res.status(200).json(
                                    { 
                                        status: 'success', 
                                        message: '',
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;
                        }
                                                   
                    }

                   
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                    );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.checkCanSpinWheel = async function(req, res) {
    console.log('checkCanSpinWheel');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) 
            {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
             } else {

                const userid = headers.userid;
                const token = headers.token;

                let username =req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let row_user = MemberList.findByID(username);
                    let tmpSetting = AdminSetting.findByID("wheel_setting");

                    for (const [key,value] of Object.entries(JSON.parse(tmpSetting.value))) 
                    {
                        tmpSetting[key]=value;
                    }

                    let credit_collect = tmpSetting['credit_collect'];

                    if(tmpSetting['enable']==0){                        

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Wheel is not service',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    const wheelwinloss = tmpSetting['winloss'];

                    let check_per_day  = MainModel.queryFirstRow(`
                        select count(*) c
                        from reward_history
                        where reward_type = 'WHEEL' and date(date) like '${timerHelper.getDateNowString()}%'
                    `);

                    check_per_day = check_per_day['c'] ? check_per_day['c'] : 0;

                    if(check_per_day >= tmpSetting['max_collect']){                       

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: "Today Can't spin wheel anymore.",
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    let start_time = new Date();
                    let end_time = new Date()
                    start_time.setHours(0,0,0,0);
                    end_time.setDate(end_time.getDate() +1);
                    end_time.setHours(0,0,0,0);
                    
                    let tmp_check = MainModel.query(`
                        select *
                        from reward_history
                        where date >= '${timerHelper.convertDatetimeToString(start_time)}"' AND date < '${timerHelper.convertDatetimeToString(end_time)}' and (username = '${username}') and reward_type = 'WHEEL'
                    `);

                    let max_user_collect = parseInt(tmpSetting['max_user_collect']);

                    let countReward = 0;
                    console.log(`
                    select *
                    from reward_history
                    where date >= '${timerHelper.convertDatetimeToString(start_time)}"' AND date < '${timerHelper.convertDatetimeToString(end_time)}' and (username = '${username}') and reward_type = 'WHEEL'
                `);
                    console.log(tmp_check);

                    if(tmp_check){

                        

                        if (tmp_check.length > max_user_collect) {
                            let msg ='Can spin Wheel '+ max_user_collect +' per day';
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: msg,
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }

                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
                    else
                    {
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                                data : [],
                            }
                        );                        
                        return;
                    }

                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                    );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getSpinWheel = async function(req, res) {
    console.log('getSpinWheel');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            // console.log(headers.userid,headers.token);

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) 
            {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
             } else {

                const userid = headers.userid;
                const token = headers.token;

                let username =req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);
                
                if (IsAuth) 
                {
                    let row_user = MemberList.findByID(username);
                    let tmpSetting = AdminSetting.findByID("wheel_setting");
                    let credit = parseFloat(req.body.credit);

                    if (credit==null) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Fuck you man!!',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    if (credit==0) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Fuck you man!!',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    for (const [key,value] of Object.entries(JSON.parse(tmpSetting.value))) 
                    {
                        tmpSetting[key]=value;
                    }

                    let credit_collect = tmpSetting['credit_collect'];

                    if(tmpSetting['enable']==0){                        

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Wheel is not service',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    const wheelwinloss = tmpSetting['winloss'];

                    let check_per_day  = MainModel.queryFirstRow(`
                        select count(*) c
                        from reward_history
                        where reward_type = 'WHEEL' and date(date) like '${timerHelper.getDateNowString()}%'
                    `);

                    check_per_day = check_per_day['c'] ? parseInt(check_per_day['c']) : 0;

                    if(check_per_day >= parseInt(tmpSetting['max_collect'])){

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: "Today Can't spin wheel anymore.",
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    let start_time = new Date();
                    let end_time = new Date()
                    start_time.setHours(0,0,0,0);
                    end_time.setDate(end_time.getDate() +1);
                    end_time.setHours(0,0,0,0);
                    
                    let tmp_check = MainModel.query(`
                        select *
                        from reward_history
                        where date >= '${timerHelper.convertDatetimeToString(start_time)}"' AND date < '${timerHelper.convertDatetimeToString(end_time)}' and (username = '${username}') and reward_type = 'WHEEL'
                    `);

                    
                    let max_user_collect = parseInt(tmpSetting['max_user_collect']);
                    let countReward = 0;
                    
                    // console.log(tmp_check.length);
                    // console.log(max_user_collect);

                    if(tmp_check){

                        if (tmp_check.length > max_user_collect) {
                            let msg ='Can spin Wheel '+ max_user_collect +' per day';
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: msg,
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }

                       
                    }
                    
                    let id = TransactionList.generateRequestID('wheel');
                    let response = await AgentMain.depositCredit("",row_user['id'],credit);
                    
                    if (response.msgerror) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Agent Problem : ' + response.msgerror,
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
                    else
                    {

                        let tmp_data = {
                            "id" 					: id,
                            "username" 				: username,
                            "reward_description" 	: 'สุ่มแล้ว ได้รับ '+credit+' เครดิต',
                            "reward_type"			: "WHEEL",
                            "credit" 				: credit,
                            "date" 					: timerHelper.getDateTimeNowString(),
                            "note" 					: "",
                            "status" 				: 1
                        };

                        MainModel.insert("reward_history",tmp_data);

                        let tmpMeta = tmpSetting;
                        if (tmpMeta['turn']) 
                        {
                            if (tmpMeta['turn']>0 && credit>0) 
                            {
                                let turn_check 		= 1;
                                let turn_name 		= tmpMeta['turn_name']+' เครดิต '+credit+' บาท' ;
                                let turn_input 		= tmpMeta['turn']*credit;
                                let TurnTypeWithdraw 	= tmpMeta['TurnTypeWithdraw'];
                                let turn_MaxWithdraw 	= tmpMeta['MaxWithdraw'];
                                let promotion_cal = PromotionManage.customTurn(row_user,credit,
                                    {"Title" : turn_name, "turn" : turn_input, "MaxWithdraw" : turn_MaxWithdraw, "turnover_type" :TurnTypeWithdraw}                                            
                                );
                                let turnover = (promotion_cal['turnover']) ? promotion_cal['turnover'] : 0;

                                MemberList.updateCreditAndTurnOver(username,parseFloat(row_user['credit'])+  credit,row_user['turn']+turnover);
                            }
                        }
                        else
                        {
                            MemberList.updateCredit(username,parseFloat(row_user['credit'])+credit);
                        }

                        let userdata = row_user;

                        let aff = {
                            aff_user:null,
                            aff_user_credit:0,
                        };
                        
                        TransactionManage.create(id, row_user, "STAFF",
                            credit, 0, parseFloat(userdata.credit), parseFloat(userdata.credit) + credit, "WHEEL"
                            , userdata.bank_acc_no, userdata.bank_name
                            , timerHelper.convertDatetimeToString(new Date()), ''
                            , null
                            , null
                            , null,"SYSTEM", 1
                            , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                            , "เติมเงินจากการหมุนกงล้อ"
                            ,null,null,null
                            , aff['aff_user'], null, aff['aff_user_credit']
                        );

                    }

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: 'You got '+ credit+' credit',
                            auth : true,
                            data : [],
                        }
                    );

                    return;

                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                    );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.checkCanGetGiftBox = async function(req, res) {
    console.log('checkCanGetGiftBox');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) 
            {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
             } else {

                const userid = headers.userid;
                const token = headers.token;

                let username =req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let row_user = MemberList.findByID(username);
                    let tmpSetting = AdminSetting.findByID("giftbox_setting");

                    for (const [key,value] of Object.entries(JSON.parse(tmpSetting.value))) 
                    {
                        tmpSetting[key]=value;
                    }

                    let credit_collect = tmpSetting['credit_collect'];

                    if(tmpSetting['enable']==0){                        

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'GiftBox is not service',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    const wheelwinloss = tmpSetting['winloss'];

                    let check_per_day  = MainModel.queryFirstRow(`
                        select count(*) c
                        from reward_history
                        where reward_type = 'GIFTBOX' and date(date) like '${timerHelper.getDateNowString()}%'
                    `);

                    check_per_day = check_per_day['c'] ? check_per_day['c'] : 0;

                    if(check_per_day >= tmpSetting['max_collect']){                       

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: "Today Can't open giftbox anymore.",
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    let start_time = new Date();
                    let end_time = new Date()
                    start_time.setHours(0,0,0,0);
                    end_time.setDate(end_time.getDate() +1);
                    end_time.setHours(0,0,0,0);
                    
                    let tmp_check = MainModel.query(`
                        select *
                        from reward_history
                        where date >= '${timerHelper.convertDatetimeToString(start_time)}"' AND date < '${timerHelper.convertDatetimeToString(end_time)}' and (username = '${username}') and reward_type = 'GIFTBOX'
                    `);

                    let max_user_collect = parseInt(tmpSetting['max_user_collect']);

                    let countReward = 0;
                    // console.log(`
                    // select *
                    // from reward_history
                    // where date >= '${timerHelper.convertDatetimeToString(start_time)}"' AND date < '${timerHelper.convertDatetimeToString(end_time)}' and (username = '${username}') and reward_type = 'GIFTBOX'
                    // `);
                    

                    if(tmp_check){
                        if (tmp_check.length > max_user_collect) {
                            let msg ='Can open giftbox '+ max_user_collect +' per day';
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: msg,
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }

                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
                    else
                    {
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                                data : [],
                            }
                        );                        
                        return;
                    }

                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                    );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getGiftBox = async function(req, res) {
    console.log('getGiftBox');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            // console.log(headers.userid,headers.token);

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) 
            {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
             } else {

                const userid = headers.userid;
                const token = headers.token;

                let username =req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);
                
                if (IsAuth) 
                {
                    
                    let row_user = MemberList.findByID(username);
                    let tmpSetting = AdminSetting.findByID("giftbox_setting");
                    let tmpSetting2 = AdminSetting.findByID("giftbox_prize");
                    let credit = parseFloat(req.body.credit);

                    // if (credit==null) 
                    // {
                    //     res.status(200).json(
                    //         { 
                    //             status: 'error', 
                    //             message: 'Fuck you man!!',
                    //             auth : true,
                    //             data : [],
                    //         }
                    //     );
                    //     return;
                    // }

                    // if (credit==0) 
                    // {
                    //     res.status(200).json(
                    //         { 
                    //             status: 'error', 
                    //             message: 'Fuck you man!!',
                    //             auth : true,
                    //             data : [],
                    //         }
                    //     );
                    //     return;
                    // }

                    

                    for (const [key,value] of Object.entries(JSON.parse(tmpSetting.value))) 
                    {
                        tmpSetting[key]=value;
                    }

                    for (const [key,value] of Object.entries(JSON.parse(tmpSetting2.value))) 
                    {
                        tmpSetting2[key]=value;
                    }

                    let credit_collect = tmpSetting['credit_collect'];

                    if(tmpSetting['enable']==0){                        

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Giftbox is not service',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    const wheelwinloss = tmpSetting['winloss'];

                    

                    let check_per_day  = MainModel.queryFirstRow(`
                        select count(*) c
                        from reward_history
                        where reward_type = 'GIFTBOX' and date(date) like '${timerHelper.getDateNowString()}%'
                    `);

                    check_per_day = check_per_day['c'] ? parseInt(check_per_day['c']) : 0;

                    if(check_per_day >= parseInt(tmpSetting['max_collect'])){

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: "Today Can't open giftbox anymore.",
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    let start_time = new Date();
                    let end_time = new Date()
                    start_time.setHours(0,0,0,0);
                    end_time.setDate(end_time.getDate() +1);
                    end_time.setHours(0,0,0,0);
                    
                    
                    let tmp_check = MainModel.query(`
                        select *
                        from reward_history
                        where date >= '${timerHelper.convertDatetimeToString(start_time)}"' AND date < '${timerHelper.convertDatetimeToString(end_time)}' and (username = '${username}') and reward_type = 'GIFTBOX'
                    `);

                    
                    let max_user_collect = parseInt(tmpSetting['max_user_collect']);
                    let countReward = 0;
                    
                    // console.log(tmp_check.length);
                    // console.log(max_user_collect);

                    

                    if(tmp_check){

                        if (tmp_check.length > max_user_collect) {
                            let msg ='Can open giftbox '+ max_user_collect +' per day';
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: msg,
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }

                       
                    }
                    
                                       
                    let id = TransactionList.generateRequestID('giftbox');
                    if (id=="") 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "something wrong with generate RequestID",
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    let randomPrize = [];

                    //Random Prize                        
                    let prizes = [];
                    let countPrize = 0;

                    

                    for (let index = 1; index <= 12; index++) {
                        const elementCredit = tmpSetting2["giftbox_credit_" + index] ? parseFloat(tmpSetting2["giftbox_credit_" + index]) : null;
                        const elementPercent = tmpSetting2["giftbox_percent_" + index] ? parseFloat(tmpSetting2["giftbox_percent_" + index]) : null;
                        const elementURL = tmpSetting2["giftbox_url_" + index] ? tmpSetting2["giftbox_url_" + index] : null;
                        if (elementCredit != null && elementPercent != null && elementURL != null) {                                
                            prizes.push({ credit: elementCredit, percent: elementPercent, url: elementURL });
                            countPrize += 1;
                        }
                    }

                    // Get a random prize
                    randomPrize = getRandomPrize(prizes);
                    credit = randomPrize.credit;

                    let response = await AgentMain.depositCredit("",row_user['id'],credit);
                    
                    if (response.msgerror) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Agent Problem : ' + response.msgerror,
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
                    else
                    {
                        
                        let tmp_data = {
                            "id" 					: id,
                            "username" 				: username,
                            "reward_description" 	: 'สุ่มแล้ว ได้รับ '+credit+' เครดิต',
                            "reward_type"			: "GIFTBOX",
                            "credit" 				: credit,
                            "date" 					: timerHelper.getDateTimeNowString(),
                            "note" 					: "",
                            "status" 				: 1
                        };

                        MainModel.insert("reward_history",tmp_data);

                        let tmpMeta = tmpSetting;
                        if (tmpMeta['turn']) 
                        {
                            if (tmpMeta['turn']>0 && credit>0) 
                            {
                                let turn_check 		= 1;
                                let turn_name 		= tmpMeta['turn_name']+' เครดิต '+credit+' บาท' ;
                                let turn_input 		= tmpMeta['turn']*credit;
                                let TurnTypeWithdraw 	= tmpMeta['TurnTypeWithdraw'];
                                let turn_MaxWithdraw 	= tmpMeta['MaxWithdraw'];
                                let promotion_cal = PromotionManage.customTurn(row_user,credit,
                                    {"Title" : turn_name, "turn" : turn_input, "MaxWithdraw" : turn_MaxWithdraw, "turnover_type" :TurnTypeWithdraw}                                            
                                );
                                let turnover = (promotion_cal['turnover']) ? promotion_cal['turnover'] : 0;

                                MemberList.updateCreditAndTurnOver(username,parseFloat(row_user['credit'])+  credit,row_user['turn']+turnover);
                            }
                        }
                        else
                        {
                            MemberList.updateCredit(username,parseFloat(row_user['credit'])+credit);
                        }

                        let userdata = row_user;

                        let aff = {
                            aff_user:null,
                            aff_user_credit:0,
                        };
                        
                        TransactionManage.create(id, row_user, "STAFF",
                            credit, 0, parseFloat(userdata.credit), parseFloat(userdata.credit) + credit, "GIFTBOX"
                            , userdata.bank_acc_no, userdata.bank_name
                            , timerHelper.convertDatetimeToString(new Date()), ''
                            , null
                            , null
                            , null,"SYSTEM", 1
                            , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                            , "เติมเงินจากการเปิดกล่อง"
                            ,null,null,null
                            , aff['aff_user'], null, aff['aff_user_credit']
                        );

                    }

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: 'You got '+ credit+' credit',
                            auth : true,
                            data : randomPrize,
                        }
                    );

                    return;

                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                    );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getGiftBoxByUseCredit = async function(req, res) {
    console.log('getGiftBoxByUseCredit');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            // console.log(headers.userid,headers.token);

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) 
            {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
             } else {

                const userid = headers.userid;
                const token = headers.token;

                let username =req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);
                
                if (IsAuth) 
                {
                    let row_user = MemberList.findByID(username);
                    let tmpSetting = AdminSetting.findByID("giftbox_setting");
                    let tmpSetting2 = AdminSetting.findByID("giftbox_prize");
                    let credit = parseFloat(req.body.credit);

                    // if (credit==null) 
                    // {
                    //     res.status(200).json(
                    //         { 
                    //             status: 'error', 
                    //             message: 'Fuck you man!!',
                    //             auth : true,
                    //             data : [],
                    //         }
                    //     );
                    //     return;
                    // }

                    // if (credit==0) 
                    // {
                    //     res.status(200).json(
                    //         { 
                    //             status: 'error', 
                    //             message: 'Fuck you man!!',
                    //             auth : true,
                    //             data : [],
                    //         }
                    //     );
                    //     return;
                    // }

                    for (const [key,value] of Object.entries(JSON.parse(tmpSetting.value))) 
                    {
                        tmpSetting[key]=value;
                    }

                    for (const [key,value] of Object.entries(JSON.parse(tmpSetting2.value))) 
                    {
                        tmpSetting2[key]=value;
                    }

                    let credit_collect = tmpSetting['credit_collect'];

                    if(tmpSetting['enable']==0){                        

                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Giftbox is not service',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    let credit_use =  tmpSetting['credit_use']?parseFloat(tmpSetting['credit_use']):100;

                    let current_credit = 0;
                    //Check Credit
                    if (row_user['accept_promotion']!=0) 
                    {
                        current_credit = row_user['alias_credit'];
                        if (row_user['alias_credit']<credit_use) 
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'Credit not enough must use '+credit_use+' credits.',
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }
                    }
                    else
                    {
                        current_credit = row_user['credit'];
                        if (row_user['credit']<credit_use) 
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'Credit not enough must use '+credit_use+' credits.',
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }
                    }

                    let responseWithdraw = await AgentMain.withdrawCredit("",row_user['id'],credit_use);
                    
                    if (responseWithdraw.msgerror) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Agent Problem : ' + response.msgerror,
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
                    else
                    {
                        let aff = {
                            aff_user:null,
                            aff_user_credit:0,
                        };

                        let id2 = TransactionList.generateRequestID('withdraw');
                        TransactionManage.create(id2, row_user, "STAFF",
                            credit_use, 0, parseFloat(current_credit), parseFloat(current_credit) - credit_use, "WITHDRAW"
                            , row_user.bank_acc_no, row_user.bank_name
                            , timerHelper.convertDatetimeToString(new Date()), ''
                            , null
                            , null
                            , null,"SYSTEM", 1
                            , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                            , "ใช้เครดิตเปิดกล่อง"
                            ,null,null,null
                            , aff['aff_user'], null, aff['aff_user_credit']
                        );
                    }
                    
                    row_user = MemberList.findByID(username);

                    let start_time = new Date();
                    let end_time = new Date()
                    start_time.setHours(0,0,0,0);
                    end_time.setDate(end_time.getDate() +1);
                    end_time.setHours(0,0,0,0);

                    
                    let randomPrize = [];
                    
                    //Random Prize                        
                    let prizes = [];
                    let countPrize = 0;

                    for (let index = 1; index <= 12; index++) {
                        const elementCredit = tmpSetting2["giftbox_credit_" + index] ? parseFloat(tmpSetting2["giftbox_credit_" + index]) : null;
                        const elementPercent = tmpSetting2["giftbox_percent_" + index] ? parseFloat(tmpSetting2["giftbox_percent_" + index]) : null;
                        const elementURL = tmpSetting2["giftbox_url_" + index] ? tmpSetting2["giftbox_url_" + index] : null;
                        if (elementCredit != null && elementPercent != null && elementURL != null) {                                
                            prizes.push({ credit: elementCredit, percent: elementPercent, url: elementURL });
                            countPrize += 1;
                        }
                    }

                    // Get a random prize
                    randomPrize = getRandomPrize(prizes);
                    credit = randomPrize.credit;

                    let id2 = TransactionList.generateRequestID('withdraw');                    
                    let response = await AgentMain.depositCredit("",row_user['id'],credit);
                    if (response.msgerror) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'Agent Problem : ' + response.msgerror,
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
                    else
                    {
                        let tmp_data = {
                            "id" 					: id2,
                            "username" 				: username,
                            "reward_description" 	: 'สุ่มแล้ว ได้รับ '+credit+' เครดิต',
                            "reward_type"			: "GIFTBOX",
                            "credit" 				: credit,
                            "date" 					: timerHelper.getDateTimeNowString(),
                            "note" 					: "",
                            "status" 				: 1
                        };
    
                        MainModel.insert("reward_history",tmp_data);
    
                        let tmpMeta = tmpSetting;
                        if (tmpMeta['turn']) 
                        {
                            if (tmpMeta['turn']>0 && credit>0) 
                            {
                                let turn_check 		= 1;
                                let turn_name 		= tmpMeta['turn_name']+' เครดิต '+credit+' บาท' ;
                                let turn_input 		= tmpMeta['turn']*credit;
                                let TurnTypeWithdraw 	= tmpMeta['TurnTypeWithdraw'];
                                let turn_MaxWithdraw 	= tmpMeta['MaxWithdraw'];
                                let promotion_cal = PromotionManage.customTurn(row_user,credit,
                                    {"Title" : turn_name, "turn" : turn_input, "MaxWithdraw" : turn_MaxWithdraw, "turnover_type" :TurnTypeWithdraw}                                            
                                );
                                let turnover = (promotion_cal['turnover']) ? promotion_cal['turnover'] : 0;
    
                                MemberList.updateCreditAndTurnOver(username,parseFloat(row_user['credit'])+  credit,row_user['turn']+turnover);
                            }
                        }
                        else
                        {
                            MemberList.updateCredit(username,parseFloat(row_user['credit'])+credit);
                        }
    
                        let userdata = row_user;
    
                        let aff = {
                            aff_user:null,
                            aff_user_credit:0,
                        };
                        
                        id2 = TransactionList.generateRequestID('giftbox');
                        TransactionManage.create(id2, row_user, "STAFF",
                            credit, 0, parseFloat(userdata.credit), parseFloat(userdata.credit) + credit, "REFUND"
                            , userdata.bank_acc_no, userdata.bank_name
                            , timerHelper.convertDatetimeToString(new Date()), ''
                            , null
                            , null
                            , null,"SYSTEM", 1
                            , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                            , "เติมเงินจากการเปิดกล่อง"
                            ,null,null,null
                            , aff['aff_user'], null, aff['aff_user_credit']
                        );
                    }
                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: 'You got '+ credit+' credit',
                            auth : true,
                            data : randomPrize,
                        }
                    );

                    return;

                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                    );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

// Function to get a random prize based on percentage
function getRandomPrize(prizes) {
    // Create a cumulative distribution array
    let cumulativeDistribution = [];
    let cumulativeSum = 0;

    for (let i = 0; i < prizes.length; i++) {
        cumulativeSum += prizes[i].percent;
        cumulativeDistribution.push(cumulativeSum);
    }

    // Generate a random number between 0 and 100
    let randomNum = Math.random() * 100;

    // Determine which prize the random number falls into
    for (let i = 0; i < cumulativeDistribution.length; i++) {
        if (randomNum < cumulativeDistribution[i]) {
            return prizes[i];
        }
    }
}

exports.getCreditHistoryByMemberId = async function(req, res) {
    console.log('getCreditHistoryByMemberId');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let username =req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    let row_user = MemberList.findByID(username);
                    let start = new Date(req.body.start);
                    let end =  new Date(req.body.end);
                    
                    let tmpData = await AgentMain.getCreditHistory("",username,start ,end,0,0);
                    if (tmpData.msgerror) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: tmpData.msgerror,
                                auth : false,
                                data : [],
                            }
                        );
                    }
                    else
                    {
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : false,
                                data : tmpData,
                            }
                        );
                    }

                   
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                    );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getNoticeUser = async function(req, res) {
    console.log('getNoticeUser');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let username = req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {                      
                   let noticeUser = await NoticeManage.findNoticeMemberByID(username);                             
                   if (noticeUser['id']) 
                   {
                        //Update
                        NoticeManage.updateMemberByID(noticeUser['id'],0);
                   }

                   res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : false,
                            data : noticeUser,
                        }
                    );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                    );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};

exports.getAungPao = async function(req, res) {
    console.log('getAungPao');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(200).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let username = req.body.username;
                let IsAuth = MemberList.isAuthenicated(userid,token);

                if (IsAuth) 
                {  
                    let trueTelNo = req.body.trueTelNo;
                    let trueLink = req.body.trueLink;

                    if (trueTelNo && trueLink ) 
                    {
                        let admin_tws = MainModel.query(`
                                            select *
                                            from admin_truewallet
                                            where status = 1 
                                            `);

                        let tmp_tw = [];
                        for (let index = 0; index < admin_tws.length; index++) {                    
                            const element = admin_tws[index];
                            tmp_tw[index] = element;
                            for (const [key,value] of Object.entries(JSON.parse(element.meta_data)))
                            {
                                tmp_tw[index][key]=value;
                            }                                            
                        }

                        let tw_list = [];
                        let tw_list_gift = [];

                        for (let index = 0; index < tmp_tw.length; index++) 
                        {
                            const element = tmp_tw[index];
                            if (element['tw_type_wallet']=="DEPOSIT") 
                            {
                                tw_list.push(element);
                            }    
                            else if(element['tw_type_wallet']=="DEPOSIT_SMS")
                            {
                                tw_list.push(element);
                            }
                            else if(element['tw_type_wallet']=="DEPOSIT_GIFT")
                            {
                                tw_list_gift.push(element);
                            }
                        }
                        let twSelected = tw_list_gift.filter(x => x.tw_mobile == trueTelNo);
                        if (twSelected.length<=0) 
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'Not found truewallet : ' + trueTelNo,
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                            
                        }

                        const voucher = new Voucher();
                        await voucher.setconfig(trueTelNo,trueLink);                       
            			let voucherid = await voucher.getvoucher();
                        let res2 = await voucher.redeem();
                        if (res2['status']['message']) 
                        {
                            if (res2['status']['message']=='success') 
                            {
                                let user_info = MemberList.findByID(username);                                
                                let amount_dp = parseFloat(res2['data']['my_ticket']['amount_baht']);
                                let voucherid = res2['data']['voucher']['voucher_id'];

                                let credit = amount_dp;
						        let total_deposit_credit = credit;
						        let turnover = credit;
                                let note ='ทรูอังเป่า';
						        let bonus = 0;

                                const row_tmpp = MainModel.query(`
                                        SELECT *
                                        FROM transfer_ref
                                        WHERE 
                                        (
                                            (acc = '${voucherid}' ) AND 
                                            (credit=${amount_dp})																			
                                        )	
                                `);

                                if (row_tmpp.length>0) 
                                {
                                    res.status(200).json(
                                        { 
                                            status: 'error', 
                                            message: `ไม่สามารถใช้อังเปานี้ได้เนื่องจากเคยใช้เติมไปแล้ว  Voucher : ${voucherid} Error : ${res2['status']['message']} `,
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                    return;
                                }
                                else
                                {                                   

                                    let response = await AgentMain.depositCreditByUsername("",user_info['id'],credit);                                   
                                    if (response.msgerror) 
                                    {
                                        res.status(200).json(
                                            { 
                                                status: 'error', 
                                                message: 'Agent Problem : ' + response.msgerror,
                                                auth : true,
                                                data : [],
                                            }
                                        );
                                        return;
                                    }
                                    else
                                    {
                                        let id = TransactionList.generateRequestID("deposit");

                                        let cTime = new Date();
                                        cTime = new Date(cTime.getTime() + (offsetTime));
                                        
                                        let twUsed = twSelected[0];
                                        let userdata = user_info;

                                        let aff = {
                                            aff_user:null,
                                            aff_user_credit:0,
                                        };

                                        TransactionManage.create(id, userdata, "TWAUNGPAO",
                                            credit, 0, parseFloat(userdata.credit), parseFloat(userdata.credit) + credit, "DEPOSIT"
                                            , userdata.bank_acc_no, userdata.bank_name, timerHelper.convertDatetimeToString(cTime)
                                            , ''
                                            , null
                                            , null
                                            , null, "SYSTEM", 1
                                            , timerHelper.convertDatetimeToString(cTime), 0, timerHelper.convertDatetimeToString(cTime)
                                            , "ฝากเงินโดยระบบอัตโนมัติ",twUsed.tw_mobile,'Truewallet', twUsed.tw_mobile, aff['aff_user'], null, aff['aff_user_credit']
                                        );

                                        let nextTurnOver = userdata['turn'] ? userdata['turn'] : 0;
                                        if (userdata['credit'] <= 5) {
                                            nextTurnOver = 0;
                                        }
                                        nextTurnOver += turnover;

                                        MemberList.refreshAliasAccount(userdata.id);
                                        let tmpMember = await MemberList.findByID(userdata.id);
                                        let newAliasId = tmpMember.alias_id;
                                        AgentMain.reCreateUser(newAliasId,tmpMember.password);
                                                                        
                                        MemberList.increaseCreditAndTurnOver(userdata.id, total_deposit_credit, nextTurnOver);
                                        
                                        NoticeManage.createAdmin(userdata, 'success', 'เติมเงินสำเร็จ', 'หมายเลขโทรศัพท์: ' + userdata.mobile_no + '<br>เติมเงินโดยทรูอังเปา : ' + credit + ' บาท<br>เวลาที่ฝากเงิน: ' + timerHelper.convertDatetimeToString(cTime), '', 1);
                                        NoticeManage.createMember(userdata, 'success', 'เติมเงินสำเร็จ', 'หมายเลขโทรศัพท์: ' + userdata.mobile_no + '<br>เติมเงินโดยทรูอังเปา : ' + credit + ' บาท<br>เวลาที่ฝากเงิน: ' + timerHelper.convertDatetimeToString(cTime), '', 1);
                                        
                                
                                        let depositmessage = AdminSetting.findByID("depositmessage");
                                        if (depositmessage) {
                                            let tmpFormat = JSON.parse(depositmessage.value);
                                            if (tmpFormat['dep_textfomrat']) {
                                                let msgformat = tmpFormat['dep_textfomrat'];
                                                const tag_value = {
                                                    "<@userid>": userdata['id'],
                                                    "<@fullname>": userdata['fullname'],
                                                    "<@telno>": userdata['mobile_no'],
                                                    "<@bankaccno>": userdata['bank_acc_no'],
                                                    "<@bankname>": userdata['bank_name'],
                                                    "<@amount>": total_deposit_credit,
                                                    "<@date>": timerHelper.convertDatetimeToString(cTime),
                                                    "<@approveby>": "SYSTEM",
                                                };
                                
                                                for (const [key, value] of Object.entries(tag_value)) {
                                                    msgformat = msgformat.replaceAll(key, value);
                                                }
                                
                                                const lineSetting = AdminSetting.findByID("line_token");
                                                if (lineSetting) {
                                                    const token = JSON.parse(lineSetting.value);
                                                    const line_token = token['Deposit'];
                                
                                                    let response = "";
                                                    if (line_token) {
                                                        response = await LineManage.sendNotify(line_token, msgformat);
                                                    }
                                                }
                                            }
                                        } else {
                                            const lineSetting = AdminSetting.findByID("line_token");
                                            if (lineSetting) {
                                                const token = JSON.parse(lineSetting.value);
                                                const line_token = token['Deposit'];
                                
                                                let msgformat = "";
                                                msgformat += "═════════════\n";
                                                msgformat += "🙁 มีรายการแจ้งฝาก 🙁\n";
                                                msgformat += "โอนจากทรูอังเปา \n";
                                                msgformat += "🥰 ฝากเงิน : " + credit + " บาท 🥰') \n";
                                                msgformat += "Username : " + userdata['id'] + "\n";
                                                msgformat += "ชื่อ : " + userdata['fullname'] + "\n";
                                                msgformat += "เบอร์มือถือ : " + userdata['mobile_no'] + "\n";
                                                
                                                msgformat += "เงินล่าสุดมี " + userdata['credit'] + total_deposit_credit + " บาท \n";
                                                msgformat += "เงินก่อนหน้ามี " + userdata['credit'] + " บาท \n";
                                                msgformat += "เลขที่รายการ : " + id + "\n";
                                                msgformat += "วันที่ : " + timerHelper.convertDatetimeToString(cTime) + "\n";
                                                msgformat += "═════════════\n";
                                
                                                let response = "";
                                                if (line_token) {
                                                    response = await LineManage.sendNotify(line_token, msgformat);
                                                }
                                            }
                                        }

                                    }

                                }
                            }
                            else
                            {
                                res.status(200).json(
                                    { 
                                        status: 'error', 
                                        message: 'Aungpao is not available',
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;
                            }
                        }
                        else
                        {
                            res.status(200).json(
                                { 
                                    status: 'error', 
                                    message: 'Aungpao is not available',
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }
                    }
                    else
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: 'URL is incorrect',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    let noticeUser = await NoticeManage.findNoticeMemberByID(username);
                    if (noticeUser.length>0) 
                    {
                        //Update
                        NoticeManage.updateMemberByID(noticeUser.id,0);
                    }

                   res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : false,
                            data : [],
                        }
                    );
                }
                else
                {
                    res.status(200).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                    );
                }
            
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(
            { 
                status: 'error', 
                message: error.message,
                auth : true,
                data : [],
            }
        );
    }
    
    

   
};