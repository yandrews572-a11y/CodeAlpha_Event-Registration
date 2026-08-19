const jwt = require("jsonwebtoken");


// ==========================================
// VERIFY ADMIN TOKEN
// ==========================================

function verifyAdminToken(req, res, next) {

    try {

        const authHeader =
            req.headers.authorization;


        // Check Authorization header

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message:
                    "Access denied. Admin login required."

            });

        }


        // Expected format:
        // Authorization: Bearer TOKEN

        const parts =
            authHeader.split(" ");


        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authorization format."

            });

        }


        const token = parts[1];


        // Verify JWT

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Check admin role

        if (decoded.role !== "admin") {

            return res.status(403).json({

                success: false,

                message:
                    "Admin access required."

            });

        }


        // Attach admin information

        req.admin = decoded;


        // Continue request

        next();


    } catch (error) {

        console.error(
            "JWT Verification Error:",
            error.message
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired admin token."

        });

    }

}


module.exports = verifyAdminToken;