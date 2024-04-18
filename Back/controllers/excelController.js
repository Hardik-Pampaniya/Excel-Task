const mysql = require('mysql');
const xlsx = require('xlsx');
const multer = require('multer');
const path = require('path');

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'exceldb'
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload = multer({
    storage: storage
}).single('file'); // Assuming the file field name is 'file'

// Middleware to handle file upload
function handleFileUpload(req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            console.error('Error uploading file: ' + err);
            return res.status(500).json({ error: 'An error occurred while uploading the file.' });
        }
        next(); // Proceed to the next middleware
    });
}

// Endpoint to handle Excel file upload and insert data into database
function uploadExcel(req, res) {
    upload(req, res, function(err) {
        if (err) {
            console.error('Error uploading file: ' + err);
            return res.status(500).json({ error: 'An error occurred while uploading the file.' });
        }

        // Check if req.file exists
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        
        const workBook = xlsx.readFile(req.file.path);
        const workSheets = workBook.Sheets[workBook.SheetNames[0]];
        const range = xlsx.utils.decode_range(workSheets["!ref"]);

        for (let row = range.s.r; row <= range.e.r; row++) {
            let data = [];

            for (let col = range.s.c; col <= range.e.c; col++) {
                let cell = workSheets[xlsx.utils.encode_cell({r: row, c: col})];
                data.push(cell.v);
            }

            let sql = "INSERT INTO `users`(`firstname`, `lastname`, `email`) VALUES (?, ?, ?)";

            db.query(sql, data, (err, results, fields) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'An error occurred while inserting data.' });
                }
                console.log('User ID: ' + results.insertId);
            });
        }

        return res.status(200).json({ message: 'Data inserted successfully.' });
    });
}


module.exports = { handleFileUpload, uploadExcel };
