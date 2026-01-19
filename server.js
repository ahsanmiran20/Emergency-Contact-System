const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const path = require("path");
app.use(express.static(path.join(__dirname)));



// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'emergency_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL');
});

/* ================= BLOODBANK ================= */
app.get('/bloodbank/:area', (req, res) => {
    const area = req.params.area;
    const query = `SELECT id, area, name, contact, adress FROM bloodbank WHERE area = ?`;
    db.query(query, [area], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ bloodbanks: results });
    });
});

/* ================= DONORS ================= */
app.get('/donors/:area', (req, res) => {
    const area = req.params.area;
    const query = `SELECT name, blood_group, contact, email, ababilty FROM personinfromation WHERE area = ?`;
    db.query(query, [area], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ donors: results });
    });
});

/* ================= ADD DONOR ================= */
app.post('/add-donor', (req, res) => {
    const { name, contact, blood_group, ababilty, area, email } = req.body;
    if (!name || !contact || !blood_group || !ababilty || !area || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const query = `INSERT INTO personinfromation (name, contact, blood_group, ababilty, area, email) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [name, contact, blood_group, ababilty, area, email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database insert failed' });
        res.json({ message: 'Donor added successfully' });
    });
});

/* ================= AMBULANCE ================= */


app.get('/ambulances/:area', (req, res) => {
    const area = req.params.area;
    const query = `SELECT ambulance_name, contact, driver_name, hospital_linked, ambulance_type, ababilty, area, numberplate FROM ambulance WHERE area = ?`;
    db.query(query, [area], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ ambulances: results });
    });
});

app.post('/add-ambulance', (req, res) => {
    const { ambulance_name, contact, driver_name, hospital_linked, ambulance_type, ababilty, area, numberplate } = req.body;
    if (!ambulance_name || !contact || !driver_name || !hospital_linked || !ambulance_type || !ababilty || !area || !numberplate) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const query = `INSERT INTO ambulance (ambulance_name, contact, driver_name, hospital_linked, ambulance_type, ababilty, area, numberplate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [ambulance_name, contact, driver_name, hospital_linked, ambulance_type, ababilty, area, numberplate], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database insert failed' });
        res.json({ message: 'Ambulance added successfully' });
    });
});


/* ================= SHELTER ================= */
app.get('/shelters/:area', (req, res) => {
    const area = req.params.area;
    const query = `SELECT shelter_name, location, area FROM shelter WHERE area = ?`;
    db.query(query, [area], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ shelters: results });
    });
});

/* ================= HOSPITAL ================= */
app.get('/hospitals/:area', (req, res) => {
    const area = req.params.area;
    db.query('SELECT * FROM hospital WHERE area = ?', [area], (err, results) => {
        if (err) return res.status(500).json({ message: 'DB error' });
        res.json(results);
    });
});

/* ===== DOCTORS BY HOSPITAL ===== */
app.get('/doctors/:hospital', (req, res) => {
    const hospital = req.params.hospital;

    db.query(
        `SELECT doctor_name, speciality, visiting_time, availability
         FROM doctor
         WHERE hospital_name = ?`,
        [hospital],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'DB error' });
            res.json(results);
        }
    );
});


/* ================= POLICE ================= */
// Get cities by district
app.get('/police/cities/:district', (req, res) => {
    const sql = "SELECT DISTINCT city FROM police_station WHERE district = ?";
    db.query(sql, [req.params.district], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Get areas by city
app.get('/police/areas/:city', (req, res) => {
    const sql = "SELECT DISTINCT area FROM police_station WHERE city = ?";
    db.query(sql, [req.params.city], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Get police station info
app.post('/police/search', (req, res) => {
    const { district, city, area } = req.body;

    const sql = `
        SELECT station_name, contact, address, incharge_name
        FROM police_station
        WHERE district=? AND city=? AND area=?
    `;

    db.query(sql, [district, city, area], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});


/* ================= FIRE ================= */
/* ===== FIRE SERVICE ===== */

app.get('/fire/areas/:district', (req, res) => {
    const district = req.params.district;

    const query = `
        SELECT DISTINCT area 
        FROM fire_service 
        WHERE district = ?
    `;

    db.query(query, [district], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
});

/* Search fire station */
app.post('/fire/search', (req, res) => {
    const { district, area } = req.body;

    if (!district || !area) {
        return res.status(400).json({ message: 'District and Area required' });
    }

    const query = `
        SELECT station_name, officer_incharge, contact, address
        FROM fire_service
        WHERE district = ? AND area = ?
    `;

    db.query(query, [district, area], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
});





/* ================= ADMIN LOGIN ================= */
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.json({ success: false, message: "All fields are required" });
    const sql = "SELECT * FROM admins WHERE username = ?";
    db.query(sql, [username], (err, result) => {
        if (err) return res.json({ success: false, message: "Server error" });
        if (result.length === 0) return res.json({ success: false, message: "Invalid username or password" });
        const admin = result[0];
        if (admin.password === password) {
            res.json({ success: true, message: "Login successful", adminId: admin.id });
        } else {
            res.json({ success: false, message: "Invalid username or password" });
        }
    });
});


/* ================= DASHBOARD STATS ================= */
app.get("/admin/dashboard/stats", (req, res) => {

    const queries = {
        ambulance: "SELECT COUNT(*) total FROM ambulance",
        bloodbank: "SELECT COUNT(*) total FROM bloodbank",
        doctor: "SELECT COUNT(*) total FROM doctor",
        fire_service: "SELECT COUNT(*) total FROM fire_service",
        hospital: "SELECT COUNT(*) total FROM hospital",
        police_station: "SELECT COUNT(*) total FROM police_station",
        shelter: "SELECT COUNT(*) total FROM shelter"
    };

    let results = {};
    let completed = 0;
    const totalQueries = Object.keys(queries).length;

    for (let key in queries) {
        db.query(queries[key], (err, data) => {
            if (err) return res.status(500).json(err);
            results[key] = data[0].total;
            completed++;

            if (completed === totalQueries) {
                res.json(results);
            }
        });
    }
});

app.get("/admin/dashboard/recent", (req, res) => {

    const sql = `
        SELECT 'Hospital' AS type,
               hospital_name AS name,
               area,
               NOW() AS updated_at
        FROM hospital

        UNION ALL

        SELECT 'Ambulance',
               ambulance_name,
               area,
               NOW()
        FROM ambulance

        UNION ALL

        SELECT 'Shelter',
               shelter_name,
               area,
               NOW()
        FROM shelter

        LIMIT 5
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            console.error("Dashboard recent error:", err.sqlMessage);
            return res.status(500).json({ message: "Dashboard error" });
        }
        res.json(rows);
    });
});




app.get("/admin/ambulance", (req, res) => {
    db.query("SELECT * FROM ambulance", (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.get("/admin/ambulance/:name", (req, res) => {
    db.query(
        "SELECT * FROM ambulance WHERE ambulance_name=?",
        [req.params.name],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows[0]);
        }
    );
});
app.post("/admin/ambulance", (req, res) => {
    const a = req.body;

    db.query(
        `INSERT INTO ambulance 
        (ambulance_name, contact, driver_name, hospital_linked, ambulance_type, ababilty, area, numberplate)
        VALUES (?,?,?,?,?,?,?,?)`,
        [
            a.ambulance_name,
            a.contact,
            a.driver_name,
            a.hospital_linked,
            a.ambulance_type,
            a.ababilty,
            a.area,
            a.numberplate
        ],
        err => {
            if (err) return res.status(500).json({ message: "Ambulance already exists" });
            res.json({ message: "Ambulance inserted successfully" });
        }
    );
});
app.put("/admin/ambulance/:name", (req, res) => {
    const a = req.body;

    db.query(
        `UPDATE ambulance SET
        contact=?, driver_name=?, hospital_linked=?, ambulance_type=?, ababilty=?, area=?, numberplate=?
        WHERE ambulance_name=?`,
        [
            a.contact,
            a.driver_name,
            a.hospital_linked,
            a.ambulance_type,
            a.ababilty,
            a.area,
            a.numberplate,
            req.params.name
        ],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Ambulance updated successfully" });
        }
    );
});

app.delete("/admin/ambulance/:name", (req, res) => {
    db.query(
        "DELETE FROM ambulance WHERE ambulance_name=?",
        [req.params.name],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Ambulance deleted successfully" });
        }
    );
});


/* admin for hospital */
app.get("/admin/hospital", (req, res) => {
    db.query("SELECT * FROM hospital", (e, r) => res.json(r));
});

app.get("/admin/hospital/:name", (req, res) => {
    db.query("SELECT * FROM hospital WHERE hospital_name=?", [req.params.name], (e, r) => res.json(r[0]));
});

app.post("/admin/hospital", (req, res) => {
    const h = req.body;
    db.query(
        "INSERT INTO hospital VALUES (?,?,?,?)",
        [h.hospital_name, h.area, h.contact, h.address],
        () => res.json({ message: "Hospital inserted successfully" })
    );
});

app.delete("/admin/hospital/:name", (req, res) => {
    db.query("DELETE FROM hospital WHERE hospital_name=?", [req.params.name],
        () => res.json({ message: "Hospital deleted successfully" }));
});

app.put("/admin/hospital/:name", (req, res) => {
    const h = req.body;
    db.query(
        "UPDATE hospital SET area=?,contact=?,address=? WHERE hospital_name=?",
        [h.area, h.contact, h.address, req.params.name],
        () => res.json({ message: "Hospital updated successfully" })
    );
});



/*==================Doctor Admin==================*/
// GET ALL
app.get("/admin/doctor", (req, res) => {
    db.query("SELECT * FROM doctor", (err, rows) => {
        res.json(rows);
    });
});

// GET ONE (BY hospital_name PK)
app.get("/admin/doctor/:hospital", (req, res) => {
    db.query(
        "SELECT * FROM doctor WHERE TRIM(LOWER(hospital_name)) = TRIM(LOWER(?))",
        [req.params.hospital],
        (err, rows) => res.json(rows[0])
    );
});

// INSERT
app.post("/admin/doctor", (req, res) => {
    const d = req.body;
    db.query(
        "INSERT INTO doctor VALUES (?,?,?,?,?)",
        [d.doctor_name, d.speciality, d.visiting_time, d.availability, d.hospital_name],
        () => res.json({ message: "Doctor saved successfully" })
    );
});

// DELETE (BY hospital_name PK)
app.delete("/admin/doctor/:hospital", (req, res) => {
    db.query(
        "DELETE FROM doctor WHERE TRIM(LOWER(hospital_name)) = TRIM(LOWER(?))",
        [req.params.hospital],
        () => res.json({ message: "Doctor deleted successfully" })
    );
});
// UPDATE (BY hospital_name PK)
app.put("/admin/doctor/:hospital", (req, res) => {
    const d = req.body;

    db.query(
        `UPDATE doctor SET
            doctor_name=?,
            speciality=?,
            visiting_time=?,
            availability=?,
            hospital_name=?
         WHERE TRIM(LOWER(hospital_name)) = TRIM(LOWER(?))`,
        [
            d.doctor_name,
            d.speciality,
            d.visiting_time,
            d.availability,
            d.hospital_name,
            req.params.hospital
        ],
        (err, result) => {
            if (err) {
                console.error("UPDATE ERROR:", err);
                return res.status(500).json({ error: err.sqlMessage });
            }
            res.json({ message: "Doctor updated successfully" });
        }
    );
});

/*================= Shelter Admin =================*/
app.get("/admin/shelter", (req, res) => {
    db.query("SELECT * FROM shelter", (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.get("/admin/shelter/:name", (req, res) => {
    db.query(
        "SELECT * FROM shelter WHERE shelter_name=?",
        [req.params.name],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows[0]);
        }
    );
});
app.post("/admin/shelter", (req, res) => {
    const s = req.body;

    db.query(
        "INSERT INTO shelter (shelter_name, Location, area) VALUES (?,?,?)",
        [s.shelter_name, s.Location, s.area],
        (err) => {
            if (err) {
                console.error("INSERT ERROR:", err);
                return res.status(500).json({ error: err.sqlMessage });
            }
            res.json({ message: "Shelter saved successfully" });
        }
    );
});
app.put("/admin/shelter/:name", (req, res) => {
    const s = req.body;

    db.query(
        `UPDATE shelter SET
            shelter_name=?,
            Location=?,
            area=?
         WHERE shelter_name=?`,
        [s.shelter_name, s.Location, s.area, req.params.name],
        (err, result) => {
            if (err) {
                console.error("UPDATE ERROR:", err);
                return res.status(500).json({ error: err.sqlMessage });
            }
            res.json({ message: "Shelter updated successfully" });
        }
    );
});
app.delete("/admin/shelter/:name", (req, res) => {
    db.query(
        "DELETE FROM shelter WHERE shelter_name=?",
        [req.params.name],
        (err) => {
            if (err) {
                console.error("DELETE ERROR:", err);
                return res.status(500).json({ error: err.sqlMessage });
            }
            res.json({ message: "Shelter deleted successfully" });
        }
    );
});


/*================= POLICE Admin =================*/
// GET ALL
app.get("/admin/police", (req, res) => {
    db.query("SELECT * FROM police_station", (err, rows) => {
        res.json(rows);
    });
});

// GET ONE (PK = contact)
app.get("/admin/police/:contact", (req, res) => {
    db.query(
        "SELECT * FROM police_station WHERE contact = ?",
        [req.params.contact],
        (err, rows) => res.json(rows[0])
    );
});

// INSERT
app.post("/admin/police", (req, res) => {
    const p = req.body;
    db.query(
        "INSERT INTO police_station VALUES (?,?,?,?,?,?,?)",
        [
            p.station_name,
            p.district,
            p.city,
            p.area,
            p.contact,
            p.address,
            p.incharge_name
        ],
        () => res.json({ message: "Police station added successfully" })
    );
});

// UPDATE (PK = contact)
app.put("/admin/police/:contact", (req, res) => {
    const oldContact = req.params.contact;
    const p = req.body;

    db.query(
        `UPDATE police_station SET
            station_name=?,
            district=?,
            city=?,
            area=?,
            contact=?,
            address=?,
            incharge_name=?
         WHERE contact=?`,
        [
            p.station_name,
            p.district,
            p.city,
            p.area,
            p.contact,
            p.address,
            p.incharge_name,
            oldContact
        ],
        () => res.json({ message: "Police station updated successfully" })
    );
});

// DELETE
app.delete("/admin/police/:contact", (req, res) => {
    db.query(
        "DELETE FROM police_station WHERE contact = ?",
        [req.params.contact],
        () => res.json({ message: "Police station deleted successfully" })
    );
});


/*================= FIRE Admin =================*/
// GET ALL
app.get("/admin/fire", (req, res) => {
    db.query("SELECT * FROM fire_service", (err, rows) => {
        res.json(rows);
    });
});

// GET ONE (PK = station_name)
app.get("/admin/fire/:station", (req, res) => {
    db.query(
        "SELECT * FROM fire_service WHERE station_name = ?",
        [req.params.station],
        (err, rows) => res.json(rows[0])
    );
});

// INSERT
app.post("/admin/fire", (req, res) => {
    const f = req.body;
    db.query(
        "INSERT INTO fire_service VALUES (?,?,?,?,?,?,?)",
        [
            f.station_name,
            f.district,
            f.city,
            f.area,
            f.contact,
            f.address,
            f.incharge_name
        ],
        () => res.json({ message: "Fire service added successfully" })
    );
});

// UPDATE
app.put("/admin/fire/:station", (req, res) => {
    const oldStation = req.params.station;
    const f = req.body;

    db.query(
        `UPDATE fire_service SET
            station_name=?,
            district=?,
            city=?,
            area=?,
            contact=?,
            address=?,
            incharge_name=?
         WHERE station_name=?`,
        [
            f.station_name,
            f.district,
            f.city,
            f.area,
            f.contact,
            f.address,
            f.incharge_name,
            oldStation
        ],
        () => res.json({ message: "Fire service updated successfully" })
    );
});

// DELETE
app.delete("/admin/fire/:station", (req, res) => {
    db.query(
        "DELETE FROM fire_service WHERE station_name = ?",
        [req.params.station],
        () => res.json({ message: "Fire service deleted successfully" })
    );
});


// ===== BLOODBANK Admin=====

// GET ALL
app.get("/admin/bloodbank", (req, res) => {
    db.query("SELECT * FROM bloodbank", (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// GET ONE
app.get("/admin/bloodbank/:id", (req, res) => {
    db.query(
        "SELECT * FROM bloodbank WHERE id = ?",
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows[0]);
        }
    );
});

// INSERT
app.post("/admin/bloodbank", (req, res) => {
    const b = req.body;
    db.query(
        "INSERT INTO bloodbank (area, name, contact, adress) VALUES (?,?,?,?)",
        [b.area, b.name, b.contact, b.adress],
        () => res.json({ message: "Blood bank added successfully" })
    );
});

// UPDATE
app.put("/admin/bloodbank/:id", (req, res) => {
    const b = req.body;
    db.query(
        `UPDATE bloodbank SET
            area=?,
            name=?,
            contact=?,
            adress=?
         WHERE id=?`,
        [b.area, b.name, b.contact, b.adress, req.params.id],
        () => res.json({ message: "Blood bank updated successfully" })
    );
});

// DELETE
app.delete("/admin/bloodbank/:id", (req, res) => {
    db.query(
        "DELETE FROM bloodbank WHERE id=?",
        [req.params.id],
        () => res.json({ message: "Blood bank deleted successfully" })
    );
});


// ===== PERSON INFORMATION (DONORS) Admin=====

// GET ALL
app.get("/admin/personinformation", (req, res) => {
    db.query("SELECT * FROM personinformation ORDER BY id DESC", (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// GET ONE
app.get("/admin/personinformation/:id", (req, res) => {
    db.query(
        "SELECT * FROM personinformation ORDER BY id DESC",
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows[0]);
        }
    );
});

// INSERT
app.post("/admin/personinformation", (req, res) => {
    const d = req.body;
    db.query(
        `INSERT INTO personinformation
        (name, blood_group, contact, email,ababilty, area)
        VALUES (?,?,?,?,?,?)`,
        [d.name, d.blood_group, d.contact, d.email, d.ababilty, d.area],
        () => res.json({ message: "Donor added successfully" })
    );
});

// UPDATE
app.put("/admin/personinformation/:id", (req, res) => {
    const d = req.body;
    db.query(
        `UPDATE personinformation SET
            name=?,
            blood_group=?,
            contact=?,
            email=?,
            ababilty=?,
            area=?
         WHERE id=?`,
        [d.name, d.blood_group, d.contact, d.email, d.  ababilty, d.area, req.params.id],
        () => res.json({ message: "Donor updated successfully" })
    );
});

// DELETE
app.delete("/admin/personinformation/:id", (req, res) => {
    db.query(
        "DELETE FROM personinformation WHERE id=?",
        [req.params.id],
        () => res.json({ message: "Donor deleted successfully" })
    );
});





/* ================= SERVER ================= */
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
