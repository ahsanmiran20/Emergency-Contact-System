const API = "http://localhost:3000/admin/bloodbank";
let editingId = null;

const name = document.getElementById("name");
const area = document.getElementById("area");

const contact = document.getElementById("contact");

const adress = document.getElementById("adress");



// LOAD DATA
function loadBloodBank() {
    fetch(API)
        .then(res => res.json())
        .then(rows => {
            data.innerHTML = "";
            rows.forEach(b => {
                data.innerHTML += `
                <tr>
                    <td>${b.name}</td>
                    <td>${b.area}</td>
                    <td>${b.contact}</td>
                    <td>
                        <button class="edit" onclick="editBloodBank(${b.id})">Edit</button>
                        <button class="delete" onclick="deleteBloodBank(${b.id})">Delete</button>
                    </td>
                </tr>`;
            });
        });
}

// SAVE (INSERT / UPDATE)
function saveBloodBank() {
    const payload = {
        name: name.value,
        area: area.value,
        contact: contact.value,
        adress: adress.value
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
        document.getElementById("id").value = "";
        loadBloodBank();
    });
}

// EDIT
function editBloodBank(id) {
    fetch(`${API}/${id}`)
        .then(res => res.json())
        .then(b => {
            name.value = b.name;
            area.value = b.area;
            contact.value = b.contact;
            adress.value = b.adress;
            editingId = b.id;
        });
}

// DELETE
function deleteBloodBank(id) {
    if (!confirm("Delete this blood bank?")) return;

    fetch(`${API}/${id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(msg => {
            alert(msg.message);
            loadBloodBank();
        });
}

loadBloodBank();
