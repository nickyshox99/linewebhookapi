const express = require('express')
let cors = require('cors')

module.exports = function(wsConnections) {
    const router = express.Router();

    router.use(cors());

    const lineWebHookController = require("../controllers/linewebhook.controller.js")(wsConnections);    
   
    router.get('/test', lineWebHookController.test);
    router.get('/broadcast', lineWebHookController.broadcast);
    router.post('/webhook/:pairKey', lineWebHookController.webhook);

    return router;
};