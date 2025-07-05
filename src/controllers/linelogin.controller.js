'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const IpAllowList = require('../models/ipallowlist.model');
const AdminSetting = require('../models/adminsetting.model');

const Secret = require('../../config/secret');

// const LineLoginLib = require('./../modules/lineloginlib');
const LineLoginLib = require('./../modules/lineloginlib');

// const bcrypt = require('bcrypt');
// const saltRounds = 60;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


const { count } = require('console');
const MainModel = require('../models/main.model');

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
            res.send('linelogin');
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

exports.login = async function(req, res) {
    console.log('line login2');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        console.log("ipBlockList");
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            let tmpSetting = await AdminSetting.findByID("line_login");
            let linelogin_setting = JSON.parse(tmpSetting['value']);      
            
            if (linelogin_setting['enable']==0) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Line login is not available service.',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
                        
            const line_login_lib = new LineLoginLib(linelogin_setting['CLIENT_ID'],linelogin_setting['CLIENT_SECRET'],linelogin_setting['CALLBACK_URL']);
            console.log(line_login_lib);

            if (req.body.ses_login_accToken_val) 
            {
                //verify
                const accToken = req.body.ses_login_accToken_val;
                const verifyToken = await line_login_lib.verifyToken(accToken);
                if (verifyToken!=null) 
                {
                    const userInfo = await line_login_lib.userProfile(accToken,true);
                    if (userInfo['userId']) 
                    {
                        const tmpData = {
                            line_userid: userInfo['userId'],
                            displayName: userInfo['displayName'],
                        }

                        const tmpUser = await MainModel.query(`
                            select *
                            from sl_users 
                            where line_userid = '${userInfo['userId']}'
                        `
                        );

                        if (tmpUser.length>0) 
                        {
                            const username = tmpUser[0]['id'];
                            if (tmpUser[0]['status']==0) 
                            {
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: 'Account is inactive',
                                        auth : false,
                                        data : [],
                                    }
                                );
                                return;
                            }
                            
                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: '',
                                    auth : false,
                                    data : 
                                    {
                                        id : tmpUser[0]['id'],
                                        line_id : tmpUser[0]['line_id'],
                                        password : tmpUser[0]['password'],
                                    },
                                }
                            );
                            return;

                        }
                        else
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: "Not found userid : " + userInfo['userId'],
                                    auth : false,
                                    data : [],
                                }
                            );
                            return;
                        }

                    }
                    else
                    {
                        const tmpData = {
                            line_userid: "",
                            displayName: "",
                        }

                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "Have some problem in this service.",
                                auth : false,
                                data : tmpData,
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
                            message: 'Line login cannot verify.',
                            auth : false,
                            data : [],                                    
                        }
                    );
                    return;
                }
            }
            else
            {
                
                //new login
                const stateKey = await line_login_lib.randomToken();                        
                const returnUrl = await line_login_lib.authorize(stateKey);

                MainModel.insert("linelogin_token",{
                    state_key:stateKey,
                    access_token:'',
                    refresh_token:'',
                    user:'',
                });
                
                if (returnUrl.length>0) 
                {
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : false,
                            data : returnUrl,
                            STATE_KEY : stateKey,
                            CALLBACK_URL: linelogin_setting['CALLBACK_URL'],
                        }
                    );
                    return;
                }
                else
                {
                    res.status(202).json(
                        { 
                            status: 'error', 
                            message: "Have some problem in this service.",
                            auth : false,
                            data : [],                                    
                        }
                    );
                    return;
                }

            }
        }
    } catch (error) {
        console.log(error);
        res.status(505).json(
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

exports.callback = async function(req, res) {
    console.log('callback');
    
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
            let tmpSetting = AdminSetting.findByID("line_login");
            let linelogin_setting = JSON.parse(tmpSetting['value']);      
            
            if (linelogin_setting['enable']==0) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Line login is not available service.',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
            
            console.log("line call back ");
            const line_login_lib = new LineLoginLib(linelogin_setting['CLIENT_ID'],linelogin_setting['CLIENT_SECRET'],linelogin_setting['CALLBACK_URL']);
            console.log("req.query");
            console.log(req.query);
            const dataToken = await line_login_lib.requestAccessToken(req.query , true);
            console.log("dataToken");
            console.log(dataToken);
            if (dataToken)
            {
                // if (dataToken['access_token']) 
                // {
                //     req.session.data['ses_login_accToken_val'] = dataToken['access_token'];  
                // }

                // if (dataToken['refresh_token']) 
                // {
                //     req.session.data['ses_login_refreshToken_val'] = dataToken['refresh_token'];
                // }

                // if (dataToken['id_token']) 
                // {
                //     req.session.data['ses_login_userData_val'] = dataToken['user'];                                 
                // }

                MainModel.update("linelogin_token",
                    {
                        access_token: dataToken['access_token']?dataToken['access_token']:'',
                        refresh_token: dataToken['refresh_token']?dataToken['refresh_token']:'',
                        user: dataToken['user']?dataToken['user']:'',                        
                    }
                    ,
                    {
                        state_key : dataToken['state_key']
                    }
                    ,""
                );

                res.status(200).json(
                    {
                        // access_token : dataToken['access_token']?dataToken['access_token']:null,
                        // refresh_token : dataToken['refresh_token']?dataToken['refresh_token']:null,
                        // user : dataToken['user']?dataToken['user']:null,
                    }
                );
                return; 
                
            }
            else
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: '',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
        }
    } catch (error) {
        console.log(error);
        res.status(505).json(
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

exports.getAccessToken = async function(req, res) {
    console.log('getAccessToken');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        console.log("ipBlockList");
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            let tmpSetting = await AdminSetting.findByID("line_login");
            let linelogin_setting = JSON.parse(tmpSetting['value']);      
            
            if (linelogin_setting['enable']==0) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Line login is not available service.',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
           
            const statekey = req.body.statekey;
            const tmpData = MainModel.query("SELECT * FROM linelogin_token WHERE state_key='"+statekey+"'");
            if (tmpData.length>0) 
            {
                res.status(200).json(
                    { 
                        status: 'success', 
                        message: '',
                        auth : false,
                        data : tmpData,
                    }
                );
                return;
            }
            else
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Not found data',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
           
        }
    } catch (error) {
        console.log(error);
        res.status(505).json(
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

exports.loginByLineId = async function(req, res) {
    console.log('loginByLineId');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        console.log("ipBlockList");
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            let tmpSetting = await AdminSetting.findByID("line_login");
            let linelogin_setting = JSON.parse(tmpSetting['value']);      
            
            if (linelogin_setting['enable']==0) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Line login is not available service.',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
           
            const line_id = req.body.line_id;
            const userlist = MainModel.query("SELECT * FROM sl_users WHERE line_userid='"+line_id+"'");
            
            if (userlist.length>0) 
            {
                var key = 'SuperSumohmomo';
                await MemberList.updateLastLoginByID(userlist[0].id);

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

                return;
            }
            else
            {
                res.status(202).json({
                    message: "Authentication failed",
                    status:"error",
                });
            }
           
        }
    } catch (error) {
        console.log(error);
        res.status(505).json(
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

exports.updateLineIdWithAccount = async function(req, res) {
    console.log('updateLineIdWithAccount');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
        
        console.log("ipBlockList");
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            let tmpSetting = await AdminSetting.findByID("line_login");
            let linelogin_setting = JSON.parse(tmpSetting['value']);      
            
            if (linelogin_setting['enable']==0) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Line login is not available service.',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
                       
            const tmpData = await MemberList.updateLineIdByID(req.body);
            
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
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: tmpData.message,
                        auth : true,                            
                    }
                );
            }
           
        }
    } catch (error) {
        console.log(error);
        res.status(505).json(
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