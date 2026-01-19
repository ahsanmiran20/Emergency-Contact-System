const params = new URLSearchParams(window.location.search);
const area = params.get('area');

const bloodbankDiv = document.getElementById('bloodbanks');
const donorDiv = document.getElementById('donors');

if (!area) {
    bloodbankDiv.innerHTML = '<p>No area selected</p>';
    donorDiv.innerHTML = '';
} else {
    // Fetch blood banks
    fetch(`http://localhost:3000/bloodbank/${encodeURIComponent(area)}`)
        .then(res => res.json())
        .then(data => {
            bloodbankDiv.innerHTML = `<h2>🏥 Blood Banks in ${area}</h2>`;
            if (!data.bloodbanks || data.bloodbanks.length === 0) {
                bloodbankDiv.innerHTML += '<p>No blood banks found</p>';
            } else {
                data.bloodbanks.forEach(bank => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                        <h3>${bank.name}</h3>
                        <p>📞 ${bank.contact}</p>
                        <p>🏠 ${bank.adress}</p>
                    `;
                    bloodbankDiv.appendChild(card);
                });
            }
        })
        .catch(err => {
            console.error(err);
            bloodbankDiv.innerHTML = '<p>Error loading blood banks</p>';
        });

    // Fetch donors
    fetch(`http://localhost:3000/donors/${encodeURIComponent(area)}`)
        .then(res => res.json())
        .then(data => {
            donorDiv.innerHTML = `<h2>🧍 Blood Donors in ${area}</h2>`;
            if (!data.donors || data.donors.length === 0) {
                donorDiv.innerHTML += '<p>No donors available</p>';
            } else {
                data.donors.forEach(person => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    

                    card.innerHTML = `
                        <h3>${person.name}</h3>
                        <p>🩸 Blood Group: ${person.blood_group}</p>
                        <p>📞 ${person.contact}</p>
                        <p>📧 ${person.email}</p>
                        <p> Ability: ${person.ababilty}</p>
                        
                    `;
                    donorDiv.appendChild(card);
                });
            }
        })
        .catch(err => {
            console.error(err);
            donorDiv.innerHTML = '<p>Error loading donors</p>';
        });
}
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

