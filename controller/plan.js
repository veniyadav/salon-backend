const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;


// Add Plan
const addPlan = async (req, res) => {
    try {
        const { planName, cost, duration, benefitId, description } = req.body;

        const [result] = await db.query(`
            INSERT INTO plan (planName, cost, duration, benefitId, description)
            VALUES (?, ?, ?, ?, ?)
        `, [planName, cost, duration, benefitId, description]);

        const [newPlan] = await db.query('SELECT * FROM plan WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: "Plan added successfully",
            data: newPlan[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Get All Plans
const getAllPlans = async (req, res) => {
    try {
        const [plans] = await db.query('SELECT * FROM plan');
        res.status(200).json({
            status: "true",
            message: "Plans fetched successfully",
            data: plans
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Get Plan by ID
const getPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const [plan] = await db.query('SELECT * FROM plan WHERE id = ?', [id]);

        if (plan.length === 0) {
            return res.status(404).json({ status: "false", message: "Plan not found", data: [] });
        }

        res.status(200).json({
            status: "true",
            message: "Plan fetched successfully",
            data: plan[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Update Plan
const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { planName, cost, duration, benefitId, description } = req.body;

        await db.query(`
            UPDATE plan 
            SET planName = ?, cost = ?, duration = ?, benefitId = ?, description = ?
            WHERE id = ?
        `, [planName, cost, duration, benefitId, description, id]);

        const [updatedPlan] = await db.query('SELECT * FROM plan WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: "Plan updated successfully",
            data: updatedPlan[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};


// Delete Plan
const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;

        const [plan] = await db.query('SELECT * FROM plan WHERE id = ?', [id]);
        if (plan.length === 0) {
            return res.status(400).json({ status: "false", message: "Plan not found", data: [] });
        }

        await db.query('DELETE FROM plan WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: "Plan deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};




module.exports = { addPlan, getAllPlans, getPlanById, updatePlan, deletePlan };
