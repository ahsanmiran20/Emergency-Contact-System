const API = "http://localhost:3000/admin/personinformation";
let editingId = null;

const name = document.getElementById("name");
const blood_group = document.getElementById("blood_group");
const contact = document.getElementById("contact");
const email = document.getElementById("email");
const abability = document.getElementById("abability");
const area = document.getElementById("area");
const data = document.getElementById("data");

// LOAD
function loadDonors() {
    fetch(API)
        .then(res => res.json())
        .then(rows => {
            data.innerHTML = "";
            rows.forEach(d => {
                data.innerHTML += `
                <tr>
                    <td>${d.name}</td>
                    <td>${d.blood_group}</td>
                    <td>${d.area}</td>
                    <td>${d.contact}</td>
                    <td>
                        <button class="edit" onclick="editDonor(${d.id})">Edit</button>
                        <button class="delete" onclick="deleteDonor(${d.id})">Delete</button>
                    </td>
                </tr>`;
            });
        });
}

// SAVE (INSERT / UPDATE)
function saveDonor() {
    const payload = {
        name: name.value,
        blood_group: blood_group.value,
        contact: contact.value,
        email: email.value,
        ababilty:ababilty.value,
        area: area.value
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/${editingId}` : API;

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(msg => {
        document.getElementById("msg").innerText = msg.message;
        editingId = null;
        loadDonors();
    });
}

// EDIT
function editDonor(id) {
    fetch(`${API}/${id}`)
        .then(res => res.json())
        .then(d => {
            name.value = d.name;
            blood_group.value = d.blood_group;
            contact.value = d.contact;
            email.value = d.email;
            ababilty.value = d.ababilty;
            area.value = d.area;
            editingId = d.id;
        });
}

// DELETE
function deleteDonor(id) {
    if (!confirm("Delete this donor?")) return;

    fetch(`${API}/${id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(msg => {
            alert(msg.message);
            loadDonors();
        });
}

loadDonors();
