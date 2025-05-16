const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


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


const addBranch = async (req, res) => {
    try {
        const { branchName, salonId, location, contact } = req.body;

       
        // Insert new branch into the database
        const [result] = await db.query(
            'INSERT INTO adminbranch (branchName, salonId, location, contact) VALUES (?, ?, ?, ?)',
            [branchName, salonId, location, contact]
        );

        // Get the new branch from DB
        const [newBranch] = await db.query('SELECT * FROM adminbranch WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: 'Branch added successfully',
            data: newBranch[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};




const getAllBranches = async (req, res) => {
    try {
        const [branches] = await db.query('SELECT * FROM adminbranch');
        res.status(200).json({
            status: "true",
            message: 'Branches fetched successfully',
            data: branches
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};



const getSingleBranch = async (req, res) => {
    try {
        const { id } = req.params;  // Branch ID from URL parameter

        // Check if branch exists
        const [branch] = await db.query('SELECT * FROM adminbranch WHERE id = ?', [id]);
        if (branch.length === 0) {
            return res.status(404).json({ status: "false", message: 'Branch not found', data: [] });
        }

        res.status(200).json({
            status: "true",
            message: 'Branch fetched successfully',
            data: branch[0]  // Send the first (and only) result from the query
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};




const updateBranch = async (req, res) => {
    try {
        const { branchName, salonId, location, contact } = req.body;
        const { id } = req.params;  // Branch ID from URL parameter

         // Update branch details
        const [result] = await db.query(
            'UPDATE adminbranch SET branchName = ?, salonId = ?, location = ?, contact = ? WHERE id = ?',
            [branchName, salonId, location, contact, id]
        );

        // Get updated branch
        const [updatedBranch] = await db.query('SELECT * FROM adminbranch WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Branch updated successfully',
            data: updatedBranch[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};



const deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;  // Branch ID from URL parameter

        // Check if branch exists
        const [branch] = await db.query('SELECT * FROM adminbranch WHERE id = ?', [id]);
        if (branch.length === 0) {
            return res.status(400).json({ status: "false", message: 'Branch not found', data: [] });
        }

        // Delete the branch
        await db.query('DELETE FROM adminbranch WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Branch deleted successfully'
            
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};



module.exports = { addBranch, getAllBranches, getSingleBranch, updateBranch, deleteBranch };
