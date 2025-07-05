const express = require('express')
const router = express.Router()
let cors = require('cors')

const lineLogin = require("../controllers/linelogin.controller.js");

router.use(cors());

router.post('/', lineLogin.default);

router.post('/authorizeuser/', lineLogin.login);

router.post('/callback/', lineLogin.callback);

router.post('/getAccessToken/', lineLogin.getAccessToken);

router.post('/loginByLineId/', lineLogin.loginByLineId);

router.post('/updateLineIdWithAccount/', lineLogin.updateLineIdWithAccount);

module.exports = router