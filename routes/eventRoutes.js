const express = require("express");
const Event = require("../models/Event");

const verifyAdminToken = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// CREATE EVENT
// POST /api/events
// ADMIN ONLY
// ==========================================

router.post(
    "/",
    verifyAdminToken,
    async (req, res) => {

        try {

            const {
                title,
                description,
                date,
                location,
                capacity
            } = req.body;


            // Required fields

            if (
                !title ||
                !description ||
                !date ||
                !location ||
                !capacity
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Title, description, date, location and capacity are required"
                });

            }


            // Capacity validation

            if (
                Number(capacity) <= 0 ||
                !Number.isInteger(Number(capacity))
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Capacity must be a positive whole number"
                });

            }


            // Create event

            const event = await Event.create({
                title: title.trim(),
                description: description.trim(),
                date,
                location: location.trim(),
                capacity: Number(capacity)
            });


            res.status(201).json({

                success: true,

                message:
                    "Event created successfully",

                event

            });


        } catch (error) {

            console.error(
                "Create Event Error:",
                error.message
            );


            res.status(400).json({

                success: false,

                message:
                    "Failed to create event",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// GET ALL EVENTS
// GET /api/events
// PUBLIC
// ==========================================

router.get(
    "/",
    async (req, res) => {

        try {

            const events =
                await Event
                    .find()
                    .sort({
                        date: 1
                    });


            res.status(200).json({

                success: true,

                count:
                    events.length,

                events

            });


        } catch (error) {

            console.error(
                "Get Events Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch events",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// GET SINGLE EVENT
// GET /api/events/:id
// PUBLIC
// ==========================================

router.get(
    "/:id",
    async (req, res) => {

        try {

            const event =
                await Event.findById(
                    req.params.id
                );


            if (!event) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Event not found"

                });

            }


            res.status(200).json({

                success: true,

                event

            });


        } catch (error) {

            console.error(
                "Get Single Event Error:",
                error.message
            );


            res.status(400).json({

                success: false,

                message:
                    "Invalid event ID",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// UPDATE EVENT
// PUT /api/events/:id
// ADMIN ONLY
// ==========================================

router.put(
    "/:id",
    verifyAdminToken,
    async (req, res) => {

        try {

            const {
                title,
                description,
                date,
                location,
                capacity
            } = req.body;


            // Validate capacity if provided

            if (
                capacity !== undefined &&
                (
                    Number(capacity) <= 0 ||
                    !Number.isInteger(
                        Number(capacity)
                    )
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Capacity must be a positive whole number"

                });

            }


            // Build update object

            const updateData = {};


            if (title !== undefined) {
                updateData.title =
                    title.trim();
            }

            if (description !== undefined) {
                updateData.description =
                    description.trim();
            }

            if (date !== undefined) {
                updateData.date = date;
            }

            if (location !== undefined) {
                updateData.location =
                    location.trim();
            }

            if (capacity !== undefined) {
                updateData.capacity =
                    Number(capacity);
            }


            const event =
                await Event.findByIdAndUpdate(
                    req.params.id,
                    updateData,
                    {
                        new: true,
                        runValidators: true
                    }
                );


            if (!event) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Event not found"

                });

            }


            res.status(200).json({

                success: true,

                message:
                    "Event updated successfully",

                event

            });


        } catch (error) {

            console.error(
                "Update Event Error:",
                error.message
            );


            res.status(400).json({

                success: false,

                message:
                    "Failed to update event",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// DELETE EVENT
// DELETE /api/events/:id
// ADMIN ONLY
// ==========================================

router.delete(
    "/:id",
    verifyAdminToken,
    async (req, res) => {

        try {

            const event =
                await Event.findByIdAndDelete(
                    req.params.id
                );


            if (!event) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Event not found"

                });

            }


            res.status(200).json({

                success: true,

                message:
                    "Event deleted successfully"

            });


        } catch (error) {

            console.error(
                "Delete Event Error:",
                error.message
            );


            res.status(400).json({

                success: false,

                message:
                    "Failed to delete event",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;