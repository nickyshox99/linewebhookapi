const express = require('express');
// const ipFilter = require('ip-filter');

const bodyParser = require('body-parser');
var async = require('async')

let cors = require('cors')
var path = require('path');

const SecretKey = require('./config/secret');


const adminRoutes = require('./src/routes/adminlist.route');
const memberRoutes = require('./src/routes/memberlist.route');
const adminSettingRoutes = require('./src/routes/adminsetting.route');
const staffgroupRoutes = require('./src/routes/staffgrouplist.route');
const staffRoutes = require('./src/routes/stafflist.route');
const lineLoginRoutes  =require('./src/routes/linelogin.route');

const uploadFileRoutes  =require('./src/routes/uploadfile.route');
const slipFileRoutes  =require('./src/routes/slipfile.route');

const lineWebhookRoutes  =require('./src/routes/linewebhook.route');

const lineChatSettingRoutes  =require('./src/routes/linechatsetting.route');
const lineChatRoutes  =require('./src/routes/linechat.route');

const multer = require('multer');

const UserRemove = require('./src/modules/userremove');
const userRemove = new UserRemove();

const cron = require('node-cron');

const dbConn = require('./config/db.config');
const { json } = require('body-parser');
const excelJS = require("exceljs");

const axios = require('axios');
const rateLimit = require('express-rate-limit');
// const session = require('express-session');

// const morgan = require('morgan');

//Blocked ip address
const blockedIps = [];

// Setup server port
const port = process.env.PORT || 9502;

// create express app
let app = express();

// const shouldLog = (req, res) => {
//     // Add your conditions here, e.g. disable logging for specific routes or methods
//     return false; // Return true to enable logging
//   };

// app.use(morgan('tiny', { skip: shouldLog }));

// const MByte = 1048576;

// setInterval(() => {
//     const startUsage = process.cpuUsage();    
//     const endUsage = process.cpuUsage(startUsage);
    
//     console.log('User CPU time:', endUsage.user / 1000000, 'seconds');
//     console.log('System CPU time:', endUsage.system / 1000000, 'seconds');

//     const {rss,heapTotal,external,heapUsed} = process.memoryUsage();
//     console.log('rss',(rss/MByte).toFixed(2),
//             'external ',(external/MByte).toFixed(2),
//             'heapUsed ', (heapUsed/MByte).toFixed(2),
//             'heapTotal ', (heapTotal/MByte).toFixed(2)
//     );
// }, 5000);

// const originalConsoleLog = console.log.bind(console);
// const turnOffConsoleLog = true;

// if (turnOffConsoleLog) {
    
//     console.log = function(...args) {
//     // Join all arguments into a single string
//     const message = args.join(' ');
//         // Check if the message contains the word "rss"
//         if (message.includes('heapUsed')) {
//             // If yes, call the original console.log
//             originalConsoleLog.apply(console, args);
//         }else if (message.includes('CPU')) {
//             // If yes, call the original console.log
//             originalConsoleLog.apply(console, args);
//         }
        
//     };
// }

// app.set('trust proxy', 1);

// const limiter = rateLimit({
//     windowMs: 5 * 60 * 1000, // 5 minutes
//     max: 2000, // limit each IP to 2000 requests per windowMs
//   });
  
// app.use(limiter);

const Cryptof = require('./src/models/cryptof.model');

// let tmp = "807a0b2b-36a4-5208-1b28-482f8a8e9071";
// let tmp2 =  Cryptof.encryption(tmp);
// console.log("encrypt");
// console.log(tmp2);

// let tmp3 = Cryptof.decryption("314318e630c543efc29694eed1fcbe9371972b04338329ea1152694b37fe121ccde1baf772cf2303b83cda33236d9eec");
// console.log(tmp3);
//807a0b2b-36a4-5208-1b28-482f8a8e9071

// acc 4121271229
// deviceid 091ed861-c767-57ad-4f44-ae0e103be561
// pin 121235

// let tmp = "807a0b2b-36a4-5208-1b28-482f8a8e9071";
// let tmp2 =  Cryptof.encryption2(tmp);
// console.log(tmp2);

// Block
// app.use(ipFilter(blockedIps,{mode:'deny'}));

//Cross Origin
// app.use(cors());

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
}));

app.use(express.static(path.join(__dirname, '/src')));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
    // parse requests of content-type - application/json
app.use(bodyParser.json())

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('/');
}

function formatStrToDate(StrDate) {
    const tmpDate = StrDate.split('/');
    const newDateStr = tmpDate[2] + "/" + tmpDate[1] + "/" + tmpDate[0];
    const newDate = new Date(newDateStr);
    return newDate;
}

function formatStrToDate2(StrDate) {
    const tmpDate = StrDate.split('/');
    const newDateStr = tmpDate[2] + "-" + tmpDate[1] + "-" + tmpDate[0] + " :00:00:00";
    return newDateStr;
}

//====================================================================

var curDate = new Date();

//Get BetLog
// cron.schedule('*/3 * * * * *', async () => {

//     try {        
//         await bLog.getBetLog();
//     }
//     catch (error) 
//     {
//         console.log(error);
//     }    
// });

// cron.schedule('*/3 * * * * *', async () => {

//     try {        
//         await bLog.getBetLogSeamLess();
//     }
//     catch (error) 
//     {
//         console.log(error);
//     }    
// });

// cron.schedule('*/5 * * * *', async () => {
//     try {        
//         await userRemove.removeUser();
//         await userRemove.removeLog();
//     }
//     catch (error) 
//     {
//         console.log(error);
//     }    
// });

// testtest.test1();
// testtest.test2();

app.use('/api/admin', adminRoutes);

app.use('/api/member', memberRoutes);

app.use('/api/adminsetting', adminSettingRoutes);

app.use('/api/staffgroup', staffgroupRoutes);

app.use('/api/staff', staffRoutes);

app.use('/api/lineconnect', lineLoginRoutes);

app.use('/api/file', uploadFileRoutes);

app.use('/api/slipfile', slipFileRoutes);

app.use('/api/linechatsetting', lineChatSettingRoutes);

app.use('/api/linechat', lineChatRoutes);

app.use('/getfile/',express.static(path.join(__dirname, '/assets/')));

app.use('/getslipfile/',express.static(path.join(__dirname, '/slipfile/')));

const expressWs = require('express-ws')(app);
const uuid = require('uuid');

let wsConnections = [];
let lineWebhookRoutes2 = lineWebhookRoutes(wsConnections); 
app.use('/api/linewebhook', lineWebhookRoutes2);

app.ws('/api/linechat/wsconnect', function(ws, req) {
    
    console.log("Connected");    
    const id = uuid.v4();    
    ws.id = id;
    wsConnections.push(ws);
    console.log(wsConnections.length + " clients are connected");

    ws.send(`Server is connected`);

    ws.on('message', function(msg) {
        console.log(`${ws.id} sent message: ${msg}`);
    });

    ws.on('close', function() {        
        console.log("Closed Connection");
        wsConnections = wsConnections.filter(conn => conn.id !== ws.id);
    });
    
});

app.get('/api/linechat/wstest', function(req, res, next) {
    console.log("wstest");
    wsConnections.forEach(element => {
            console.log(element.id);
      });
  
    res.status(200).json({
        status: "success",
      });
      return;
    }
)



//====================================================================

// Handle 404 - Keep this as a last route
app.use(function(req, res, next) {
    console.log("404 File not found");
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl);
    console.log(req.body);    
    res.status(404);
    // res.sendFile(path.join(__dirname, 'src/views/errorpage.html'));
});

// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);        
});

// const expressListEndpoints = require('express-list-endpoints');
// const endpoints = expressListEndpoints(app);
// endpoints.forEach(element => {
//     if (element.path.indexOf('linewebhook')>-1) {
//         console.log(element.path);        
//     }    
// });


// Listen for incoming HTTP requests
// server.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });



// const fs = require('fs');

// function writeTimestampToFile() {
//     const timestamp = new Date().toISOString();
//     const content = `module.exports = "${timestamp}";\n`;
  
//     fs.writeFile('restarttime.js', content, { flag: 'w' }, (err) => {
//       if (err) {
//         console.error('Error writing timestamp:', err);
//       } else {
//         console.log(`Timestamp "${timestamp}" written to restarttime.js`);
//       }
//     });
//   }
  
// function restartApp() {
//     const timestamp = new Date();
//     console.log(timestamp);
//     console.log('Restarting the application...');
  
//     writeTimestampToFile();
  
//   }
  
//   function scheduleRestart() {
//     const restartInterval = 30 * 60 * 1000; // 1 hour in milliseconds
//     setTimeout(restartApp, restartInterval);    
//   }

// scheduleRestart();

