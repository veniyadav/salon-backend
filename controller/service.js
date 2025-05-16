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


const addService = async (req, res) => {
    try {
        const { serviceName, salonId, beauticanId, categoryId, branchId, price, availability, duration, description } = req.body;
        let imageUrl = '';

        // Handle image upload if a new image is provided
        if (req.files?.image) {
            try {
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

        // Insert new service into the database
        const [result] = await db.query(
            'INSERT INTO service (serviceName, salonId, beauticanId, categoryId, branchId, price, availability, duration, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [serviceName, salonId, beauticanId, categoryId, branchId, price, availability, duration, description, imageUrl]
        );

        // Get the newly created service from DB
        const [newService] = await db.query('SELECT * FROM service WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: 'Service added successfully',
            data: {
                ...newService[0],
                image: newService[0].image ? [newService[0].image] : []  // Return image URL in an array
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};



const getAllServices = async (req, res) => {
    try {
        const [services] = await db.query('SELECT * FROM service');

        // Map services to include image in an array
        const servicesWithImages = services.map(service => ({
            ...service,
            image: service.image ? [service.image] : []  // Return image as an array, or empty array if no image
        }));

        res.status(200).json({
            status: "true",
            message: 'Services fetched successfully',
            data: servicesWithImages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};



const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;  // Service ID from URL parameter

        const [service] = await db.query('SELECT * FROM service WHERE id = ?', [id]);
        if (service.length === 0) {
            return res.status(404).json({ status: "false", message: 'Service not found', data: [] });
        }

        res.status(200).json({
            status: "true",
            message: 'Service fetched successfully',
            data: {
                ...service[0],
                image: service[0].image ? [service[0].image] : []  // Return image as an array
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};


const updateService = async (req, res) => {
    try {
        const { serviceName, salonId, beauticanId, categoryId, branchId, price, availability, duration, description } = req.body;
        const { id } = req.params;  // Service ID from URL parameter
        let imageUrl = '';

        // Handle image upload if a new image is provided
        if (req.files?.image) {
            try {
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

        // Update service details in the database
        const [result] = await db.query(
            'UPDATE service SET serviceName = ?, salonId = ?, beauticanId = ?, categoryId = ?, branchId = ?, price = ?, availability = ?, duration = ?, description = ?, image = ? WHERE id = ?',
            [serviceName, salonId, beauticanId, categoryId, branchId, price, availability, duration, description, imageUrl, id]
        );

        // Check if the update was successful
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "false", message: "Service not found." });
        }

        // Get the updated service from DB
        const [updatedService] = await db.query('SELECT * FROM service WHERE id = ?', [id]);

        // Ensure that the service exists before trying to access its properties
        if (!updatedService[0]) {
            return res.status(404).json({ status: "false", message: "Service not found." });
        }

        res.status(200).json({
            status: "true",
            message: 'Service updated successfully',
            data: {
                ...updatedService[0],
                image: updatedService[0].image ? [updatedService[0].image] : []  // Return image URL in an array
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};



const deleteService = async (req, res) => {
    try {
        const { id } = req.params;  // Service ID from URL parameter

        // Check if service exists
        const [service] = await db.query('SELECT * FROM service WHERE id = ?', [id]);
        if (service.length === 0) {
            return res.status(400).json({ status: "false", message: 'Service not found', data: [] });
        }

        // Delete the service from the database
        await db.query('DELETE FROM service WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Service deleted successfully'
            
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};




module.exports = { addService, getAllServices, getServiceById, updateService, deleteService };
