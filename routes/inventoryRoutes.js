const express = require('express');
const { addInventory, getAllInventory, getInventoryById, updateInventory, deleteInventory } = require('../controller/inventory');
//const authMiddleware = require('../middleware/authMiddleware');
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


router.post('/addInventory', addInventory);
router.patch('/updateInventory/:id', updateInventory);
router.get('/getAllInventory', getAllInventory);
router.get('/getInventoryById/:id', getInventoryById);
router.delete('/deleteInventory/:id', deleteInventory);


module.exports = router;    


