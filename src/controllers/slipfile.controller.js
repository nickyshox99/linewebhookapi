'use strict';
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const Secret = require('../../config/secret');
const Cryptof = require('../models/cryptof.model');

const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const IpAllowList = require('../models/ipallowlist.model');
const MainModel = require('../models/main.model');
const AdminSetting = require('../models/adminsetting.model');

const timerHelper = require('../modules/timehelper');
const fs = require('fs');
const path = require('path');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

const { createCanvas, loadImage } = require('canvas');
const jsQR = require('jsqr');

async function readQRCode(filePath) {
    try {
      // Load the JPEG image
      const image = await loadImage(filePath);
  
      // Create a canvas with the same dimensions as the image
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, image.width, image.height);
  
      // Get the image data
      const imageData = ctx.getImageData(0, 0, image.width, image.height);
  
      // Decode the QR code
      const qrCode = await jsQR(imageData.data, image.width, image.height);
  
      if (qrCode) {
        // If a QR code is found, log the result
        // console.log('QR Code Data:', qrCode.data);
        return qrCode.data;
      } else {
        // console.log('No QR Code found in the image.');
        return "";      
      }
    } catch (error) {
    //   console.error('Error reading QR code:', error);
      return "";      
    }
}

exports.uploadSlipFile =  async (req, res) => {
    console.log('uploadSlipFile');
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
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                let userid = headers.userid;
                const token = headers.token;

                console.log(userid);
                console.log(token);

                let IsAuth = MemberList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    
                    const uploadedFile = req.file;       

                    if (!req.file ) {
                        return res.status(400).json({
                            status: 'error',
                            message: 'No file uploaded or invalid file data',
                        });
                    }

                    const splitExtensionName =uploadedFile.filename.split('.')[1];

                    let cTime = new Date();
                    cTime = new Date(cTime.getTime() + (offsetTime));
                    let datetimeNow = new Date();
                    datetimeNow = new Date(datetimeNow.getTime() + (offsetTime));

                    const rndInt = Math.floor(Math.random() * 1000) + 100;
                    const dateStr = datetimeNow.getFullYear().toString() +datetimeNow.getMonth().toString()
                        + datetimeNow.getDay().toString()+datetimeNow.getHours().toString()
                        + datetimeNow.getMinutes().toString()+datetimeNow.getSeconds().toString()
                        + rndInt.toString();
                    const rndFileName = headers.userid + dateStr+'.'+splitExtensionName;
                            
                    // Example: Save the uploaded file to a specific location
                    const sourceFilePath = path.join(__dirname, '..', '..','00tmpfile', uploadedFile.filename);
                    const destinationPath = path.join(__dirname, '..', '..','slipfile', rndFileName);

                    console.log(sourceFilePath);
                    console.log(destinationPath);

                    fs.readFile(sourceFilePath, (err, data) => {
                        if (err) {
                            console.error('Error saving file:', err);
                            return res.status(500).json(
                                {
                                    status : 'error', 
                                    message:  err.message,
                                }
                            );
                        }
                    
                        // Write the file to the destination path
                        fs.writeFile(destinationPath, data, async (err) => {
                            if (err) {
                                console.error('Error saving file:', err);
                                return res.status(500).json(
                                    {
                                        status : 'error', 
                                        message:  err.message,
                                    }
                                );
                            }

                            console.log(Secret.apiDomain+'slipfile/'+ rndFileName);

                            const barCode = await readQRCode(destinationPath);
                            //console.log(barCode.data);

                            if (barCode!='') {
                                const checkExistQR  = MainModel.query("SELECT * FROM scan_slip WHERE barcode='"+barCode.data+"'");                                
                                if (checkExistQR.length>0) 
                                {
                                    if (checkExistQR[0]['deposited_credit']==1) 
                                    {
                                        res.status(202).json(
                                            { 
                                                status: 'error', 
                                                message: 'This slip has been used before.',
                                                auth : false,
                                                data : [],
                                            }
                                        );
                                        return;
                                    }                         
                                    userid = checkExistQR[0]['userid'];
                                }
                                else
                                {
                                    
                                    MainModel.insert("scan_slip",
                                        {
                                            userid : headers.userid,
                                            filename : rndFileName,
                                            upload_time : timerHelper.convertDatetimeToString(datetimeNow),
                                            barcode : barCode.data,
                                            canceled : 0,
                                        }
                                    );                                    
                                }

                                let admin_banks_data = MainModel.query(`
                                select *
                                from admin_bank
                                where status = 1 and bank_id in (5) and (bank_type = 'WITHDRAW' or bank_type = 'BOTH' ) and (work_type = 'NODE' or work_type = 'IBK')
                                    `);
                                if (admin_banks_data.length>0) 
                                {
                                    const randomIndex = Math.floor(Math.random() * admin_banks_data.length);
                                    let admin_banks = admin_banks_data[0];
                                    let tmpMeta = JSON.parse(admin_banks['meta_data']);
                                    admin_banks['meta_data']= tmpMeta;
                                    for (const [key,value] of Object.entries(tmpMeta))
                                    {
                                        admin_banks[key] = value;
                                    }

                                    let admin_info = admin_banks;
                                                                            
                                    //Bank Account                                                                        
                                    if (admin_info) 
                                    {                                            
                                        if(admin_info['bank_id']==5)
                                        {                                            
                                            const scb_app_lib = new Scb_app_lib();
                                            let scbtoken = admin_info['scb_app_token'] ? Cryptof.decryption(admin_info['scb_app_token']) : "";
                                            let token = admin_info['scb_app_token'] ? Cryptof.decryption(admin_info['scb_app_token']) : "";
                                                                                                                                    
                                            let resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                                            let data = [];
                                            let i = 0;

                                            let loginPass = false;
                                            
                                            if (resp['status'] && resp['status']!='error') 
                                            {
                                                if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                                {          
                                                    admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                                    SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);        
                                                    console.log(admin_info['bank_acc_number'] + "Read Slip Login : (Balance : $"+ admin_info['meta_data']['balance']  +")");
                                                    loginPass = true;
                                                }
                                                else
                                                {
                                                    console.log("Read Slip New Login");                                        
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

                                            if (loginPass) 
                                            {
                                                let response = await scb_app_lib.CheckSlip(scbtoken,barCode.data);    
                                                //console.log(response);
                                                if(response['status']['code'] == 1000)
                                                {  
                                                    let credit = response['data']['amount'];
                                                    let slipTime = response['data']['pullSlip']['dateTime']?new Date(response['data']['pullSlip']['dateTime']):new Date();                                                    
                                                    let transRef = response['data']['pullSlip']['transRef']?response['data']['pullSlip']['transRef']:"";
                                                    let sender = response['data']['pullSlip']['sender'];
                                                    let receiver = response['data']['pullSlip']['receiver'];                                                    

                                                    if (typeof credit=='number') 
                                                    {
                                                        MainModel.update("scan_slip",
                                                            {
                                                                credit : credit,
                                                                sliptime : timerHelper.convertDatetimeToString(slipTime),
                                                                deposited_credit: 1, 
                                                                transRef : transRef,
                                                                from_acc : sender['accountNumber'],
                                                                from_name : sender['name'],
                                                                to_acc : receiver['accountNumber'],
                                                                to_name : receiver['name'],                                                                
                                                            }
                                                            ,
                                                            {
                                                                barcode : barCode.data
                                                            }
                                                        );

                                                        let slip_from_acc = '';
                                                        const match = sender['accountNumber'].slice(-6).replaceAll("-","").replaceAll("x","");
                                                        // Check if a match is found
                                                        if (match) {
                                                            slip_from_acc = match;                                                        
                                                        } 

                                                        let slip_to_acc = '';
                                                        const match2 = receiver['accountNumber'].slice(-6).replaceAll("-","").replaceAll("x","");
                                                        // Check if a match is found
                                                        if (match2) {
                                                            slip_to_acc = match2;                                                        
                                                        } 

                                                        let row_transfer = {
                                                            credit : credit,
                                                            datetime : slipTime,
                                                            bankdesc : 'slip',
                                                            acc : slip_from_acc,
                                                            bank_name : '',
                                                        };

                                                        if (slip_from_acc=="") 
                                                        {
                                                            MainModel.update("scan_slip",
                                                            {
                                                                canceled : 1,                                                                                     
                                                                remark : "Slip cannot read sender account."
                                                            }
                                                            ,
                                                            {
                                                                barcode : barCode.data
                                                                
                                                            }
                                                        );

                                                            res.status(202).json(
                                                                { 
                                                                    status: 'error', 
                                                                    message: 'Slip cannot read sender account.',
                                                                    auth : false,
                                                                    data : [],
                                                                }
                                                            );
                                                            return;                                                            
                                                        }

                                                        let row_bank =  MainModel.query(`
                                                                select *
                                                                from admin_bank
                                                                where status = 1  and (bank_type = 'WITHDRAW' or bank_type = 'BOTH' ) and (bank_acc_number like '%${slip_to_acc}%')
                                                            `);
                                                        
                                                        // console.log(`
                                                        //     select *
                                                        //     from admin_bank
                                                        //     where status = 1 and (bank_type = 'WITHDRAW' or bank_type = 'BOTH' ) and (bank_acc_number like '%${slip_to_acc}%')
                                                        // `);

                                                        // console.log(row_bank);
                                                        // console.log(row_bank.length);
                                                        // console.log(barCode.data);

                                                        if (row_bank.length == 0)
                                                        { 
                                                            MainModel.update("scan_slip",
                                                                {
                                                                    canceled : 1,                                                                                     
                                                                    remark : "Slip found problem about receiver bank."
                                                                }
                                                                ,
                                                                {
                                                                    barcode : barCode.data
                                                                    
                                                                }
                                                            );

                                                            res.status(202).json(
                                                                { 
                                                                    status: 'error', 
                                                                    message: 'Slip found problem about receiver bank.',
                                                                    auth : true,
                                                                    data : [],
                                                                }
                                                            );
                                                            return;
                                                        }

                                                        let c_now = new Date();
                                                        c_now = new Date(c_now.getTime() + (offsetTime));
                                                        c_now.setHours(c_now.getHours());

                                                        let fromDate = c_now.setMinutes(c_now.getMinutes() - 30);
                                                        let toDate = c_now.setMinutes(c_now.getMinutes() + 30);
                                                        let row_tmpp = MainModel.query(`
                                                            SELECT *
                                                            FROM transfer_ref
                                                            WHERE 
                                                                (
                                                                    (acc = '${row_transfer['acc']}' AND date = '${timerHelper.convertDatetimeToString(row_transfer['datetime'])}' AND credit = '${row_transfer['credit']}') 
                                                                    OR 
                                                                    (acc like '%${row_transfer['acc']}%' AND date >= '${timerHelper.convertDatetimeToString(fromDate)}' AND date<='${timerHelper.convertDatetimeToString(toDate)}' AND credit = '${row_transfer['credit']}' AND manual = 1 )
                                                                )								
                                                        `);

                                                        if (row_tmpp.length>0) 
                                                        {
                                                            MainModel.update("scan_slip",
                                                            {
                                                                canceled : 1,              
                                                                remark : "This transaction has been used before."                                                                       
                                                            }
                                                            ,
                                                            {
                                                                barcode : barCode.data
                                                            }
                                                            );
                                                        
                                                            res.status(202).json(
                                                                { 
                                                                    status: 'error', 
                                                                    message: 'This transaction has been used before.',
                                                                    auth : false,
                                                                    data : [],
                                                                }
                                                            );
                                                            return;
                                                        }
                                                        else
                                                        {
                                                            let tmp_data = {
                                                                "id" 			: null,
                                                                "tr_bank"		: "SLIP",
                                                                "bank_app"		: row_transfer['bank_name'],
                                                                "acc"			: row_transfer['acc'],
                                                                "credit"		: row_transfer['credit'],
                                                                "type"			: "DEPOSIT",
                                                                "date"			: timerHelper.convertDatetimeToString(row_transfer['datetime']),
                                                                "note"			: "",
                                                                "status" 		: 0,
                                                                "parent"		: "",
                                                            };
    
                                                            MainModel.insert("transfer_ref",tmp_data);
                                                        }

                                                        let row_user =  MainModel.query(`
                                                            SELECT *
                                                            FROM sl_users
                                                            WHERE id = '${userid}' and bank_acc_no like '%${slip_from_acc}%' 
                                                        `);

                                                        if (row_user && row_user.length > 0)
                                                        {   
    
                                                            let tmpDepositSetting = AdminSetting.findByID("deposit_setting");                                                                
                                                            if (tmpDepositSetting) 
                                                            {                                                                    
                                                                let deposit_setting = JSON.parse(tmpDepositSetting['value']);
                                                                let min_dep = 0;
                                                                let min_enable = false;
    
                                                                if (deposit_setting['enable']==1) 
                                                                {
                                                                    try 
                                                                    {
                                                                        min_enable = true;
                                                                        min_dep = deposit_setting['MinDeposit'] ? parseInt(deposit_setting['MinDeposit']) : 100;
                                                                    } catch (error) {
                                                                        console.log(error);
                                                                    }                                                                    
                                                                }
    
                                                                if (min_enable) 
                                                                {
                                                                    if(credit >= min_dep)
                                                                    {
                                                                        //console.log(credit,row_user[0],row_transfer,"SLIP",admin_info,row_transfer.datetime);
                                                                        let response = CreditManage.deposit(credit,row_user[0],row_transfer,"SLIP",admin_info,row_transfer.datetime);
                                                                        console.log(response.message);

                                                                        MainModel.update("scan_slip",
                                                                            {
                                                                                deposited_credit: 1,                                                                                     
                                                                            }
                                                                            ,
                                                                            {
                                                                                barcode : barCode.data
                                                                            }
                                                                        );
                                                                    }
                                                                    else
                                                                    {   
                                                                        let response = CreditManage.depositMin(credit,row_user[0],row_transfer,"SLIP",admin_info,"ฝากไม่ถึงขั้นต่ำ",row_transfer.datetime);    
                                                                        console.log("ฝากไม่ถึงขั้นต่ำ");   
                                                                        MainModel.update("scan_slip",
                                                                            {
                                                                                canceled : 1,
                                                                                remark : "Mininum Deposit is "+min_dep+ "."
                                                                            }
                                                                            ,
                                                                            {
                                                                                barcode : barCode.data
                                                                            }
                                                                        );                                                                     
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    let response = CreditManage.deposit(credit,row_user[0],row_transfer,"SLIP",admin_info,row_transfer.datetime);
                                                                    console.log(response.message);
                                                                }
    
                                                            }
                                                            else
                                                            {
                                                                console.log("Not Found deposit_setting");
                                                            }
                                                        }
                                                        else
                                                        {
    
                                                            let credit = parseInt(row_transfer['credit']);
                                                            let response = CreditManage.depositError(credit, row_transfer, "SLIP", admin_info, "เลขบัญชี "+ slip_from_acc + " ไม่ตรง UserId : "+userid);
                                                            console.log("Can not find user");
    
                                                            MainModel.update("scan_slip",
                                                                    {
                                                                        canceled : 1,
                                                                        remark : "Account Number "+ slip_from_acc + " not match UserId : "+userid,
                                                                    }
                                                                    ,
                                                                    {
                                                                        barcode : barCode.data
                                                                    }
                                                                ); 
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
                                                    else
                                                    {
                                                        res.status(202).json(
                                                            { 
                                                                status: 'error', 
                                                                message: 'Slip cannot read amount.',
                                                                auth : false,
                                                                data : [],
                                                            }
                                                        );
                                                        return;
                                                    }                                                    
                                                }                                            
                                            }
                                            else
                                            {
                                                res.status(202).json(
                                                    { 
                                                        status: 'error', 
                                                        message: 'Slip is some problem.',
                                                        auth : false,
                                                        data : [],
                                                    }
                                                );
                                                return;
                                            }
                                            
                                        }                                               
                                        else
                                        {
                                            res.status(202).json(
                                                { 
                                                    status: 'error', 
                                                    message: 'Not found bank for service',
                                                    auth : false,
                                                    data : [],
                                                }
                                            );
                                            return;
                                        }
                                    }
                                }


                                res.status(200).json(
                                {   status : 'success' ,
                                    message: 'File uploaded successfully',
                                    // url: Secret.apiDomain+'slipfile/'+ rndFileName+'.'+splitExtensionName,
                                });  

                            }
                            else
                            {
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: 'Cannot read slip',
                                        auth : false,
                                        data : [],
                                    }
                                );
                                return;
                            }


                            
                        });
                    });



                    // Delete the temporary file after a successful post
                    fs.unlink(sourceFilePath, (unlinkError) => {
                        if (unlinkError) {
                            console.error('Error deleting file:', unlinkError);
                        } else {
                            //console.log('Temporary file deleted successfully');
                        }
                    });

                    return;
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
    } 
    catch (error) {        
        console.log(error);
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

exports.getSlipData = async function(req, res) {

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
            console.log("getSlipData")
             //handles null error
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (IsAuth) 
                {
                    let datas = MainModel.query("SELECT * FROM scan_slip ORDER BY upload_time desc")                    
                    res.status(202).json(
                        { 
                            status: 'success', 
                            message: "" ,
                            auth : true,
                            data : datas,
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