const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;


// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const addStaff = async (req, res) => {
    try {
        const {
            staffName, email, password, mobile, designationId,
            branchId, departmentId, country, dob, joiningDate, loginAllowed
        } = req.body;

        let imageUrl = '';

        if (req.files?.image) {
            try {
                const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                    folder: "salon_images"
                });
                imageUrl = result.secure_url;
                fs.unlinkSync(req.files.image.tempFilePath);
            } catch (uploadErr) {
                console.error("Image upload error:", uploadErr);
                return res.status(500).json({ status: "false", message: "Image upload failed." });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(`
            INSERT INTO staff 
            (staffName, email, password, mobile, designationId, branchId, departmentId, country, dob, joiningDate, loginAllowed, image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            staffName, email, hashedPassword, mobile, designationId, branchId, departmentId,
            country, dob, joiningDate, loginAllowed, imageUrl
        ]);

        const [newStaff] = await db.query('SELECT * FROM staff WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: "Staff added successfully",
            data: { ...newStaff[0], image: [newStaff[0].image] }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Get All Staffs
const getAllStaffs = async (req, res) => {
    try {
        const [staffs] = await db.query('SELECT * FROM staff');
        res.status(200).json({
            status: "true",
            message: "Staffs fetched successfully",
            data: staffs.map(s => ({ ...s, image: [s.image] }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Get Staff by ID
const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const [staff] = await db.query('SELECT * FROM staff WHERE id = ?', [id]);

        if (staff.length === 0) {
            return res.status(404).json({ status: "false", message: "Staff not found", data: [] });
        }

        res.status(200).json({
            status: "true",
            message: "Staff fetched successfully",
            data: { ...staff[0], image: [staff[0].image] }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Update Staff
const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            staffName, email, mobile, designationId,
            branchId, departmentId, country, dob, joiningDate, loginAllowed
        } = req.body;

        let imageUrl = req.body.image || '';

        if (req.files?.image) {
            try {
                const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                    folder: "salon_images"
                });
                imageUrl = result.secure_url;
                fs.unlinkSync(req.files.image.tempFilePath);
            } catch (uploadErr) {
                console.error("Image upload error:", uploadErr);
                return res.status(500).json({ status: "false", message: "Image upload failed." });
            }
        }

        await db.query(`
            UPDATE staff 
            SET staffName = ?, email = ?, mobile = ?, designationId = ?, branchId = ?, 
                departmentId = ?, country = ?, dob = ?, joiningDate = ?, loginAllowed = ?, image = ?
            WHERE id = ?
        `, [
            staffName, email, mobile, designationId, branchId, departmentId,
            country, dob, joiningDate, loginAllowed, imageUrl, id
        ]);

        const [updatedStaff] = await db.query('SELECT * FROM staff WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: "Staff updated successfully",
            data: { ...updatedStaff[0], image: [updatedStaff[0].image] }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Delete Staff
const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;

        const [staff] = await db.query('SELECT * FROM staff WHERE id = ?', [id]);
        if (staff.length === 0) {
            return res.status(400).json({ status: "false", message: "Staff not found", data: [] });
        }

        await db.query('DELETE FROM staff WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: "Staff deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};



module.exports = { addStaff, getAllStaffs, getStaffById, updateStaff, deleteStaff };
