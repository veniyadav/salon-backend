const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fileUpload = require('express-fileupload');
const userRoutes = require('./routes/userRoutes');
const staffRoutes = require('./routes/staffRoutes');
const designationRoutes = require('./routes/designationRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const beauticanRoutes = require('./routes/beauticanRoutes');
const adminBranchRoutes = require('./routes/adminBranchRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const productRoutes = require('./routes/productRoutes');
const serviceCategoryRoutes = require('./routes/serviceCategoryRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

//veni and gautam
const serviceRoutes = require('./routes/serviceRoutes');
const salonRoutes= require('./routes/salonRoutes');
const customerRoutes= require('./routes/customerRoutes');
const planRoutes = require('./routes/planRoutes');
const benefitRoutes = require('./routes/benefitRoutes');
const planBookingRoutes = require('./routes/planBookingRoutes');



const db = require('./config');
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure correct path to views
// Middleware
//app.use(cors());

app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],  // Allow all HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Allow necessary headers
}));
// ✅ Increase Payload Limit for Base64 Images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ **File Upload Middleware**
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));
app.use(
    session({
        secret: 'your_secret_key', // Change this to a secure key
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 86400000 }, // 1 day expiration
    })
);



//app.use(express.static(path.join(__dirname, 'public')));

app.get('/upload/:imageName', (req, res) => {
    const imagePath = path.join(__dirname, 'upload', req.params.imageName);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(`Error serving image: ${err}`);
            res.status(500).send(err);
        }
    });
});


// function getBaseUrl(req) {
//     const baseURL = req.protocol + '://' + req.headers.host + '/';
//     const reqUrl = new URL(req.url, baseURL);
//     return reqUrl;
//   }

  
// Middleware
app.use(cors());
app.use(bodyParser.json());


app.use('/api/user', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/designation', designationRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/beautican', beauticanRoutes);
app.use('/api/adminBranch', adminBranchRoutes);
app.use('/api/adminDashboard', adminDashboardRoutes);
app.use('/api/product', productRoutes);
app.use('/api/serviceCategory', serviceCategoryRoutes);
app.use('/api/inventory', inventoryRoutes);
//veni and gautam
app.use('/api/service', serviceRoutes);
app.use('/api/salon', salonRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/benefit', benefitRoutes);
app.use('/api/planBooking', planBookingRoutes);




// app.use('/api/user', authRoutes);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.listen(7500, () => {
    console.log('Server connected on port 7500');
});