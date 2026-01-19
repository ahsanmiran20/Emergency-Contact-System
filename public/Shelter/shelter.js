const params = new URLSearchParams(window.location.search);
const area = params.get('area');

const shelterDiv = document.getElementById('shelters');

if (!area) {
    shelterDiv.innerHTML = '<p>No area selected</p>';
} else {

    fetch(`http://localhost:3000/shelters/${encodeURIComponent(area)}`)
        .then(res => res.json())
        .then(data => {

            shelterDiv.innerHTML = `<h2>🏠 Shelters in ${area}</h2>`;

            if (!data.shelters || data.shelters.length === 0) {
                shelterDiv.innerHTML += '<p>No shelters found</p>';
            } else {
                data.shelters.forEach(shelter => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    card.innerHTML = `
                        <h3>${shelter.shelter_name}</h3>
                        <p>📍 Location: ${shelter.location}</p>
                        <p>🗺️ Area: ${shelter.area}</p>
                    `;

                    shelterDiv.appendChild(card);
                });
            }
        })
        .catch(err => {
            console.error(err);
            shelterDiv.innerHTML = '<p>Error loading shelters</p>';
        });
}
