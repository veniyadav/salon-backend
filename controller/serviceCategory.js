const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addCategory = async (req, res) => {
    try {
        const { serviceName } = req.body;

        
        // Insert new service category into the database
        const [result] = await db.query(
            'INSERT INTO servicecategory (serviceName) VALUES (?)',
            [serviceName]
        );

        // Get the newly created service category from DB
        const [newCategory] = await db.query('SELECT * FROM servicecategory WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: 'Service category added successfully',
            data: newCategory[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};



const getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM servicecategory');
        res.status(200).json({
            status: "true",
            message: 'Service categories fetched successfully',
            data: categories
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};



const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;  // Service Category ID from URL parameter

        const [category] = await db.query('SELECT * FROM servicecategory WHERE id = ?', [id]);
        if (category.length === 0) {
            return res.status(404).json({ status: "false", message: 'Service category not found', data: [] });
        }

        res.status(200).json({
            status: "true",
            message: 'Service category fetched successfully',
            data: category[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};



const updateCategory = async (req, res) => {
    try {
        const { serviceName } = req.body;
        const { id } = req.params;  // Category ID from URL parameter

        
        // Update service category details in the database
        const [result] = await db.query(
            'UPDATE servicecategory SET serviceName = ? WHERE id = ?',
            [serviceName, id]
        );

        // Get the updated service category from the DB
        const [updatedCategory] = await db.query('SELECT * FROM servicecategory WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Service category updated successfully',
            data: updatedCategory[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};



const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;  // Category ID from URL parameter

        // Check if service category exists
        const [category] = await db.query('SELECT * FROM servicecategory WHERE id = ?', [id]);
        if (category.length === 0) {
            return res.status(400).json({ status: "false", message: 'Service category not found', data: [] });
        }

        // Delete the service category from the database
        await db.query('DELETE FROM servicecategory WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Service category deleted successfully'
           
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};






module.exports = { addCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
