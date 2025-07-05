'use strict';
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const Secret = require('../../config/secret');
const Cryptof = require('../models/cryptof.model');

const AdminList = require('../models/adminlist.model');
const IpAllowList = require('../models/ipallowlist.model');
const MainModel = require('../models/main.model');

const timerHelper = require('../modules/timehelper');
const fs = require('fs');
const path = require('path');

exports.uploadFile =  async (req, res) => {
    console.log('uploadFile');
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

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);
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
                            
                    // Example: Save the uploaded file to a specific location
                    const sourceFilePath = path.join(__dirname, '..', '..','00tmpfile', uploadedFile.filename);
                    const destinationPath = path.join(__dirname, '..', '..','assets', req.body.tofilename+'.'+splitExtensionName);

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
                        fs.writeFile(destinationPath, data, (err) => {
                            if (err) {
                                console.error('Error saving file:', err);
                                return res.status(500).json(
                                    {
                                        status : 'error', 
                                        message:  err.message,
                                    }
                                );
                            }

                            console.log(Secret.apiDomain+'getfile/'+ req.body.tofilename+'.'+splitExtensionName);

                            res.status(200).json(
                            {   status : 'success' ,
                                message: 'File uploaded successfully',
                                url: Secret.apiDomain+'getfile/'+ req.body.tofilename+'.'+splitExtensionName,
                            });        
                            

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

exports.uploadFile2 =  async (req, res) => {
    console.log('uploadFile2');
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
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                //let IsAuth = AdminList.isAuthenicated(userid,token);
                 let IsAuth = true;

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
                            
                    // Example: Save the uploaded file to a specific location
                    const sourceFilePath = path.join(__dirname, '..', '..','00tmpfile', uploadedFile.filename);
                    const destinationPath = path.join(__dirname, '..', '..','assets', req.body.tofilename);

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
                        fs.writeFile(destinationPath, data, (err) => {
                            if (err) {
                                console.error('Error saving file:', err);
                                return res.status(500).json(
                                    {
                                        status : 'error', 
                                        message:  err.message,
                                    }
                                );
                            }

                            console.log(Secret.apiDomain+'getfile/'+ req.body.tofilename);

                            res.status(200).json(
                            {   status : 'success' ,
                                message: 'File uploaded successfully',
                                url: Secret.apiDomain+'getfile/'+ req.body.tofilename,
                            });        
                            

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
        console.log(error.message);
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