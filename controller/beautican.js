const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});


const addBeautican = async (req, res) => {
    try {
        const { beauticianName, timeAvailability, branchId, contactNumber } = req.body;
        let imageUrl = '';

        

        // Handle image upload if a new image is provided
        if (req.files?.image) {
            try {
                const result = await cloudinary.uploader.upload(
                    req.files.image.tempFilePath,
                    { folder: "salon_images" }
                );
                imageUrl = result.secure_url;  // Get the secure URL of the uploaded image
            } catch (uploadErr) {
                console.error("Image upload error:", uploadErr);
                return res.status(500).json({ status: "false", message: "Image upload failed." });
            }
        }

        // Insert new beautician into the database
        const [result] = await db.query(
            'INSERT INTO beautican (beauticianName, timeAvailability, branchId, contactNumber, image) VALUES (?, ?, ?, ?, ?)',
            [beauticianName, timeAvailability, branchId, contactNumber, imageUrl]
        );

        // Get the newly created beautician from DB
        const [newBeautician] = await db.query('SELECT * FROM beautican WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: 'Beautician added successfully',
            data: {
                ...newBeautician[0],
                image: newBeautician[0].image ? [newBeautician[0].image] : []  // Return image as an array
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};



const getBeauticanById = async (req, res) => {
    try {
        const { id } = req.params;  // Beautician ID from URL parameter

        const [beautician] = await db.query('SELECT * FROM beautican WHERE id = ?', [id]);
        if (beautician.length === 0) {
            return res.status(404).json({ status: "false", message: 'Beautician not found', data: [] });
        }

        res.status(200).json({
            status: "true",
            message: 'Beautician fetched successfully',
            data: {
                ...beautician[0],
                image: beautician[0].image ? [beautician[0].image] : []  // Return image as an array
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};


const getAllBeauticans = async (req, res) => {
    try {
        const [beauticians] = await db.query('SELECT * FROM beautican');

        // Map beauticians to include image in an array
        const beauticiansWithImages = beauticians.map(beautician => ({
            ...beautician,
            image: beautician.image ? [beautician.image] : []  // Return image as an array, or empty array if no image
        }));

        res.status(200).json({
            status: "true",
            message: 'Beauticians fetched successfully',
            data: beauticiansWithImages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

const updateBeautican = async (req, res) => {
    try {
        const { beauticianName, timeAvailability, branchId, contactNumber } = req.body;
        const { id } = req.params;  // Beautician ID from URL parameter
        let imageUrl = '';

       

        // Handle image upload if a new image is provided
        if (req.files?.image) {
            try {
                const result = await cloudinary.uploader.upload(
                    req.files.image.tempFilePath,
                    { folder: "salon_images" }
                );
                imageUrl = result.secure_url;  // Get the secure URL of the uploaded image
            } catch (uploadErr) {
                console.error("Image upload error:", uploadErr);
                return res.status(500).json({ status: "false", message: "Image upload failed." });
            }
        }

        // Update beautician details in the database
        const [result] = await db.query(
            'UPDATE beautican SET beauticianName = ?, timeAvailability = ?, branchId = ?, contactNumber = ?, image = ? WHERE id = ?',
            [beauticianName, timeAvailability, branchId, contactNumber, imageUrl, id]
        );

        // Get the updated beautician from the DB
        const [updatedBeautician] = await db.query('SELECT * FROM beautican WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Beautician updated successfully',
            data: {
                ...updatedBeautician[0],
                image: updatedBeautician[0].image ? [updatedBeautician[0].image] : []  // Return image as an array
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};


const deleteBeautican = async (req, res) => {
    try {
        const { id } = req.params;  // Beautician ID from URL parameter

        // Check if beautician exists
        const [beautician] = await db.query('SELECT * FROM beautican WHERE id = ?', [id]);
        if (beautician.length === 0) {
            return res.status(400).json({ status: "false", message: 'Beautician not found', data: [] });
        }

        // Delete the beautician from the database
        await db.query('DELETE FROM beautican WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Beautician deleted successfully'
            
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};





module.exports = { addBeautican, getBeauticanById, getAllBeauticans, updateBeautican, deleteBeautican };
