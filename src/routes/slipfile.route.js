const express = require('express')
const router = express.Router()
let cors = require('cors')

const slipFileController = require("../controllers/slipfile.controller.js");

router.use(cors());

const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '00tmpfile'); // Path to the assets folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/uploadFile/', upload.single('file'), slipFileController.uploadSlipFile);

router.post('/getSlipData/', slipFileController.getSlipData);

module.exports = router