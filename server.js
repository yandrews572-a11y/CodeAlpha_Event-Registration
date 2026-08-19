// ==========================================
// DNS FIX
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
// FRONTEND
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
// HOME PAGE
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
// API STATUS
// ==========================================

app.get("/api", (req, res) => {

    res.json({

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

mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "✅ MongoDB Connected"
        );


        // ==========================================
        // START SERVER
        // ==========================================

        const PORT =
            process.env.PORT || 5000;


        app.listen(
            PORT,
            () => {

                console.log(
                    `🚀 Server running on http://localhost:${PORT}`
                );

                console.log(
                    `🌐 Website: http://localhost:${PORT}`
                );

                console.log(
                    `🔐 Admin: http://localhost:${PORT}/admin.html`
                );

            }
        );

    })

    .catch((error) => {

        console.error(
            "❌ MongoDB Connection Failed:",
            error.message
        );

    });