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


const addSalon = async (req, res) => {
    try {
        const { salonName, location, timeAvailability, salonManager } = req.body;
        let imageUrl = '';

        // Check if an image is uploaded
        if (req.files?.image) {
            try {
                // Upload image to Cloudinary
                const result = await cloudinary.uploader.upload(
                    req.files.image.tempFilePath,  // Temporary file path of the uploaded image
                    { folder: "salon_images" }  // Folder in Cloudinary where images will be stored
                );
                imageUrl = result.secure_url;  // Get the secure URL of the uploaded image
            } catch (uploadErr) {
                console.error("Image upload error:", uploadErr);
                return res.status(500).json({ status: "false", message: "Image upload failed." });
            }
        }

        // Insert new salon into the database
        const [result] = await db.query(
            'INSERT INTO salon (salonName, location, timeAvailability, salonManager, image) VALUES (?, ?, ?, ?, ?)',
            [salonName, location, timeAvailability, salonManager, imageUrl]  // Store image URL
        );

        // Get the newly created salon from DB
        const [newSalon] = await db.query('SELECT * FROM salon WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: 'Salon added successfully',
            data: {
                ...newSalon[0],
                image: [imageUrl]  // Include image URL in response inside an array
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};


const getAllSalons = async (req, res) => {
    try {
        const [salons] = await db.query('SELECT * FROM salon');
        
        // Map salons to include image in an array
        const salonsWithImages = salons.map(salon => ({
            ...salon,
            image: salon.image ? [salon.image] : []  // Return image as an array, or empty array if no image
        }));

        res.status(200).json({
            status: "true",
            message: 'Salons fetched successfully',
            data: salonsWithImages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};


const getSalonById = async (req, res) => {
    try {
        const { id } = req.params;  // Salon ID from URL parameter

        const [salon] = await db.query('SELECT * FROM salon WHERE id = ?', [id]);
        if (salon.length === 0) {
            return res.status(404).json({ status: "false", message: 'Salon not found', data: [] });
        }

        // Return image as an array in response
        res.status(200).json({
            status: "true",
            message: 'Salon fetched successfully',
            data: {
                ...salon[0],
                image: salon[0].image ? [salon[0].image] : []  // Return image as an array, or empty array if no image
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

const updateSalon = async (req, res) => {
    try {
        const { salonName, location, timeAvailability, salonManager } = req.body;
        const { id } = req.params;  // Salon ID from URL parameter
        let imageUrl = '';

        // Check if salon exists
        const [salon] = await db.query('SELECT * FROM salon WHERE id = ?', [id]);
        if (salon.length === 0) {
            return res.status(400).json({ status: "false", message: 'Salon not found', data: [] });
        }

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

        // Update salon details in the database
        const [result] = await db.query(
            'UPDATE salon SET salonName = ?, location = ?, timeAvailability = ?, salonManager = ?, image = ? WHERE id = ?',
            [salonName, location, timeAvailability, salonManager, imageUrl || salon[0].image, id]  // Use the existing image if no new image is uploaded
        );

        // Get the updated salon from the DB
        const [updatedSalon] = await db.query('SELECT * FROM salon WHERE id = ?', [id]);

        // Return image as an array in response
        res.status(200).json({
            status: "true",
            message: 'Salon updated successfully',
            data: {
                ...updatedSalon[0],
                image: updatedSalon[0].image ? [updatedSalon[0].image] : []  // Return image as an array, or empty array if no image
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};


const deleteSalon = async (req, res) => {
    try {
        const { id } = req.params;  // Salon ID from URL parameter

        // Check if salon exists
        const [salon] = await db.query('SELECT * FROM salon WHERE id = ?', [id]);
        if (salon.length === 0) {
            return res.status(400).json({ status: "false", message: 'Salon not found', data: [] });
        }

        // Delete the salon from the database
        await db.query('DELETE FROM salon WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Salon deleted successfully'
           
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};



module.exports = { addSalon, getAllSalons , getSalonById, updateSalon, deleteSalon };