const API_URL = "/api";


// ==========================================
// GET ADMIN TOKEN
// ==========================================

function getAdminToken() {

    return localStorage.getItem(
        "adminToken"
    );

}


// ==========================================
// CHECK ADMIN LOGIN
// ==========================================

function checkAdminLogin() {

    const token =
        getAdminToken();


    if (!token) {

        window.location.href =
            "/admin-login.html";

        return false;

    }


    return true;

}


// ==========================================
// AUTH ERROR
// ==========================================

function handleAuthError() {

    localStorage.removeItem(
        "adminToken"
    );


    alert(
        "Your admin session has expired. Please login again."
    );


    window.location.href =
        "/admin-login.html";

}


// ==========================================
// LOGOUT
// ==========================================

function logoutAdmin() {

    localStorage.removeItem(
        "adminToken"
    );


    window.location.href =
        "/admin-login.html";

}


// ==========================================
// CREATE EVENT
// ==========================================

const eventForm =
    document.getElementById(
        "eventForm"
    );


if (eventForm) {

    eventForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            if (!checkAdminLogin()) {
                return;
            }


            const title =
                document.getElementById(
                    "title"
                ).value.trim();


            const description =
                document.getElementById(
                    "description"
                ).value.trim();


            const date =
                document.getElementById(
                    "date"
                ).value;


            const location =
                document.getElementById(
                    "location"
                ).value.trim();


            const capacity =
                Number(
                    document.getElementById(
                        "capacity"
                    ).value
                );


            const button =
                document.getElementById(
                    "createEventButton"
                );


            const message =
                document.getElementById(
                    "eventMessage"
                );


            button.disabled =
                true;


            button.textContent =
                "Creating...";


            try {

                const token =
                    getAdminToken();


                const response =
                    await fetch(
                        `${API_URL}/events`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    title,

                                    description,

                                    date,

                                    location,

                                    capacity

                                })

                        }
                    );


                const data =
                    await response.json();


                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    handleAuthError();

                    return;

                }


                if (data.success) {

                    message.textContent =
                        "✅ Event created successfully!";


                    eventForm.reset();


                    loadAdminEvents();

                } else {

                    message.textContent =
                        `❌ ${data.message}`;

                }


            } catch (error) {

                console.error(
                    "Create Event Error:",
                    error
                );


                message.textContent =
                    "❌ Unable to create event.";

            } finally {

                button.disabled =
                    false;


                button.textContent =
                    "+ Create Event";

            }

        }
    );

}


// ==========================================
// LOAD EVENTS
// ==========================================

async function loadAdminEvents() {

    if (!checkAdminLogin()) {
        return;
    }


    const container =
        document.getElementById(
            "adminEventsContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <p class="loading">
            Loading events...
        </p>
    `;


    try {

        const response =
            await fetch(
                `${API_URL}/events`
            );


        const data =
            await response.json();


        if (!data.success) {

            container.innerHTML = `
                <p class="no-events">
                    ❌ Failed to load events.
                </p>
            `;

            return;

        }


        container.innerHTML =
            "";


        if (
            !data.events ||
            data.events.length === 0
        ) {

            container.innerHTML = `
                <p class="no-events">
                    No events available.
                </p>
            `;

            return;

        }


        data.events.forEach(
            (event) => {


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "admin-event-item";


                // ==========================================
                // EVENT INFO
                // ==========================================

                const eventInfo =
                    document.createElement(
                        "div"
                    );


                eventInfo.className =
                    "admin-event-info";


                const title =
                    document.createElement(
                        "h3"
                    );


                title.textContent =
                    event.title;


                const date =
                    document.createElement(
                        "p"
                    );


                date.textContent =
                    `📅 ${
                        new Date(
                            event.date
                        ).toLocaleDateString(
                            "en-IN",
                            {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            }
                        )
                    }`;


                const location =
                    document.createElement(
                        "p"
                    );


                location.textContent =
                    `📍 ${event.location}`;


                const capacity =
                    document.createElement(
                        "p"
                    );


                capacity.textContent =
                    `👥 Capacity: ${event.capacity}`;


                eventInfo.appendChild(
                    title
                );


                eventInfo.appendChild(
                    date
                );


                eventInfo.appendChild(
                    location
                );


                eventInfo.appendChild(
                    capacity
                );


                // ==========================================
                // ACTIONS
                // ==========================================

                const actions =
                    document.createElement(
                        "div"
                    );


                actions.className =
                    "admin-event-actions";


                // ==========================================
                // EDIT BUTTON
                // ==========================================

                const editButton =
                    document.createElement(
                        "button"
                    );


                editButton.className =
                    "edit-event-button";


                editButton.textContent =
                    "✏️ Edit";


                editButton.addEventListener(
                    "click",
                    () => {

                        openEditEvent(
                            event
                        );

                    }
                );


                // ==========================================
                // DELETE BUTTON
                // ==========================================

                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.className =
                    "delete-event-button";


                deleteButton.textContent =
                    "🗑️ Delete";


                deleteButton.addEventListener(
                    "click",
                    () => {

                        deleteEvent(
                            event._id,
                            event.title
                        );

                    }
                );


                // ==========================================
                // REGISTRATIONS BUTTON
                // ==========================================

                const registrationsButton =
                    document.createElement(
                        "button"
                    );


                registrationsButton.className =
                    "registrations-button";


                registrationsButton.textContent =
                    "👥 Registrations";


                registrationsButton.addEventListener(
                    "click",
                    () => {

                        viewRegistrations(
                            event._id,
                            event.title
                        );

                    }
                );


                actions.appendChild(
                    editButton
                );


                actions.appendChild(
                    deleteButton
                );


                actions.appendChild(
                    registrationsButton
                );


                card.appendChild(
                    eventInfo
                );


                card.appendChild(
                    actions
                );


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Load Events Error:",
            error
        );


        container.innerHTML = `
            <p class="no-events">
                ❌ Unable to load events.
            </p>
        `;

    }

}


// ==========================================
// DELETE EVENT
// ==========================================

async function deleteEvent(
    eventId,
    eventTitle
) {

    if (!checkAdminLogin()) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${eventTitle}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const token =
            getAdminToken();


        const response =
            await fetch(
                `${API_URL}/events/${eventId}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleAuthError();

            return;

        }


        if (data.success) {

            alert(
                "✅ Event deleted successfully!"
            );


            loadAdminEvents();

        } else {

            alert(
                `❌ ${data.message}`
            );

        }


    } catch (error) {

        console.error(
            "Delete Event Error:",
            error
        );


        alert(
            "❌ Failed to delete event."
        );

    }

}


// ==========================================
// OPEN EDIT EVENT
// ==========================================

function openEditEvent(event) {

    const modal =
        document.getElementById(
            "editEventModal"
        );


    if (!modal) {
        return;
    }


    document.getElementById(
        "editEventId"
    ).value =
        event._id;


    document.getElementById(
        "editTitle"
    ).value =
        event.title;


    document.getElementById(
        "editDescription"
    ).value =
        event.description;


    document.getElementById(
        "editDate"
    ).value =
        event.date.split("T")[0];


    document.getElementById(
        "editLocation"
    ).value =
        event.location;


    document.getElementById(
        "editCapacity"
    ).value =
        event.capacity;


    const message =
        document.getElementById(
            "editEventMessage"
        );


    if (message) {
        message.textContent =
            "";
    }


    modal.classList.add(
        "active"
    );

}


// ==========================================
// CLOSE EDIT EVENT
// ==========================================

function closeEditEvent() {

    const modal =
        document.getElementById(
            "editEventModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


// ==========================================
// UPDATE EVENT
// ==========================================

const editEventForm =
    document.getElementById(
        "editEventForm"
    );


if (editEventForm) {

    editEventForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            if (!checkAdminLogin()) {
                return;
            }


            const eventId =
                document.getElementById(
                    "editEventId"
                ).value;


            const title =
                document.getElementById(
                    "editTitle"
                ).value.trim();


            const description =
                document.getElementById(
                    "editDescription"
                ).value.trim();


            const date =
                document.getElementById(
                    "editDate"
                ).value;


            const location =
                document.getElementById(
                    "editLocation"
                ).value.trim();


            const capacity =
                Number(
                    document.getElementById(
                        "editCapacity"
                    ).value
                );


            const button =
                document.getElementById(
                    "updateEventButton"
                );


            const message =
                document.getElementById(
                    "editEventMessage"
                );


            button.disabled =
                true;


            button.textContent =
                "Updating...";


            try {

                const token =
                    getAdminToken();


                const response =
                    await fetch(
                        `${API_URL}/events/${eventId}`,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    title,

                                    description,

                                    date,

                                    location,

                                    capacity

                                })

                        }
                    );


                const data =
                    await response.json();


                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    handleAuthError();

                    return;

                }


                if (data.success) {

                    message.textContent =
                        "✅ Event updated successfully!";


                    loadAdminEvents();


                    setTimeout(
                        () => {

                            closeEditEvent();

                        },
                        700
                    );

                } else {

                    message.textContent =
                        `❌ ${data.message}`;

                }


            } catch (error) {

                console.error(
                    "Update Event Error:",
                    error
                );


                message.textContent =
                    "❌ Failed to update event.";

            } finally {

                button.disabled =
                    false;


                button.textContent =
                    "Update Event";

            }

        }
    );

}


// ==========================================
// VIEW REGISTRATIONS
// ==========================================

async function viewRegistrations(
    eventId,
    eventTitle
) {

    if (!checkAdminLogin()) {
        return;
    }


    const modal =
        document.getElementById(
            "registrationsModal"
        );


    const title =
        document.getElementById(
            "registrationEventTitle"
        );


    const count =
        document.getElementById(
            "registrationCount"
        );


    const container =
        document.getElementById(
            "registrationsContainer"
        );


    if (
        !modal ||
        !title ||
        !count ||
        !container
    ) {

        console.error(
            "Registration modal elements missing."
        );

        return;
    }


    title.textContent =
        eventTitle;


    count.textContent =
        "0";


    container.innerHTML = `
        <p class="loading">
            Loading registrations...
        </p>
    `;


    modal.classList.add(
        "active"
    );


    try {

        const token =
            getAdminToken();


        const response =
            await fetch(
                `${API_URL}/registrations/event/${eventId}`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "Registration API Response:",
            data
        );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleAuthError();

            return;

        }


        if (!data.success) {

            count.textContent =
                "0";


            container.innerHTML = `

                <div class="empty-registrations">

                    <div class="empty-icon">
                        ❌
                    </div>

                    <h3>
                        Failed to load registrations
                    </h3>

                    <p>
                        ${
                            data.message ||
                            "Unknown error"
                        }
                    </p>

                </div>

            `;

            return;

        }


        const registrations =
            Array.isArray(
                data.registrations
            )
                ? data.registrations
                : [];


        count.textContent =
            registrations.length;


        if (
            registrations.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-registrations">

                    <div class="empty-icon">
                        👥
                    </div>

                    <h3>
                        No registrations yet
                    </h3>

                    <p>
                        Nobody has registered
                        for this event yet.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            "";


        registrations.forEach(
            (registration, index) => {


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "registration-item";


                // Number

                const number =
                    document.createElement(
                        "div"
                    );


                number.className =
                    "participant-number";


                number.textContent =
                    index + 1;


                // Info

                const info =
                    document.createElement(
                        "div"
                    );


                info.className =
                    "participant-info";


                // Name

                const name =
                    document.createElement(
                        "h3"
                    );


                name.textContent =
                    registration.name ||
                    "Unknown Participant";


                // Email

                const email =
                    document.createElement(
                        "p"
                    );


                email.textContent =
                    `📧 ${
                        registration.email ||
                        "No email"
                    }`;


                // Phone

                const phone =
                    document.createElement(
                        "p"
                    );


                phone.textContent =
                    `📱 ${
                        registration.phone ||
                        "No phone"
                    }`;


                // Team

                const team =
                    document.createElement(
                        "p"
                    );


                if (
                    registration.teamName &&
                    registration.teamName.trim() !== ""
                ) {

                    team.textContent =
                        `👥 Team: ${
                            registration.teamName
                        }`;

                } else {

                    team.textContent =
                        "👤 Individual Registration";

                }


                // Members

                const members =
                    document.createElement(
                        "p"
                    );


                if (
                    registration.noOfMembers
                ) {

                    members.textContent =
                        `🔢 Members: ${
                            registration.noOfMembers
                        }`;

                } else {

                    members.textContent =
                        "🔢 Members: Not specified";

                }


                // Registered date

                const registeredDate =
                    document.createElement(
                        "small"
                    );


                if (
                    registration.createdAt
                ) {

                    const date =
                        new Date(
                            registration.createdAt
                        );


                    registeredDate.textContent =
                        `Registered: ${
                            date.toLocaleDateString(
                                "en-IN",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                }
                            )
                        }`;

                } else {

                    registeredDate.textContent =
                        "Registration date unavailable";

                }


                // Add participant info

                info.appendChild(
                    name
                );


                info.appendChild(
                    email
                );


                info.appendChild(
                    phone
                );


                info.appendChild(
                    team
                );


                info.appendChild(
                    members
                );


                info.appendChild(
                    registeredDate
                );


                // Add card

                card.appendChild(
                    number
                );


                card.appendChild(
                    info
                );


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "View Registrations Error:",
            error
        );


        count.textContent =
            "0";


        container.innerHTML = `

            <div class="empty-registrations">

                <div class="empty-icon">
                    ❌
                </div>

                <h3>
                    Failed to load registrations
                </h3>

                <p>
                    Please try again.
                </p>

            </div>

        `;

    }

}


// ==========================================
// CLOSE REGISTRATIONS
// ==========================================

function closeRegistrations() {

    const modal =
        document.getElementById(
            "registrationsModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


// ==========================================
// REFRESH EVENTS
// ==========================================

function refreshEvents() {

    loadAdminEvents();

}


// ==========================================
// INITIALIZE ADMIN DASHBOARD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!checkAdminLogin()) {
            return;
        }


        loadAdminEvents();

    }
);