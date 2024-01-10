// Annahme: Du möchtest eine Registrierungsroute für den POST-Request /register hinzufügen

app.post('/register', async (req, res) => {
    try {
        // Die Daten aus dem Formular im req.body erhalten
        const { email, username, password } = req.body;

        // Hier könntest du Validierungen für die Daten durchführen
        // Zum Beispiel: Überprüfen, ob die E-Mail gültig ist, das Passwort bestimmte Anforderungen erfüllt usw.

        // Dann könntest du die Daten in der Datenbank speichern
        // Ein Beispiel, wie du es mit deinem MySQL-Modul machen könntest:
        const insertUserQuery = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
        cnx.query(insertUserQuery, [email, username, password], (error, result) => {
            if (!error) {
                res.status(201).json({ message: 'User registered successfully!' });
            } else {
                console.error("Error inserting user into database", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    } catch (error) {
        console.error("Error registering user", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
