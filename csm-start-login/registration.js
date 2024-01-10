

const express = require('express');
const router = express.Router();

// GET-Anfrage für die Registrierungsseite
router.get('/register', (req, res) => {
  res.render('register'); // Hier renderst du die HTML-Seite für die Registrierung
});

// POST-Anfrage für die Registrierungsdaten
router.post('/register', (req, res) => {
  // Hier verarbeitest du die Registrierungsdaten (z. B. speichern in der Datenbank)
  res.send('Registrierung erfolgreich!');
});

module.exports = router;
