'use strict';
const jwt = require('jsonwebtoken');

const IpAllowList = require('../models/ipallowlist.model');

const StaffGroupSetting = require('../models/staffgroupsetting.model');

const GoogleAuthenticator = require('../modules/GoogleAuthenticator');

const url = require('url');

const Secret = require('../../config/secret');

// var requestIp = require('request-ip');

// const bcrypt = require('bcrypt');
// const saltRounds = 60;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

var crypto = require('crypto'); 

var session = require('express-session');
const { count } = require('console');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');

const speakeasy = require('speakeasy');
const MainModel = require('../models/main.model');
const timerHelper = require('../modules/timehelper');

exports.default = async function(req, res) {

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
            if (ipBlockList.length>0)
            {
                res.status(202).send('Unauthorize ip. ('+ipAddress+')');
            }
        else
        {
            res.send('admin api');
        }
    } catch (error) {
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    
   
    
};

exports.findAll = async function(req, res) {
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const userlist = AdminList.findAll();
            res.json(userlist);
        }
    
    } catch (error) {
        res.status(202).json(
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
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const new_user = new AdminList(req.body);
            //handles null error
            if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ error: true, message: 'Please provide all required field' });
            } else {
                const userlist = AdminList.create(new_user);
                res.status(200).json({ error: false, message: "User added successfully!", data: userlist });
        
                // AdminList.create(new_user, function(err, userlist) {
                //     if (err)
                //         res.send(err);
                //     res.json({ error: false, message: "User added successfully!", data: userlist });
                // });
            }
        }
    
    } catch (error) {
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
   
  
};

exports.findById = async function(req, res) {
    // AdminList.findById(req.params.id, function(err, userlist) {
    //     if (err)
    //         res.json(err);
    //     res.json(userlist);
    // });    

    

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const userlist = AdminList.findById(req.params.id);
            res.status(200).json(userlist);
        }
    } catch (error) {
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }

   
};

exports.update = async function(req, res) {
   
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ error: true, message: 'Please provide all required field' });
            } else {
                const userlist = AdminList.update(req.params.id, new AdminList(req.body));
                res.status(200).json({ error: false, message: 'User successfully updated' });
        
                // AdminList.update(req.params.id, new AdminList(req.body), function(err, userlist) {
                //     if (err)
                //         res.send(err);
                //     res.json({ error: false, message: 'User successfully updated' });
                // });
            }
        }
    } catch (error) {
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    
};

exports.delete = async function(req, res) {
      
    try
    {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ error: true, message: 'Please provide all required field' });
            } else {
                const userlist = AdminList.delete(req.params.id);
                res.status(200).json({ error: false, message: 'User successfully deleted' });
            }
        }
    } catch (error) {
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }

    

};

exports.isAuthenicated = async function(req, res) {    

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.getHeaders();
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });            
            } 
            else
            {
                console.log("isAuthenicated");
                const isCorrectToken = AdminList.isAuthenicated(headers.userid, headers.token);
                if (isCorrectToken) {
                    res.status(200).json({
                        message: "Authentication Correct"
                    });
                } else {
                    res.status(202).json({
                        message: "Authentication Incorrect or expired"
                    });
                }
            }
    
           
        }
    } catch (error) {
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
   
}

exports.login = async function(req, res) {

    try {
        console.log("Login");
        console.log(req.body.userid);
        console.log(req.body.password);

        // const salt = bcrypt.genSaltSync(saltRounds);
        // const passwordCrypted = bcrypt.hashSync(req.body.password, salt);

        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            var key = 'SuperSumohmomo';
            var encrypted = crypto.createHmac('sha1', key).update(req.body.password).digest('hex');
        
            // console.log("Encrypted");
            // console.log(encrypted);
        
            const userlist = AdminList.login(req.body.userid, encrypted);
        
            if (userlist.length > 0) {
                let curTime = new Date();
                // let expiredAt = curTime + Secret.ExpiresIn;
                let jwtToken = jwt.sign({
                        userid: userlist[0].am_username,
                    },
                    Secret.SecretKey, {
                        expiresIn: Secret.ExpiresLabel
                    });
        
                // console.log(userlist[0].am_username);
                // console.log(jwtToken);
                let pageAuthen = [];
                let depwit = "NONE";

                if (userlist[0].am_rank==4) 
                {
                    //get all page
                    let tmpPageAuthen = StaffGroupSetting.getAllPage();                
                    for (let index = 0; index < tmpPageAuthen.length; index++) {
                        const element = tmpPageAuthen[index];        
                        pageAuthen.push(element.page_name);
                    }
                    
                    depwit = "BOTH";
                }
                else
                {                
                    let AmPermission = StaffGroupSetting.getPermissionByAmGroup(userlist[0].am_group);                  
                    if (AmPermission.length>0) 
                    {
                        let tmpPermission = AmPermission[0]['permission'];
                        tmpPermission = tmpPermission.replaceAll('[',"");
                        tmpPermission = tmpPermission.replaceAll(']',"");
                        tmpPermission = tmpPermission.replaceAll('"',"'");
                        let tmpPageAuthen = StaffGroupSetting.getPageByAmPermission(tmpPermission);
                        for (let index = 0; index < tmpPageAuthen.length; index++) {
                            const element = tmpPageAuthen[index];        
                            pageAuthen.push(element.page_name);
                        }
                        depwit = AmPermission[0]['depwit'];
                    }
                }
                
                const groupData = await AdminList.findByIdWithGroup(req.body.userid);
                // console.log(pageAuthen);

                MainModel.update("am_users",{login_time: timerHelper.convertDatetimeToStringNoT(curTime)},{am_username : req.body.userid});
        
                res.status(200).json({
                    token: jwtToken,
                    createAt: curTime,            
                    expireAt: new Date(new Date(curTime).getTime() + (Secret.ExpiresIn*1000) ) , 
                    id: userlist[0].id,
                    fullName: userlist[0].am_fullname,
                    am_rank: userlist[0].am_rank,            
                    am_group: userlist[0].am_group,
                    message: "Login is successful.",
                    pageAuthen : pageAuthen,
                    defaultPage : groupData[0]['default_page']?groupData[0]['default_page']:'',
                    am_group_name: groupData[0]['name']?groupData[0]['name']:'',
                    depwit : depwit,
                    status:"success",         
                    login_time: curTime,
                });
            } else {
                res.status(202).json({
                    message: "Authentication failed",
                    status:"error",
                });
            }
        }
    } catch (error) {
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    


    

    
};

exports.getLoginTime = async function(req, res) {

    try {
        console.log('getLoginTime');

        // console.log(req.body.userid);
        // console.log(req.body.token);
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            
            let jwtToken = jwt.verify(req.body.token, Secret.SecretKey);
            if (jwtToken.userid) {
                // console.log("Decode userid :", jwtToken.userid); 
    
                if (jwtToken.userid == req.body.userid) {
                    let curTime = new Date();
                    
                    let loginData = await AdminList.findById(req.body.userid);
                    if (loginData) 
                    {
                        let dbTime = (new Date(loginData['login_time']).setSeconds(0,0));
                        let clientTime = (new Date(req.body.login_time).setSeconds(0,0));

                        // console.log(dbTime);
                        // console.log(clientTime);
                        if (dbTime!=clientTime) 
                        {
                            res.status(202).json({
                                message: "Time login not match",
                                status:"error",
                            });
                            return;
                        }
                        else
                        {
                            res.status(200).json({                                 
                                message: "Time is match.",
                                status:"success",
                            });
                            return;
                        }
                    }
                    else
                    {
                        res.status(202).json({
                            message: "Not found user",
                            status:"error",
                        });
                        return;
                    }
            
            
                } else {
                    res.status(202).json({
                        message: "Refresh Token failed",
                        status:"error",
                    });
                }
            }else {
                res.status(202).json({
                    message: "Refresh Token failed",
                    status:"error",
                });
            }
        }
    
        
             
    } catch (error) {
        res.status(202).json(
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

    try {
        console.log('refresh token');

        // console.log(req.body.userid);
        // console.log(req.body.token);
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            
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
            
                    res.status(200).json({
                        token: jwtToken,
                        createAt: curTime,
                        expireAt: new Date(new Date(curTime).getTime() + (Secret.ExpiresIn*1000) ) , 
                        id: jwtToken.userid,            
                        message: "Refresh Token is successful.",
                        status:"success",
                    });
            
                } else {
                    res.status(202).json({
                        message: "Refresh Token failed",
                        status:"error",
                    });
                }
            }else {
                res.status(202).json({
                    message: "Refresh Token failed",
                    status:"error",
                });
            }
        }
    
        
             
    } catch (error) {
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    

    
};


exports.getagent = async function(req, res) {
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
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
                    let tmpData = AgentList.findAll();
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
                    res.status(202).json(
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
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    
};

exports.allowipaddress = async function(req, res) 
{

    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);
    let password = queryObject.password?queryObject.password:'';     
    if (queryObject.password!='sum0h') 
    {
        res.status(200).json(
            { 
                status: 'error', 
                message: 'Password is incorrect.',                                
            }
        );
    }
    else
    {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        let tmpData= AdminList.AddAllowIPAdddress(ipAddress);
        if (tmpData['affectedRows']) 
        {
            res.status(200).json(
                { 
                    status: 'Add Allow Ip Address : '+ipAddress , 
                    message: '',
                }
            );
        }
        else
        {
            res.status(202).json(
                { 
                    status: 'error', 
                    message: tmpData.message,                
                }
            );
        }
    }
    
};

exports.googleAuthen = async function(req, res) {

    try {
        console.log('googleAuthen');
     
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
     
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const otp = req.body.otp;
            const g = new GoogleAuthenticator();
            
            if (otp.length>0) 
            {
                // const chk = await g.checkCode("442M4MGVYZBZZHY3", otp);
                
                var base32secret = 'IISHQRCVI5CU45BUPE7CIURZOUYDM4TVFRGTMORMORBE6NBKPBFA';
                var chk = await speakeasy.totp.verify({ secret: base32secret,
                    encoding: 'base32',
                    token: otp ,
                    window: 6,
                });

                console.log("==============");
                console.log(chk);
                console.log("==============");
                
                if (chk) 
                {
                    res.status(200).json({
                        status:"success",
                    });
                    return;
                }
                else
                {
                    res.status(202).json({                    
                        status:"error",
                    });
                    return;
                }
            }else {
                res.status(202).json({                    
                    status:"error",
                });
                return;
            }
        }    
             
    } catch (error) {
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    

    
};

exports.getGoogleAuthen = async function(req, res) {

    try {
        console.log('googleAuthen');
     
        var secret = await speakeasy.generateSecret();
            res.status(200).json({
                status:"success",
                data : secret,
            });
        return;
             
    } catch (error) {
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    
};

exports.getTime = async function(req, res) {

    try {
        console.log('getTime');

        const time = Math.floor(Date.now() / 1000 / 30);

        res.status(200).json(
            { 
                status: 'success', 
                message: '',
                auth : false,
                data : time,
            }
        );
       
             
    } catch (error) {
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }
    

    
};

exports.changePassword = async function(req, res) {
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            console.log("changePassword")
            //handles null error
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
                    let key = 'SuperSumohmomo';
                    let oldPassword = crypto.createHmac('sha1', key).update(req.body.oldPassword).digest('hex');
                    let newPassword = crypto.createHmac('sha1', key).update(req.body.newPassword1).digest('hex');

                    //check old password
                    let chkPassword =  await MainModel.query(`select * from am_users WHERE am_password='${oldPassword}' and am_username='${userid}' `);
                    if (chkPassword.length<=0) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: "Old Password is incorrect",
                                auth : false,
                                data : [],
                            }
                        );
                        return;
                    }

                    let tmpData = await MainModel.update("am_users", 
                        {
                            am_password : newPassword
                        },
                        {
                            am_username : userid
                        }
                    );

                    if (tmpData) 
                    {
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                            }
                        );
                        return;
                    }
                    else
                    { 
                        res.status(200).json(
                        { 
                            status: 'error', 
                            message: "Have some problem.",
                            auth : false,
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
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }

    
    
   
};

exports.changeWithoutPin = async function(req, res) {
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            console.log("changeWithoutPin")
            //handles null error
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
                    
                    let oldPassword = req.body.oldPassword;
                    let newPassword = req.body.newPassword1;

                    //check old password
                    let chkPassword =  await MainModel.query(`SELECT * FROM withdraw_pin WHERE pin='${oldPassword}'`);

                    if (chkPassword.length<=0) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: "Old Pin is incorrect",
                                auth : false,
                                data : [],
                            }
                        );
                        return;
                    }

                    let tmpData = await MainModel.update("withdraw_pin", 
                        {
                            pin : newPassword
                        },
                        {

                        }
                    );

                    if (tmpData) 
                    {
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                            }
                        );
                        return;
                    }
                    else
                    { 
                        res.status(200).json(
                        { 
                            status: 'error', 
                            message: "Have some problem.",
                            auth : false,
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
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );
    }

    
    
   
};