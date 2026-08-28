const nodemailer = require("nodemailer");

// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    tls: {
        family: 4
    }
});


// ==========================================
// SEND REGISTRATION EMAIL
// ==========================================

async function sendRegistrationEmail(
    userEmail,
    userName,
    eventTitle,
    eventDate,
    eventLocation
) {

    const formattedDate = new Date(eventDate).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

    const mailOptions = {

        from: `"EventHub" <${process.env.EMAIL_USER}>`,

        to: userEmail,

        subject: `🎉 Registration Confirmed - ${eventTitle}`,

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                background: #f7f8fc;
            ">

                <div style="
                    background: #ffffff;
                    padding: 30px;
                    border-radius: 15px;
                ">

                    <h1 style="color: #635bff;">
                        🎉 Registration Confirmed!
                    </h1>

                    <p>
                        Hi <strong>${userName}</strong>,
                    </p>

                    <p>
                        Your registration has been successfully
                        confirmed.
                    </p>

                    <hr>

                    <h2>${eventTitle}</h2>

                    <p>
                        📅 <strong>Date:</strong>
                        ${formattedDate}
                    </p>

                    <p>
                        📍 <strong>Location:</strong>
                        ${eventLocation}
                    </p>

                    <p>
                        👤 <strong>Participant:</strong>
                        ${userName}
                    </p>

                    <p>
                        📧 <strong>Email:</strong>
                        ${userEmail}
                    </p>

                    <hr>

                    <p>
                        We look forward to seeing you at the event!
                    </p>

                    <p>
                        <strong>EventHub Team</strong>
                    </p>

                </div>

            </div>
        `
    };

    await transporter.sendMail(mailOptions);
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    sendRegistrationEmail
};