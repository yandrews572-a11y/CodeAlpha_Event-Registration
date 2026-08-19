const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        // ==========================================
        // OPTIONAL TEAM DETAILS
        // ==========================================

        teamName: {
            type: String,
            trim: true,
            default: ""
        },

        noOfMembers: {
            type: Number,
            min: 1,
            default: null
        }
    },

    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "Registration",
    registrationSchema
);