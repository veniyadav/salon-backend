const fs = require("fs");
const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


// Add Plan Booking
const addPlanBooking = async (req, res) => {
    try {
        const {
            customerId, email, planId, price,
            address, paymentType, bookingDate, duration, totalAmount
        } = req.body;

        const [result] = await db.query(`
            INSERT INTO planbooking 
            (customerId, email, planId, price, address, paymentType, bookingDate, duration, totalAmount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            customerId, email, planId, price,
            address, paymentType, bookingDate, duration, totalAmount
        ]);

        const [newBooking] = await db.query('SELECT * FROM planbooking WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "true",
            message: "Plan booked successfully",
            data: newBooking[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};


// Get All Bookings
const getAllPlanBookings = async (req, res) => {
    try {
        const [bookings] = await db.query('SELECT * FROM planbooking');
        res.status(200).json({
            status: "true",
            message: "Plan bookings fetched successfully",
            data: bookings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};

// Get Booking by ID
const getPlanBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const [booking] = await db.query('SELECT * FROM planbooking WHERE id = ?', [id]);

        if (booking.length === 0) {
            return res.status(404).json({ status: "false", message: "Booking not found", data: [] });
        }

        res.status(200).json({
            status: "true",
            message: "Plan booking fetched successfully",
            data: booking[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};


// Update Booking
const updatePlanBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            customerId, email, planId, price,
            address, paymentType, bookingDate, duration, totalAmount
        } = req.body;

        await db.query(`
            UPDATE planbooking 
            SET customerId = ?, email = ?, planId = ?, price = ?, address = ?, 
                paymentType = ?, bookingDate = ?, duration = ?, totalAmount = ?
            WHERE id = ?
        `, [
            customerId, email, planId, price,
            address, paymentType, bookingDate, duration, totalAmount, id
        ]);

        const [updatedBooking] = await db.query('SELECT * FROM planbooking WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: "Plan booking updated successfully",
            data: updatedBooking[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};


// Delete Booking
const deletePlanBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const [booking] = await db.query('SELECT * FROM planbooking WHERE id = ?', [id]);
        if (booking.length === 0) {
            return res.status(400).json({ status: "false", message: "Booking not found", data: [] });
        }

        await db.query('DELETE FROM planbooking WHERE id = ?', [id]);

        res.status(200).json({
            status: "true",
            message: "Plan booking deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "false", message: "Server error", data: [] });
    }
};



module.exports = { addPlanBooking, getAllPlanBookings, getPlanBookingById, updatePlanBooking, deletePlanBooking };

