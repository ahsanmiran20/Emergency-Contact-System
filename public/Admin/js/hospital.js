const API = "http://localhost:3000/admin/hospital";


// protect page
if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admins.html";
}


let editName = null;

function load() {
    fetch(API).then(r => r.json()).then(d => {
        data.innerHTML = "";
        d.forEach(h => {
            data.innerHTML += `
<tr>
<td>${h.hospital_name}</td>
<td>${h.area}</td>
<td>${h.contact}</td>
<td>
<button class="edit" onclick="edit('${h.hospital_name}')">Edit</button>
<button class="delete" onclick="del('${h.hospital_name}')">Delete</button>
</td>
</tr>`;
        });
    });
}

function saveHospital() {
    const payload = {
        hospital_name: hospital_name.value,
        area: area.value,
        contact: contact.value,
        address: address.value
    };

    const method = editName ? "PUT" : "POST";
    const url = editName ? `${API}/${editName}` : API;

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(r => r.json())
        .then(m => {
            msg.innerText = m.message;
            editName = null;
            load();
        });
}

function edit(name) {
    fetch(API + "/" + name).then(r => r.json()).then(h => {
        hospital_name.value = h.hospital_name;
        area.value = h.area;
        contact.value = h.contact;
        address.value = h.address;
        editName = name;
    });
}

function del(name) {
    if (!confirm("Delete this police station?")) return;

    fetch(API + "/" + name, { method: "DELETE" })
        .then(r => r.json()).then(m => { alert(m.message); load(); });
}

load();
