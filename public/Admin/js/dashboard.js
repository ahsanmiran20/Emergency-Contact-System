document.addEventListener("DOMContentLoaded", () => {

    // Protect dashboard
    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
        window.location.href = "admins.html";
    }

    // Logout
    document.getElementById("logout-btn").onclick = () => {
        sessionStorage.removeItem("adminLoggedIn");
        window.location.href = "admins.html";
    };

    // Load stats
    fetch("http://localhost:3000/admin/dashboard/stats")
        .then(res => res.json())
        .then(data => {
            document.getElementById("ambulanceCount").innerText = data.ambulance;
            document.getElementById("hospitalCount").innerText = data.hospital;
            document.getElementById("doctorCount").innerText = data.doctor;
            document.getElementById("bloodCount").innerText = data.bloodbank;
            document.getElementById("shelterCount").innerText = data.shelter;
            document.getElementById("policeCount").innerText = data.police_station;
            document.getElementById("fireCount").innerText = data.fire_service;
        });

    // Load recent updates
    fetch("http://localhost:3000/admin/dashboard/recent")
        .then(res => res.json())
        .then(rows => {
            const table = document.getElementById("recentTable");
            table.innerHTML = "";

            rows.forEach(r => {
                table.innerHTML += `
                    <tr>
                        <td>${r.type}</td>
                        <td>${r.name}</td>
                        <td>${r.area}</td>
                        <td>${r.updated_at}</td>
                    </tr>
                `;
            });
        });

});
