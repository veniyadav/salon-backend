const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');

// ➕ Add Product
const addProduct = async (req, res) => {
    try {
        const { productName, stock, branchId, categoryId, price, availableStatus } = req.body;

        const [result] = await db.query(`
            INSERT INTO product (productName, stock, branchId, categoryId, price, availableStatus)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [productName, stock, branchId, categoryId, price, availableStatus]);

        const [newProduct] = await db.query('SELECT * FROM product WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: "Product added successfully",
            data: newProduct[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// 📥 Get All Products
const getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM product');
        res.status(200).json({
            status: "true",
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// 🔍 Get Product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const [product] = await db.query('SELECT * FROM product WHERE id = ?', [id]);

        if (product.length === 0) {
            return res.status(404).json({ status: "false", message: "Product not found", data: [] });
        }

        res.status(200).json({
            status: "true",
            message: "Product fetched successfully",
            data: product[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// ✏️ Update Product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, stock, branchId, categoryId, price, availableStatus } = req.body;

        await db.query(`
            UPDATE product 
            SET productName = ?, stock = ?, branchId = ?, categoryId = ?, price = ?, availableStatus = ?
            WHERE id = ?
        `, [productName, stock, branchId, categoryId, price, availableStatus, id]);

        const [updatedProduct] = await db.query('SELECT * FROM product WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: "Product updated successfully",
            data: updatedProduct[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const [product] = await db.query('SELECT * FROM product WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(400).json({ status: "false", message: "Product not found", data: [] });
        }

        await db.query('DELETE FROM product WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};



module.exports = { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
