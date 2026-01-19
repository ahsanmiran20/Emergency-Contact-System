const API = "http://localhost:3000/admin/police";
let editingContact = null;

// LOAD
function loadPolice() {
    fetch(API)
        .then(res => res.json())
        .then(rows => {
            data.innerHTML = "";
            rows.forEach(p => {
                data.innerHTML += `
                <tr>
                    <td>${p.station_name}</td>
                    <td>${p.area}</td>
                    <td>${p.contact}</td>
                    <td>${p.incharge_name}</td>
                    <td>
                        <button class="edit" onclick="editPolice('${p.contact}')">Edit</button>
                        <button class="delete" onclick="deletePolice('${p.contact}')">Delete</button>
                    </td>
                </tr>`;
            });
        });
}

// INSERT / UPDATE
function savePolice() {
    const payload = {
        station_name: station_name.value,
        district: district.value,
        city: city.value,
        area: area.value,
        contact: contact.value,
        address: address.value,
        incharge_name: incharge_name.value
    };

    const method = editingContact ? "PUT" : "POST";
    const url = editingContact ? `${API}/${editingContact}` : API;

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(msg => {
        document.getElementById("msg").innerText = msg.message;
        editingContact = null;
        loadPolice();
    });
}

// EDIT
function editPolice(contactPK) {
    fetch(`${API}/${contactPK}`)
        .then(res => res.json())
        .then(p => {
            station_name.value = p.station_name;
            district.value = p.district;
            city.value = p.city;
            area.value = p.area;
            contact.value = p.contact;
            address.value = p.address;
            incharge_name.value = p.incharge_name;

            editingContact = p.contact;
        });
}

// DELETE
function deletePolice(contactPK) {
    if (!confirm("Delete this police station?")) return;

    fetch(`${API}/${contactPK}`, { method: "DELETE" })
        .then(res => res.json())
        .then(msg => {
            alert(msg.message);
            loadPolice();
        });
}

loadPolice();
