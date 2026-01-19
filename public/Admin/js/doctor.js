const API = "http://localhost:3000/admin/doctor";
let editingHospital = null;

const doctor_name = document.getElementById("doctor_name");
const speciality = document.getElementById("speciality");
const visiting_time = document.getElementById("visiting_time");
const availability = document.getElementById("availability");
const hospital_name = document.getElementById("hospital_name");
const data = document.getElementById("data");

function loadDoctors() {
    fetch(API)
        .then(res => res.json())
        .then(rows => {
            data.innerHTML = "";
            rows.forEach(d => {
                data.innerHTML += `
                <tr>
                    <td>${d.doctor_name}</td>
                    <td>${d.speciality}</td>
                    <td>${d.hospital_name}</td>
                    <td>
                        <button class="edit" onclick="editDoctor('${d.hospital_name}')">Edit</button>
                        <button class="delete" onclick="deleteDoctor('${d.hospital_name}')">Delete</button>
                    </td>
                </tr>`;
            });
        });
}

function saveDoctor() {
    const method = editingHospital ? "PUT" : "POST";
    const url = editingHospital
        ? `${API}/${encodeURIComponent(editingHospital)}`
        : API;

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            doctor_name: doctor_name.value,
            speciality: speciality.value,
            visiting_time: visiting_time.value,
            availability: availability.value,
            hospital_name: hospital_name.value
        })
    })
    .then(res => res.json())
    .then(msg => {
        document.getElementById("msg").innerText = msg.message;
        editingHospital = null;
        loadDoctors();
    });
}

function editDoctor(hospitalName) {
    fetch(`${API}/${encodeURIComponent(hospitalName)}`)
        .then(res => res.json())
        .then(d => {
            doctor_name.value = d.doctor_name;
            speciality.value = d.speciality;
            visiting_time.value = d.visiting_time;
            availability.value = d.availability;
            hospital_name.value = d.hospital_name;
            editingHospital = hospitalName;
        });
}


function deleteDoctor(hospitalName) {
    if (!confirm("Delete this doctor?")) return;

    fetch(API + "/" + encodeURIComponent(hospitalName), {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(msg => {
        alert(msg.message);
        loadDoctors();
    });
}

loadDoctors();
