const bangladeshDistricts = [
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
    const districtSelect = document.getElementById('district');
    bangladeshDistricts.forEach(d => {
        districtSelect.innerHTML += `<option value="${d}">${d}</option>`;
    });
};

function loadCities() {
    const district = document.getElementById('district').value;
    const city = document.getElementById('city');
    const area = document.getElementById('area');

    city.innerHTML = '<option value="">Select City</option>';
    area.innerHTML = '<option value="">Select Area</option>';
    city.disabled = true;
    area.disabled = true;

    if (!district) return;

    fetch(`http://localhost:3000/police/cities/${district}`)
        .then(res => res.json())
        .then(data => {
            data.forEach(c => {
                city.innerHTML += `<option value="${c.city}">${c.city}</option>`;
            });
            city.disabled = false;
        });
}

function loadAreas() {
    const city = document.getElementById('city').value;
    const area = document.getElementById('area');

    area.innerHTML = '<option value="">Select Area</option>';
    area.disabled = true;

    if (!city) return;

    fetch(`http://localhost:3000/police/areas/${city}`)
        .then(res => res.json())
        .then(data => {
            data.forEach(a => {
                area.innerHTML += `<option value="${a.area}">${a.area}</option>`;
            });
            area.disabled = false;
        });
}

function searchPolice() {
    const district = document.getElementById('district').value;
    const city = document.getElementById('city').value;
    const area = document.getElementById('area').value;
    const results = document.getElementById('results');

    if (!district || !city || !area) {
        results.innerHTML = '<p>Please select all fields</p>';
        return;
    }

    fetch('http://localhost:3000/police/search', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ district, city, area })
    })
    .then(res => res.json())
    .then(data => {
        results.innerHTML = '';
        if (data.length === 0) {
            results.innerHTML = '<p>No police station found</p>';
            return;
        }

        data.forEach(p => {
            results.innerHTML += `
                <div class="card">
                    <h3>${p.station_name}</h3>
                    <p>👮 OC: ${p.incharge_name}</p>
                    <p>📞 ${p.contact}</p>
                    <p>📍 ${p.address}</p>
                </div>
            `;
        });
    });
}
