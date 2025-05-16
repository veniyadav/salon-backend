const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const nodemailer = require('nodemailer');



// Add Department
const addDepartment = async (req, res) => {
    try {
        const { departmentName } = req.body;

        const [result] = await db.query(
            'INSERT INTO department (departmentName) VALUES (?)',
            [departmentName]
        );

        const [newDepartment] = await db.query('SELECT * FROM department WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: 'Department added successfully',
            data: newDepartment[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

// Get All Departments
const getAllDepartments = async (req, res) => {
    try {
        const [departments] = await db.query('SELECT * FROM department');
        res.status(200).json({
            status: "true",
            message: 'Departments fetched successfully',
            data: departments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

//  Get Department by ID
const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const [department] = await db.query('SELECT * FROM department WHERE id = ?', [id]);
        if (department.length === 0) {
            return res.status(404).json({ status: "false", message: 'Department not found', data: [] });
        }

        res.status(200).json({
            status: "true",
            message: 'Department fetched successfully',
            data: department[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

// Update Department
const updateDepartment = async (req, res) => {
    try {
        const { departmentName } = req.body;
        const { id } = req.params;

        await db.query(
            'UPDATE department SET departmentName = ? WHERE id = ?',
            [departmentName, id]
        );

        const [updatedDepartment] = await db.query('SELECT * FROM department WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Department updated successfully',
            data: updatedDepartment[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};

// Delete Department
const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        const [department] = await db.query('SELECT * FROM department WHERE id = ?', [id]);
        if (department.length === 0) {
            return res.status(400).json({ status: "false", message: 'Department not found', data: [] });
        }

        await db.query('DELETE FROM department WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: 'Department deleted successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: 'Server error', data: [] });
    }
};





module.exports = { addDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment };
