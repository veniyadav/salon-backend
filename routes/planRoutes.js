const express = require('express');
const { addPlan, getAllPlans, getPlanById, updatePlan, deletePlan } = require('../controller/plan');
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

router.post('/addPlan', addPlan);
router.get('/getAllPlans', getAllPlans);
router.get('/getPlanById/:id', getPlanById);
router.patch('/updatePlan/:id', updatePlan);
router.delete('/deletePlan/:id', deletePlan);


module.exports = router;    
