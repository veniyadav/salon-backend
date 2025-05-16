const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


// Add Inventory
const addInventory = async (req, res) => {
    try {
        const {
            itemName, quantity, unit, threshold, purchasePrice,
            sellingPrice, expirationDate, salonId, branchId
        } = req.body;

        const [result] = await db.query(`
            INSERT INTO inventory 
            (itemName, quantity, unit, threshold, purchasePrice, sellingPrice, expirationDate, salonId, branchId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [itemName, quantity, unit, threshold, purchasePrice, sellingPrice, expirationDate, salonId, branchId]);

        const [newInventory] = await db.query('SELECT * FROM inventory WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: "Inventory item added successfully",
            data: newInventory[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Get All Inventory Items
const getAllInventory = async (req, res) => {
    try {
        const [items] = await db.query('SELECT * FROM inventory');
        res.status(200).json({
            status: "true",
            message: "Inventory items fetched successfully",
            data: items
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Get Inventory by ID
const getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const [item] = await db.query('SELECT * FROM inventory WHERE id = ?', [id]);

        if (item.length === 0) {
            return res.status(404).json({ status: "false", message: "Inventory item not found", data: [] });
        }

        res.status(200).json({
            status: "true",
            message: "Inventory item fetched successfully",
            data: item[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Update Inventory
const updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            itemName, quantity, unit, threshold, purchasePrice,
            sellingPrice, expirationDate, salonId, branchId
        } = req.body;

        await db.query(`
            UPDATE inventory 
            SET itemName = ?, quantity = ?, unit = ?, threshold = ?, purchasePrice = ?, 
                sellingPrice = ?, expirationDate = ?, salonId = ?, branchId = ?
            WHERE id = ?
        `, [itemName, quantity, unit, threshold, purchasePrice, sellingPrice, expirationDate, salonId, branchId, id]);

        const [updatedItem] = await db.query('SELECT * FROM inventory WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: "Inventory item updated successfully",
            data: updatedItem[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};


// Delete Inventory
const deleteInventory = async (req, res) => {
    try {
        const { id } = req.params;

        const [item] = await db.query('SELECT * FROM inventory WHERE id = ?', [id]);
        if (item.length === 0) {
            return res.status(400).json({ status: "false", message: "Inventory item not found", data: [] });
        }

        await db.query('DELETE FROM inventory WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: "Inventory item deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};



module.exports = { addInventory, getAllInventory, getInventoryById, updateInventory, deleteInventory };