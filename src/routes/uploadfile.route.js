const express = require('express')
const router = express.Router()
let cors = require('cors')

const uploadFileController = require("../controllers/uploadfile.controller.js");

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

router.post('/uploadFile/', upload.single('file'), uploadFileController.uploadFile);

router.post('/uploadFile2/', upload.single('file'), uploadFileController.uploadFile2);

module.exports = router