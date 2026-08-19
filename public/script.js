const API_URL = "/api";

let selectedEventId = null;


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ==========================================
// LOAD EVENTS
// ==========================================

async function loadEvents() {

    const container =
        document.getElementById(
            "eventsContainer"
        );


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/events`
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                "Failed to load events"
            );

        }


        container.innerHTML = "";


        if (
            !data.events ||
            data.events.length === 0
        ) {

            container.innerHTML = `
                <div class="no-events">

                    <h3>
                        No upcoming events
                    </h3>

                    <p>
                        Check back later for new events.
                    </p>

                </div>
            `;

            return;
        }


        data.events.forEach(
            (event) => {

                const eventCard =
                    document.createElement(
                        "div"
                    );


                eventCard.className =
                    "event-card";


                const eventDate =
                    new Date(
                        event.date
                    );


                const formattedDate =
                    eventDate.toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    );


                eventCard.innerHTML = `

                    <div class="event-date">
                        ${formattedDate}
                    </div>

                    <h3>
                        ${escapeHTML(
                            event.title
                        )}
                    </h3>

                    <p class="event-description">
                        ${escapeHTML(
                            event.description
                        )}
                    </p>

                    <p class="event-info">
                        📍 ${escapeHTML(
                            event.location
                        )}
                    </p>

                    <p class="event-capacity">
                        👥 Capacity:
                        ${event.capacity}
                    </p>

                    <button
                        class="register-button explore-button"
                        type="button"
                    >
                        Explore Event
                    </button>

                `;


                const exploreButton =
                    eventCard.querySelector(
                        ".explore-button"
                    );


                exploreButton.addEventListener(
                    "click",
                    () => {

                        openEventDetails(
                            event
                        );

                    }
                );


                container.appendChild(
                    eventCard
                );

            }
        );


    } catch (error) {

        console.error(
            "Error loading events:",
            error
        );


        container.innerHTML = `

            <div class="no-events">

                <h3>
                    Unable to load events
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


// ==========================================
// OPEN EVENT DETAILS
// ==========================================

function openEventDetails(event) {

    selectedEventId =
        event._id;


    const eventDate =
        new Date(
            event.date
        );


    const formattedDate =
        eventDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    const title =
        document.getElementById(
            "detailsTitle"
        );


    const date =
        document.getElementById(
            "detailsDate"
        );


    const location =
        document.getElementById(
            "detailsLocation"
        );


    const capacity =
        document.getElementById(
            "detailsCapacity"
        );


    const description =
        document.getElementById(
            "detailsDescription"
        );


    if (title) {
        title.textContent =
            event.title;
    }


    if (date) {
        date.textContent =
            formattedDate;
    }


    if (location) {
        location.textContent =
            event.location;
    }


    if (capacity) {
        capacity.textContent =
            `${event.capacity} participants`;
    }


    if (description) {
        description.textContent =
            event.description ||
            "No description available.";
    }


    const registerButton =
        document.getElementById(
            "detailsRegisterButton"
        );


    if (registerButton) {

        registerButton.onclick =
            function () {

                closeEventDetails();


                openRegistration(
                    event._id,
                    event.title
                );

            };

    }


    const modal =
        document.getElementById(
            "eventDetailsModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }

}


// ==========================================
// CLOSE EVENT DETAILS
// ==========================================

function closeEventDetails() {

    const modal =
        document.getElementById(
            "eventDetailsModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


// ==========================================
// OPEN REGISTRATION MODAL
// ==========================================

function openRegistration(
    eventId,
    eventTitle
) {

    selectedEventId =
        eventId;


    const eventIdInput =
        document.getElementById(
            "eventId"
        );


    const title =
        document.getElementById(
            "registrationEventTitle"
        );


    const form =
        document.getElementById(
            "registrationForm"
        );


    const message =
        document.getElementById(
            "registrationMessage"
        );


    if (form) {

        form.reset();

    }


    if (eventIdInput) {

        eventIdInput.value =
            eventId;

    }


    if (title) {

        title.textContent =
            `Register for ${eventTitle}`;

    }


    if (message) {

        message.textContent =
            "";

    }


    const modal =
        document.getElementById(
            "registrationModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }

}


// ==========================================
// CLOSE REGISTRATION
// ==========================================

function closeRegistration() {

    const modal =
        document.getElementById(
            "registrationModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }


    const form =
        document.getElementById(
            "registrationForm"
        );


    if (form) {

        form.reset();

    }


    const message =
        document.getElementById(
            "registrationMessage"
        );


    if (message) {

        message.textContent =
            "";

    }


    selectedEventId =
        null;

}


// ==========================================
// REGISTRATION FORM
// ==========================================

const registrationForm =
    document.getElementById(
        "registrationForm"
    );


if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==========================================
            // GET FORM VALUES
            // ==========================================

            const name =
                document.getElementById(
                    "name"
                ).value.trim();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();


            const teamName =
                document.getElementById(
                    "teamName"
                ).value.trim();


            const noOfMembers =
                document.getElementById(
                    "noOfMembers"
                ).value;


            const formMessage =
                document.getElementById(
                    "registrationMessage"
                );


            // ==========================================
            // CHECK EVENT
            // ==========================================

            if (!selectedEventId) {

                formMessage.textContent =
                    "❌ Please select an event.";

                return;

            }


            // ==========================================
            // BASIC VALIDATION
            // ==========================================

            if (
                !name ||
                !email ||
                !phone
            ) {

                formMessage.textContent =
                    "❌ Please fill all required fields.";

                return;

            }


            if (
                noOfMembers &&
                Number(noOfMembers) < 1
            ) {

                formMessage.textContent =
                    "❌ Number of members must be at least 1.";

                return;

            }


            // ==========================================
            // SUBMIT BUTTON
            // ==========================================

            const submitButton =
                this.querySelector(
                    "button[type='submit']"
                );


            submitButton.disabled =
                true;


            submitButton.textContent =
                "Registering...";


            formMessage.textContent =
                "";


            try {

                // ==========================================
                // SEND REGISTRATION
                // ==========================================

                const response =
                    await fetch(
                        `${API_URL}/registrations`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    event:
                                        selectedEventId,

                                    name,

                                    email,

                                    phone,

                                    teamName,

                                    noOfMembers:
                                        noOfMembers
                                            ? Number(
                                                noOfMembers
                                            )
                                            : null

                                })

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Registration Response:",
                    data
                );


                // ==========================================
                // SUCCESS
                // ==========================================

                if (data.success) {

                    formMessage.textContent =
                        "✅ Registration successful! Confirmation email sent.";


                    // Keep event ID before reset

                    const currentEventId =
                        selectedEventId;


                    this.reset();


                    document.getElementById(
                        "eventId"
                    ).value =
                        currentEventId;


                    submitButton.textContent =
                        "Registered ✓";


                    // Close modal after a short delay

                    setTimeout(
                        () => {

                            closeRegistration();

                            submitButton.disabled =
                                false;

                            submitButton.textContent =
                                "Complete Registration";

                        },
                        2000
                    );


                }

                // ==========================================
                // DUPLICATE REGISTRATION
                // ==========================================

                else if (
                    response.status === 409 &&
                    data.message ===
                        "You are already registered for this event"
                ) {

                    formMessage.textContent =
                        "⚠️ You are already registered for this event.";

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Complete Registration";

                }

                // ==========================================
                // EVENT FULL
                // ==========================================

                else if (
                    response.status === 409
                ) {

                    formMessage.textContent =
                        `⚠️ ${data.message}`;

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Complete Registration";

                }

                // ==========================================
                // OTHER ERROR
                // ==========================================

                else {

                    formMessage.textContent =
                        `❌ ${
                            data.message ||
                            "Registration failed."
                        }`;

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Complete Registration";

                }


            } catch (error) {

                console.error(
                    "Registration Error:",
                    error
                );


                formMessage.textContent =
                    "❌ Unable to connect to server. Please try again.";


                submitButton.disabled =
                    false;


                submitButton.textContent =
                    "Complete Registration";

            }

        }
    );

}


// ==========================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener(
    "click",
    function (event) {

        const eventDetailsModal =
            document.getElementById(
                "eventDetailsModal"
            );


        const registrationModal =
            document.getElementById(
                "registrationModal"
            );


        if (
            event.target ===
            eventDetailsModal
        ) {

            closeEventDetails();

        }


        if (
            event.target ===
            registrationModal
        ) {

            closeRegistration();

        }

    }
);


// ==========================================
// ESC KEY
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeEventDetails();

            closeRegistration();

        }

    }
);


// ==========================================
// LOAD EVENTS WHEN PAGE LOADS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadEvents();

    }
);