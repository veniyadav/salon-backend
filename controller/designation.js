const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;



// Add Designation
const addDesignation = async (req, res) => {
    try {
        const { designationName } = req.body;

        const [result] = await db.query(
            'INSERT INTO designation (designationName) VALUES (?)',
            [designationName]
        );

        const [newDesignation] = await db.query('SELECT * FROM designation WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: 'Designation added successfully',
            data: newDesignation[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

// Get All Designations
const getAllDesignations = async (req, res) => {
    try {
        const [designations] = await db.query('SELECT * FROM designation');
        res.status(200).json({
            status: "true",
            message: 'Designations fetched successfully',
            data: designations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

//  Get Designation by ID
const getDesignationById = async (req, res) => {
    try {
        const { id } = req.params;

        const [designation] = await db.query('SELECT * FROM designation WHERE id = ?', [id]);
        if (designation.length === 0) {
            return res.status(404).json({ status: "false", message: 'Designation not found', data: [] });
        }

        res.status(200).json({
            status: "true",
            message: 'Designation fetched successfully',
            data: designation[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

// Update Designation
const updateDesignation = async (req, res) => {
    try {
        const { designationName } = req.body;
        const { id } = req.params;

        await db.query(
            'UPDATE designation SET designationName = ? WHERE id = ?',
            [designationName, id]
        );

        const [updatedDesignation] = await db.query('SELECT * FROM designation WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Designation updated successfully',
            data: updatedDesignation[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

// Delete Designation
const deleteDesignation = async (req, res) => {
    try {
        const { id } = req.params;

        const [designation] = await db.query('SELECT * FROM designation WHERE id = ?', [id]);
        if (designation.length === 0) {
            return res.status(400).json({ status: "false", message: 'Designation not found', data: [] });
        }

        await db.query('DELETE FROM designation WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Designation deleted successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};




module.exports = { addDesignation, getAllDesignations, getDesignationById, updateDesignation, deleteDesignation };
