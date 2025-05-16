const express = require('express');
const { addBranch, getAllBranches, getSingleBranch, updateBranch, deleteBranch } = require('../controller/adminbranch');
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

router.post('/addBranch', addBranch);
router.patch('/updateBranch/:id', updateBranch);
router.get('/getAllBranches', getAllBranches);
router.get('/getSingleBranch/:id', getSingleBranch);
router.delete('/deleteBranch/:id', deleteBranch);


module.exports = router;    
