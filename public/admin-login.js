const loginForm =
    document.getElementById("loginForm");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");


// ==========================================
// ADMIN LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;


        loginButton.disabled = true;

        loginButton.textContent =
            "Logging in...";

        loginMessage.textContent = "";


        try {

            const response =
                await fetch(
                    "/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (!data.success) {

                loginMessage.textContent =
                    `❌ ${data.message}`;

                return;
            }


            // Save JWT token
            localStorage.setItem(
                "adminToken",
                data.token
            );


            loginMessage.textContent =
                "✅ Login successful!";


            // Redirect to dashboard
            setTimeout(() => {

                window.location.href =
                    "/admin.html";

            }, 500);


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            loginMessage.textContent =
                "❌ Unable to connect to server.";

        } finally {

            loginButton.disabled = false;

            loginButton.textContent =
                "Login";
        }

    }
);