const express = require('express');
const { addDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require('../controller/department');
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

router.post('/addDepartment', addDepartment);
router.patch('/updateDepartment/:id', updateDepartment);
router.get('/getAllDepartments', getAllDepartments);
router.get('/getDepartmentById/:id', getDepartmentById);
router.delete('/deleteDepartment/:id', deleteDepartment);



module.exports = router;    
