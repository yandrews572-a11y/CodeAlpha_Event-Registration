const express = require("express");
const mongoose = require("mongoose");

const Registration = require("../models/Registration");
const Event = require("../models/Event");

const {
    sendRegistrationEmail
} = require("../services/emailService");

const router = express.Router();


// ==========================================
// CREATE REGISTRATION
// POST /api/registrations
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            event,
            name,
            email,
            phone,
            teamName,
            noOfMembers
        } = req.body;


        // ==========================================
        // REQUIRED FIELDS
        // ==========================================

        if (!event || !name || !email || !phone) {

            return res.status(400).json({
                success: false,
                message: "Event, name, email and phone are required"
            });

        }


        // ==========================================
        // VALID EVENT ID
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(event)) {

            return res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });

        }


        // ==========================================
        // CHECK EVENT
        // ==========================================

        const existingEvent = await Event.findById(event);

        if (!existingEvent) {

            return res.status(404).json({
                success: false,
                message: "Event not found"
            });

        }


        // ==========================================
        // CHECK DUPLICATE REGISTRATION
        // ==========================================

        const normalizedEmail = email.trim().toLowerCase();

        const existingRegistration =
            await Registration.findOne({
                event: event,
                email: normalizedEmail
            });

        if (existingRegistration) {

            return res.status(409).json({
                success: false,
                message: "You are already registered for this event"
            });

        }


        // ==========================================
        // CHECK CAPACITY
        // ==========================================

        const registrationCount =
            await Registration.countDocuments({
                event: event
            });

        if (registrationCount >= existingEvent.capacity) {

            return res.status(409).json({
                success: false,
                message: "Event registration is full"
            });

        }


        // ==========================================
        // CREATE REGISTRATION
        // ==========================================

        const registration =
    await Registration.create({

        event,

        name: name.trim(),

        email: normalizedEmail,

        phone: phone.trim(),

        teamName:
            teamName
                ? teamName.trim()
                : "",

        noOfMembers:
            noOfMembers !== undefined &&
            noOfMembers !== null &&
            noOfMembers !== ""
                ? Number(noOfMembers)
                : null

    });


        // ==========================================
        // SEND CONFIRMATION EMAIL
        // ==========================================

        try {

            await sendRegistrationEmail(
                normalizedEmail,
                name.trim(),
                existingEvent.title,
                existingEvent.date,
                existingEvent.location
            );

            console.log(
                "📧 Confirmation email sent to:",
                normalizedEmail
            );

        } catch (emailError) {

            console.error(
                "⚠️ Registration saved but email failed:",
                emailError.message
            );

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(201).json({

            success: true,

            message:
                "Registration successful. Confirmation email sent.",

            registration

        });


    } catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Registration failed",

            error: error.message

        });

    }

});


// ==========================================
// GET ALL REGISTRATIONS
// GET /api/registrations
// ==========================================

router.get("/", async (req, res) => {

    try {

        const registrations =
            await Registration.find()
                .populate(
                    "event",
                    "title date location"
                )
                .sort({
                    createdAt: -1
                });


        res.status(200).json({

            success: true,

            count: registrations.length,

            registrations

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: "Failed to fetch registrations",

            error: error.message

        });

    }

});

// ==========================================
// GET REGISTRATIONS BY EVENT
// GET /api/registrations/event/:eventId
// ==========================================

router.get("/event/:eventId", async (req, res) => {

    try {

        const { eventId } = req.params;


        // Validate event ID

        if (!mongoose.Types.ObjectId.isValid(eventId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });

        }


        // Check event

        const existingEvent =
            await Event.findById(eventId);

        if (!existingEvent) {

            return res.status(404).json({
                success: false,
                message: "Event not found"
            });

        }


        // Get registrations

        const registrations =
            await Registration.find({
                event: eventId
            })
            .populate(
                "event",
                "title date location"
            )
            .sort({
                createdAt: -1
            });


        res.status(200).json({

            success: true,

            count: registrations.length,

            registrations

        });


    } catch (error) {

        console.error(
            "Get Event Registrations Error:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch event registrations",

            error:
                error.message

        });

    }

});
// ==========================================
// GET SINGLE REGISTRATION
// GET /api/registrations/:id
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const registration =
            await Registration.findById(req.params.id)
                .populate(
                    "event",
                    "title date location"
                );


        if (!registration) {

            return res.status(404).json({

                success: false,

                message: "Registration not found"

            });

        }


        res.status(200).json({

            success: true,

            registration

        });


    } catch (error) {

        res.status(400).json({

            success: false,

            message: "Invalid registration ID",

            error: error.message

        });

    }

});


// ==========================================
// DELETE REGISTRATION
// DELETE /api/registrations/:id
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const registration =
            await Registration.findByIdAndDelete(
                req.params.id
            );


        if (!registration) {

            return res.status(404).json({

                success: false,

                message: "Registration not found"

            });

        }


        res.status(200).json({

            success: true,

            message: "Registration cancelled successfully"

        });


    } catch (error) {

        res.status(400).json({

            success: false,

            message: "Failed to cancel registration",

            error: error.message

        });

    }

});


module.exports = router;