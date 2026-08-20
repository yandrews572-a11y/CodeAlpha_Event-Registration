// ==========================================
// DNS CONFIGURATION
// ==========================================

const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);


// ==========================================
// IMPORTS
// ==========================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();


// ==========================================
// ROUTES
// ==========================================

const authRoutes =
    require("./routes/authRoutes");

const eventRoutes =
    require("./routes/eventRoutes");

const registrationRoutes =
    require("./routes/registrationRoutes");


// ==========================================
// EXPRESS APP
// ==========================================

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// SERVE FRONTEND
// ==========================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ==========================================
// API ROUTES
// ==========================================

// Admin authentication
app.use(
    "/api/auth",
    authRoutes
);


// Event APIs
app.use(
    "/api/events",
    eventRoutes
);


// Registration APIs
app.use(
    "/api/registrations",
    registrationRoutes
);


// ==========================================
// MAIN WEBSITE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});


// ==========================================
// ADMIN LOGIN PAGE
// ==========================================

app.get("/admin-login", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "admin-login.html"
        )
    );

});


// ==========================================
// ADMIN DASHBOARD
// ==========================================

app.get("/admin", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "admin.html"
        )
    );

});


// ==========================================
// API STATUS
// ==========================================

app.get("/api", (req, res) => {

    res.status(200).json({

        success: true,

        message:
            "🚀 Event Registration API is running!",

        endpoints: {

            events:
                "/api/events",

            registrations:
                "/api/registrations",

            adminLogin:
                "/api/auth/login"

        }

    });

});


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {

    res.status(200).json({

        success: true,

        status: "OK",

        mongodb:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected",

        timestamp:
            new Date().toISOString()

    });

});


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            "Route not found"

    });

});


// ==========================================
// MONGODB CONNECTION
// ==========================================

const MONGO_URI =
    process.env.MONGO_URI;


if (!MONGO_URI) {

    console.error(
        "❌ MONGO_URI is missing in environment variables."
    );

    process.exit(1);

}


mongoose
    .connect(MONGO_URI)

    .then(() => {

        console.log(
            "✅ MongoDB Connected"
        );


        // ==========================================
        // PORT
        // ==========================================

        const PORT =
            process.env.PORT || 5000;


        // ==========================================
        // START SERVER
        // ==========================================

        app.listen(
            PORT,
            "0.0.0.0",
            () => {

                console.log(
                    `🚀 Server running on port ${PORT}`
                );

                console.log(
                    "🌐 Website ready"
                );

                console.log(
                    "🔐 Admin Login: /admin-login"
                );

                console.log(
                    "🛠️ Admin Dashboard: /admin"
                );

            }
        );

    })

    .catch((error) => {

        console.error(
            "❌ MongoDB Connection Failed:",
            error.message
        );

        process.exit(1);

    });