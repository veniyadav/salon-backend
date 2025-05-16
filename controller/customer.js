const fs = require("fs");
const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



// Add Customer
const addCustomer = async (req, res) => {
    try {
        const { name, email, password, phone, address, gender, dob, notes } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(`
            INSERT INTO customer (name, email, password, phone, address, gender, dob, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [name, email, hashedPassword, phone, address, gender, dob, notes]);

        const [newCustomer] = await db.query('SELECT * FROM customer WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: "Customer added successfully",
            data: newCustomer[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Get All Customers
const getAllCustomers = async (req, res) => {
    try {
        const [customers] = await db.query('SELECT * FROM customer');
        res.status(200).json({
            status: "true",
            message: "Customers fetched successfully",
            data: customers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Get Customer by ID
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;

        const [customer] = await db.query('SELECT * FROM customer WHERE id = ?', [id]);

        if (customer.length === 0) {
            return res.status(404).json({ status: "false", message: "Customer not found", data: [] });
        }

        res.status(200).json({
            status: "true",
            message: "Customer fetched successfully",
            data: customer[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Update Customer
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, gender, dob, notes } = req.body;

        await db.query(`
            UPDATE customer 
            SET name = ?, email = ?, phone = ?, address = ?, gender = ?, dob = ?, notes = ?
            WHERE id = ?
        `, [name, email, phone, address, gender, dob, notes, id]);

        const [updatedCustomer] = await db.query('SELECT * FROM customer WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: "Customer updated successfully",
            data: updatedCustomer[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Delete Customer
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const [customer] = await db.query('SELECT * FROM customer WHERE id = ?', [id]);
        if (customer.length === 0) {
            return res.status(400).json({ status: "false", message: "Customer not found", data: [] });
        }

        await db.query('DELETE FROM customer WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: "Customer deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};





module.exports ={ addCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer}