const districts = [
    "Bagerhat","Bandarban","Barguna","Barishal","Bhola","Bogura",
    "Brahmanbaria","Chandpur","Chattogram","Chuadanga","Cox's Bazar",
    "Comilla","Dhaka","Dinajpur","Faridpur","Feni","Gaibandha",
    "Gazipur","Gopalganj","Habiganj","Jamalpur","Jashore","Jhalokati",
    "Jhenaidah","Joypurhat","Khagrachhari","Khulna","Kishoreganj",
    "Kurigram","Kushtia","Lakshmipur","Lalmonirhat","Madaripur",
    "Magura","Manikganj","Meherpur","Moulvibazar","Munshiganj",
    "Mymensingh","Naogaon","Narail","Narayanganj","Narsingdi",
    "Natore","Netrokona","Nilphamari","Noakhali","Pabna","Panchagarh",
    "Patuakhali","Pirojpur","Rajbari","Rajshahi","Rangamati",
    "Rangpur","Satkhira","Shariatpur","Sherpur","Sirajganj",
    "Sunamganj","Sylhet","Tangail","Thakurgaon"
];

window.onload = () => {
    const d = document.getElementById('district');
    districts.forEach(x => d.innerHTML += `<option>${x}</option>`);
};

function loadAreas() {
    const district = document.getElementById('district').value;
    const area = document.getElementById('area');

    area.innerHTML = '<option value="">Select Area</option>';
    area.disabled = true;

    if (!district) return;

    fetch(`http://localhost:3000/fire/areas/${district}`)
        .then(res => res.json())
        .then(data => {
            data.forEach(a => {
                area.innerHTML += `<option value="${a.area}">${a.area}</option>`;
            });
            area.disabled = false;
        });
}


function searchFire() {
    const district = document.getElementById('district').value;
    const area = document.getElementById('area').value;
    const results = document.getElementById('results');

    if (!district || !area) {
        results.innerHTML = '<p>Please select district and area</p>';
        return;
    }

    fetch('http://localhost:3000/fire/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district, area })
    })
    .then(res => res.json())
    .then(data => {
        results.innerHTML = '';
        if (data.length === 0) {
            results.innerHTML = '<p>No fire station found</p>';
            return;
        }

        data.forEach(f => {
            results.innerHTML += `
                <div class="card">
                    <h3>${f.station_name}</h3>
                    <p>🔥 Officer In Charge: ${f.officer_incharge}</p>
                    <p>📞 ${f.contact}</p>
                    <p>📍 ${f.address}</p>
                </div>
            `;
        });
    });
}
