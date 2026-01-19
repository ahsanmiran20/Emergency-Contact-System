document.getElementById("donorForm").addEventListener("submit", function (e) {
    e.preventDefault(); // ❗ VERY IMPORTANT

    const donorData = {
        name: document.querySelector('input[placeholder="Enter full name"]').value,
        contact: document.querySelector('input[placeholder="01XXXXXXXXX"]').value,
        blood_group: document.querySelectorAll("select")[0].value,
        ababilty: document.querySelectorAll("select")[1].value,
        area: document.querySelector('input[placeholder="Your area / city"]').value,
        email: document.querySelector('input[placeholder="example@email.com"]').value
    };

    fetch("http://localhost:3000/add-donor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(donorData)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        document.getElementById("donorForm").reset();
    })
    .catch(err => {
        console.error(err);
        alert("Failed to submit data");
    });
});