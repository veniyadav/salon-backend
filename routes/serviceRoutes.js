const express = require('express');
const { addService, getAllServices, getServiceById, updateService, deleteService } = require('../controller/service');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload');  // Specify the folder where images will be stored
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);  // Get file extension
        const fileName = Date.now() + fileExtension;  // Use a unique name
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/addService', addService);
router.patch('/updateService/:id', updateService);
router.get('/getAllServices', getAllServices);
router.get('/getServiceById/:id', getServiceById);
router.delete('/deleteService/:id', deleteService);


module.exports = router;    
