const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const eanRoutes = require('./routes/eanRoutes');
/// mongo database connection
const mongoose = require('mongoose');
/// crate express app
const app = express();
const port = 3000;

/// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://ecom-admin:43YywdyKafi5nwjP@ecom-new.iv00u.mongodb.net/ean').then(() => {
    console.log('ean-master db connected');
}).catch(() => {
    console.log('connection failed!');
});

// mongoose.connect('mongodb://localhost:27017/ean-master').then(() => {
//     console.log('ean-master db connected');
// }).catch(() => {
//     console.log('connection failed!');
// });



/// routes
app.use('/api/v1/ean', eanRoutes);

app.get('/', (req, res) => {
    res.send('server is running');
});

/// listen port
app.listen(port, () => {
    console.log(`ean-master running on port ${port}`);
});
