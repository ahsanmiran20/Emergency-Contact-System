const API = "http://localhost:3000/admin/fire";
let editingStation = null;

function loadFire() {
    fetch(API)
        .then(res => res.json())
        .then(rows => {
            data.innerHTML = "";
            rows.forEach(f => {
                data.innerHTML += `
                <tr>
                    <td>${f.station_name}</td>
                    <td>${f.area}</td>
                    <td>${f.contact}</td>
                    <td>
                        <button class="edit" onclick="editFire('${f.station_name}')">Edit</button>
                        <button class="delete"onclick="deleteFire('${f.station_name}')">Delete</button>
                    </td>
                </tr>`;
            });
        });
}

function saveFire() {
    const payload = {
        station_name: station_name.value,
        district: district.value,
        city: city.value,
        area: area.value,
        contact: contact.value,
        address: address.value,
        incharge_name: incharge_name.value
    };

    const method = editingStation ? "PUT" : "POST";
    const url = editingStation ? `${API}/${editingStation}` : API;

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(msg => {
        document.getElementById("msg").innerText = msg.message;
        editingStation = null;
        loadFire();
    });
}

function editFire(stationPK) {
    fetch(`${API}/${stationPK}`)
        .then(res => res.json())
        .then(f => {
            station_name.value = f.station_name;
            district.value = f.district;
            city.value = f.city;
            area.value = f.area;
            contact.value = f.contact;
            address.value = f.address;
            incharge_name.value = f.incharge_name;

            editingStation = f.station_name;
        });
}

function deleteFire(stationPK) {
    if (!confirm("Delete this fire station?")) return;

    fetch(`${API}/${stationPK}`, { method: "DELETE" })
        .then(res => res.json())
        .then(msg => {
            alert(msg.message);
            loadFire();
        });
}

loadFire();
