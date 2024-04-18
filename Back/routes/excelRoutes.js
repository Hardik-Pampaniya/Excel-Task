const express = require('express');
const { uploadExcel, getUsers } = require('../controllers/excelController');

const router = express.Router();

// Endpoint to handle Excel file upload
router.post('/upload', uploadExcel);

router.get('/users', getUsers);

module.exports = router;
