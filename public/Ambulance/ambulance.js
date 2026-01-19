const params = new URLSearchParams(window.location.search);
const area = params.get('area');

const ambulanceDiv = document.getElementById('ambulances');

if (!area) {
    ambulanceDiv.innerHTML = '<p>No area selected</p>';
} else {

    fetch(`http://localhost:3000/ambulances/${encodeURIComponent(area)}`)
        .then(res => res.json())
        .then(data => {

            ambulanceDiv.innerHTML = `<h2>🚑 Ambulances in ${area}</h2>`;

            if (!data.ambulances || data.ambulances.length === 0) {
                ambulanceDiv.innerHTML += '<p>No ambulances found</p>';
            } else {

                data.ambulances.forEach(amb => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    const availabilityClass =
                        amb.ababilty.toLowerCase() === 'available'
                            ? 'available'
                            : 'busy';

                    card.innerHTML = `
                        <h3>${amb.ambulance_name}</h3>
                        <p>🚗 Number Plate: ${amb.numberplate}</p>
                        <p>📞 Contact: ${amb.contact}</p>
                        <p>
                            Availability:
                            <span class="${availabilityClass}">
                                ${amb.ababilty}
                            </span>
                        </p>

                        <button class="details-btn">Details</button>

                        <div class="details">
                            <p>🏥 Hospital Linked: ${amb.hospital_linked}</p>
                            <p>🚑 Ambulance Type: ${amb.ambulance_type}</p>
                            <p>👨‍✈️ Driver Name: ${amb.driver_name}</p>
                        </div>
                    `;
                        const detailsBtn = card.querySelector('.details-btn');

    detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('active');
    });



                    ambulanceDiv.appendChild(card);
                });
            }
        })
        .catch(err => {
            console.error(err);
            ambulanceDiv.innerHTML = '<p>Error loading ambulances</p>';
        });
}

/* Three dot menu toggle */
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}
