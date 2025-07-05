const express = require('express')
const router = express.Router()
const adminlistController = require('../controllers/adminlist.controller');
let cors = require('cors')

router.use(cors());

// show
router.get('/', adminlistController.default);

router.post('/login/', adminlistController.login);

router.post('/getLoginTime/', adminlistController.getLoginTime);

router.post('/refreshtoken/', adminlistController.refreshtoken);

router.post('/isAuthenicated/', adminlistController.isAuthenicated);

router.get('/getagent/', adminlistController.getagent);

router.get('/allowipaddress/', adminlistController.allowipaddress);

// Login
router.post('/GoogleAuthen/', adminlistController.googleAuthen);

router.post('/getGoogleAuthen/', adminlistController.getGoogleAuthen);

router.post('/getTime/', adminlistController.getTime);


router.post('/changepassword/', adminlistController.changePassword);

router.post('/changewithoutpin/', adminlistController.changeWithoutPin);


module.exports = router