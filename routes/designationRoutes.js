const express = require('express');
const { addDesignation, getAllDesignations, getDesignationById, updateDesignation, deleteDesignation } = require('../controller/designation');
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

router.post('/addDesignation', addDesignation);
router.patch('/updateDesignation/:id', updateDesignation);
router.get('/getAllDesignations', getAllDesignations);
router.get('/getDesignationById/:id', getDesignationById);
router.delete('/deleteDesignation/:id', deleteDesignation);




module.exports = router;    
