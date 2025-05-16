const express = require('express');
const { addPlanBooking, getAllPlanBookings, getPlanBookingById, updatePlanBooking, deletePlanBooking } = require('../controller/planBooking');
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

router.post('/addPlanBooking', addPlanBooking);
router.get('/getAllPlanBookings', getAllPlanBookings);
router.get('/getPlanBookingById/:id', getPlanBookingById);
router.patch('/updatePlanBooking/:id', updatePlanBooking);
router.delete('/deletePlanBooking/:id', deletePlanBooking);


module.exports = router;    
