const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();


// ==========================================
// ADMIN LOGIN
// POST /api/auth/login
// ==========================================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }


        // Check admin email
        if (
            email.trim().toLowerCase() !==
            process.env.ADMIN_EMAIL.trim().toLowerCase()
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }


        // Check admin password
        if (
            password !==
            process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }


        // Create JWT token
        const token = jwt.sign(
            {
                email: process.env.ADMIN_EMAIL,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );


        res.status(200).json({

            success: true,

            message:
                "Admin login successful",

            token

        });


    } catch (error) {

        console.error(
            "Admin Login Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Login failed"

        });

    }

});


module.exports = router;