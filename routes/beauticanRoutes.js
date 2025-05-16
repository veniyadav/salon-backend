const express = require('express');
const { addBeautican, getBeauticanById, getAllBeauticans, updateBeautican, deleteBeautican } = require('../controller/beautican');
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

router.post('/addBeautican', addBeautican);
router.patch('/updateBeautican/:id', updateBeautican);
router.get('/getAllBeauticians', getAllBeauticans);
router.get('/getBeauticanById/:id', getBeauticanById);
router.delete('/deleteBeautican/:id', deleteBeautican);



module.exports = router;    
