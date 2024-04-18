const express = require('express');
const { uploadExcel } = require('../controllers/excelController');

const router = express.Router();

// Endpoint to handle Excel file upload
router.post('/upload', uploadExcel);



module.exports = router;
