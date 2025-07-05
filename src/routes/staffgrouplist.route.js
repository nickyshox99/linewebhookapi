const express = require('express')
const router = express.Router()
const staffGroupListController = require('../controllers/staffgrouplist.controller');
let cors = require('cors')

router.use(cors());

router.post('/getstaffgroup/', staffGroupListController.getStaffGroup);

router.post('/getstaffpage/', staffGroupListController.getStaffAllPage);

router.get('/getstaffgroupbyid/:Id', staffGroupListController.getStaffGroupById);

router.post('/updatestaffgroupbyid/', staffGroupListController.updateStaffGroupById);

router.post('/deletestaffgroupbyid/', staffGroupListController.deleteStaffGroupById);

router.post('/create/', staffGroupListController.create);

router.post('/checkstaffpageauthen/', staffGroupListController.checkStaffPageAuthen);

module.exports = router