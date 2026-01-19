// document.querySelector(".login-btn").addEventListener("click", () => {
//     const username = document.querySelector('input[type="text"]').value;
//     const password = document.querySelector('input[type="password"]').value;

//     fetch("http://localhost:3000/admin/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ username, password })
//     })
//     .then(res => res.json())
//     .then(data => {
//         if (data.success) {
//             alert("Login successful");
//             // redirect later
//             // window.location.href = "dashboard.html";
//         } else {
//             alert(data.message);
//         }
//     });
// });

// ================= ADMIN LOGIN =================
document.addEventListener("DOMContentLoaded", () => {

    
    // Clear username/password fields on page load
    document.querySelector('input[type="text"]').value = '';
    document.querySelector('input[type="password"]').value = '';

    // Prevent caching/back-forward navigation
    window.history.replaceState(null, null, window.location.href);

    // Login button click logic...



    const loginBtn = document.querySelector(".login-btn");
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');

    // Clear fields on page load
    usernameInput.value = '';
    passwordInput.value = '';

    // Prevent caching/back-forward access
    window.history.replaceState(null, null, window.location.href);

    // Redirect if admin already logged in
    if (window.location.pathname.includes("dashboard.html") &&
        sessionStorage.getItem("adminLoggedIn") !== "true") {
        window.location.href = "admins.html";
    }

    // LOGIN BUTTON CLICK
    loginBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert("Please enter username and password");
            return;
        }

        fetch("http://localhost:3000/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Save admin session
                sessionStorage.setItem("adminLoggedIn", "true");
                window.location.href = "dashboard.html";
            } else {
                alert(data.message);
            }
        })
        .catch(err => {
            console.error("Login error:", err);
            alert("Something went wrong. Try again.");
        });
    });

    window.onload = () => {
    document.querySelector('input[type="text"]').value = '';
    document.querySelector('input[type="password"]').value = '';
    window.history.replaceState(null, null, window.location.href);
};


    // ================= LOGOUT (optional) =================
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("adminLoggedIn");
            window.location.href = "admins.html";
        });
    }



});



