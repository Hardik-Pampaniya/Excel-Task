const express = require('express');
const routes = require('./routes/excelRoutes');
const cors = require('cors');


const app = express();
const port = 5000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000' 
}));

app.use(routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
