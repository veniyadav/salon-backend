const express = require('express');
const { addStaff, getAllStaffs, getStaffById, updateStaff, deleteStaff } = require('../controller/staff');
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

router.post('/addStaff', addStaff);
router.patch('/updateStaff/:id', updateStaff);
router.get('/getAllStaffs', getAllStaffs);
router.get('/getStaffById/:id', getStaffById);
router.delete('/deleteStaff/:id', deleteStaff);


module.exports = router;    
