const API = "http://localhost:3000/admin/shelter";

const shelter_name = document.getElementById("shelter_name");
const Location = document.getElementById("Location");
const area = document.getElementById("area");
const data = document.getElementById("data");

let editingName = null;

// LOAD
function loadShelters() {
    fetch(API)
        .then(res => res.json())
        .then(rows => {
            data.innerHTML = "";
            rows.forEach(s => {
                data.innerHTML += `
                <tr>
                    <td>${s.shelter_name}</td>
                    <td>${s.area}</td>
                    <td>${s.Location}</td>
                    <td>
                        <button class="edit" onclick="editShelter('${s.shelter_name}')">Edit</button>
                        <button class="delete" onclick="deleteShelter('${s.shelter_name}')">Delete</button>
                    </td>
                </tr>`;
            });
        });
}

// SAVE (INSERT / UPDATE)
function saveShelter() {
    const method = editingName ? "PUT" : "POST";
    const url = editingName ? `${API}/${editingName}` : API;

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            shelter_name: shelter_name.value,
            Location: Location.value,
            area: area.value
        })
    })
    .then(res => res.json())
    .then(msg => {
        document.getElementById("msg").innerText = msg.message;
        editingName = null;
        loadShelters();
    });
}

// EDIT
function editShelter(name) {
    fetch(`${API}/${name}`)
        .then(res => res.json())
        .then(s => {
            shelter_name.value = s.shelter_name;
            Location.value = s.Location;
            area.value = s.area;
            editingName = name;
        });
}

// DELETE
function deleteShelter(name) {
    if (!confirm("Delete this shelter?")) return;

    fetch(`${API}/${name}`, { method: "DELETE" })
        .then(res => res.json())
        .then(msg => {
            alert(msg.message);
            loadShelters();
        });
}

loadShelters();
