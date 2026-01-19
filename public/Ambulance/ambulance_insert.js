document.getElementById("ambform").addEventListener("submit", function(e){
    e.preventDefault(); // ❗ VERY IMPORTANT

    const ambdata = {
        ambulance_name:document.querySelector('input[placeholder = "Enter ambulance service name"]').value,
        contact: document.querySelector('input[placeholder="01XXXXXXXXX"]').value,
        driver_name:document.querySelector('input[placeholder = "Enter driver name"]').value,
        hospital_linked:document.querySelector('input[placeholder = "Enter hospital name"]').value,
        ambulance_type:document.querySelectorAll("select")[0].value,
        ababilty:document.querySelectorAll("select")[1].value,
        area:document.querySelector('input[placeholder = "Enter area name"]').value,
        numberplate:document.querySelector('input[placeholder = "XX-XXXX"]').value

    };

    fetch("http://localhost:3000/add-ambulance", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(ambdata)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        document.getElementById("ambform").reset();
    })
    .catch(err => {
        console.error(err);
        alert("Failed to submit data");
    });
});