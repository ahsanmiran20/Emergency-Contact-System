const params = new URLSearchParams(window.location.search);
const area = params.get('area');
const hospitalDiv = document.getElementById('hospitals');

if (!area) {
    hospitalDiv.innerHTML = '<p>No area selected</p>';
} else {

    fetch(`http://localhost:3000/hospitals/${encodeURIComponent(area)}`)
        .then(res => res.json())
        .then(data => {

            hospitalDiv.innerHTML = `<h2>Hospitals in ${area}</h2>`;

            if (data.length === 0) {
                hospitalDiv.innerHTML += '<p>No hospitals found</p>';
                return;
            }

            data.forEach(h => {
                const card = document.createElement('div');
                card.classList.add('card');

                card.innerHTML = `
                    <h3>${h.hospital_name}</h3>
                    <p>📞 Contact: ${h.contact}</p>
                    <p>📍 Address: ${h.address}</p>
                    <p>📌 Area: ${h.area}</p>

                    <button class="more-btn">Click for more details</button>

                    <div class="doctors"></div>
                `;

                const btn = card.querySelector('.more-btn');
                const doctorsDiv = card.querySelector('.doctors');

                btn.addEventListener('click', () => {

                    if (doctorsDiv.classList.contains('active')) {
                        doctorsDiv.classList.remove('active');
                        return;
                    }

                    fetch(`http://localhost:3000/doctors/${encodeURIComponent(h.hospital_name)}`)
                        .then(res => res.json())
                        .then(doctors => {

                            doctorsDiv.innerHTML = '';

                            if (doctors.length === 0) {
                                doctorsDiv.innerHTML = '<p>No doctors available</p>';
                            } else {
                                doctors.forEach(d => {

                                    const statusClass =
                                        d.availability.toLowerCase() === 'available'
                                            ? 'Available'
                                            : 'Not Available';

                                    doctorsDiv.innerHTML += `
                                        <div class="doctor-card">
                                            <p><strong>${d.doctor_name}</strong></p>
                                            <p>🩺 ${d.speciality}</p>
                                            <p>⏰ ${d.visiting_time}</p>
                                            <p>
                                                Status:
                                                <span class="${statusClass}">
                                                    ${d.availability}
                                                </span>
                                            </p>
                                        </div>
                                    `;
                                });
                            }

                            doctorsDiv.classList.add('active');
                        });
                });

                hospitalDiv.appendChild(card);
            });
        })
        .catch(() => {
            hospitalDiv.innerHTML = '<p>Error loading hospitals</p>';
        });
}
