const API = "http://localhost:3000/admin/ambulance";

// protect page
if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admins.html";
}


function loadAmbulances() {
    fetch(API)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("ambulanceTable");
            table.innerHTML = "";

            data.forEach(a => {
                table.innerHTML += `
                    <tr>
                        <td>${a.ambulance_name}</td>
                        <td>${a.driver_name}</td>
                        <td>${a.contact}</td>
                        <td>${a.area}</td>
                        <td>${a.hospital_linked}</td>
                        <td>
                            <button class="edit" onclick="editAmbulance('${a.ambulance_name}')">Edit</button>
                            <button class="delete" onclick="deleteAmbulance('${a.ambulance_name}')">Delete</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function saveAmbulance() {
    const data = {
        ambulance_name: document.getElementById("ambulance_name").value,
        driver_name: document.getElementById("driver_name").value,
        contact: document.getElementById("contact").value,
        numberplate: document.getElementById("numberplate").value,
        hospital_linked: document.getElementById("hospital_linked").value,
        /*ambulance_type: document.getElementById("ambulance_type").value,*/
        ababilty: document.getElementById("ababilty").value,
        area: document.getElementById("area").value,
        ambulance_type:document.querySelectorAll("select")[0].value,

    };

    fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(msg => {
        document.getElementById("msg").innerText = msg.message;
        loadAmbulances();
    });
}

function editAmbulance(name) {
    fetch(`${API}/${name}`)
        .then(res => res.json())
        .then(a => {
            for (let key in a) {
                if (document.getElementById(key)) {
                    document.getElementById(key).value = a[key];
                }
            }
        });
}

function deleteAmbulance(name) {
    if (!confirm("Delete this ambulance?")) return;

    fetch(`${API}/${name}`, { method: "DELETE" })
        .then(res => res.json())
        .then(msg => {
            alert(msg.message);
            loadAmbulances();
        });
}

loadAmbulances();
