const express = require('express')
const router = express.Router()
const adminsettingController = require('../controllers/adminsetting.controller');
let cors = require('cors')

router.use(cors());

router.get('/getadminsetting/', adminsettingController.getadminsetting);

router.post('/getadminsettingbyid/', adminsettingController.getadminsettingbyid);

router.post('/updateadminsettingbyid/', adminsettingController.updateadminsettingbyid);


module.exports = router