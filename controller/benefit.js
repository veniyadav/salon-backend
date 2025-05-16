const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



// Add Benefit
const addBenefit = async (req, res) => {
    try {
        const { benefit } = req.body;

        const [result] = await db.query(
            'INSERT INTO benefit (benefit) VALUES (?)',
            [benefit]
        );

        const [newBenefit] = await db.query('SELECT * FROM benefit WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: 'Benefit added successfully',
            data: newBenefit[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

// Get All Benefit
const getAllBenefits = async (req, res) => {
    try {
        const [benefits] = await db.query('SELECT * FROM benefit');
        res.status(200).json({
            status: "true",
            message: 'Benefits fetched successfully',
            data: benefits
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

//  Get Department by ID
const getBenefitById = async (req, res) => {
    try {
        const { id } = req.params;

        const [benefit] = await db.query('SELECT * FROM benefit WHERE id = ?', [id]);
        if (benefit.length === 0) {
            return res.status(404).json({ status: "false", message: 'Benefit not found', data: [] });
        }

        res.status(200).json({
            status: "true",
            message: 'Benefit fetched successfully',
            data: benefit[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

// Update Benefit
const updateBenefit = async (req, res) => {
    try {
        const { benefit } = req.body;
        const { id } = req.params;

        await db.query(
            'UPDATE benefit SET benefit = ? WHERE id = ?',
            [benefit, id]
        );

        const [updatedBenefit] = await db.query('SELECT * FROM benefit WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Benefit updated successfully',
            data: updatedBenefit[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

// Delete Benefit
const deleteBenefit = async (req, res) => {
    try {
        const { id } = req.params;

        const [benefit] = await db.query('SELECT * FROM benefit WHERE id = ?', [id]);
        if (benefit.length === 0) {
            return res.status(400).json({ status: "false", message: 'Benefit not found', data: [] });
        }

        await db.query('DELETE FROM benefit WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Benefit deleted successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};




module.exports = { addBenefit, getAllBenefits, getBenefitById, updateBenefit, deleteBenefit };