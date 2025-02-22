const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Lägg till CORS-paketet
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Aktivera CORS för alla förfrågningar

// Fil för highscore
const highscoreFile = path.join(__dirname, 'highscores.json');

// Startlista om filen inte finns
if (!fs.existsSync(highscoreFile)) {
    const initialScores = [
        { name: "Anna", time: 600.00, date: "2025-02-22" },
        { name: "Bosse", time: 650.00, date: "2025-02-21" },
        { name: "Karin", time: 700.00, date: "2025-02-20" },
        { name: "Lars", time: 750.00, date: "2025-02-19" },
        { name: "Maja", time: 800.00, date: "2025-02-18" },
        { name: "Nisse", time: 850.00, date: "2025-02-17" },
        { name: "Olle", time: 900.00, date: "2025-02-16" },
        { name: "Pelle", time: 950.00, date: "2025-02-15" },
        { name: "Stina", time: 1000.00, date: "2025-02-14" },
        { name: "Tina", time: 1050.00, date: "2025-02-13" }
    ];
    fs.writeFileSync(highscoreFile, JSON.stringify(initialScores, null, 2));
}

app.get('/highscores', (req, res) => {
    const highscores = JSON.parse(fs.readFileSync(highscoreFile));
    res.json(highscores);
});

app.post('/highscores', (req, res) => {
    const { name, time, date } = req.body;
    let highscores = JSON.parse(fs.readFileSync(highscoreFile));
    highscores.push({ name, time: parseFloat(time), date });
    highscores.sort((a, b) => a.time - b.time);
    highscores = highscores.slice(0, 10);
    fs.writeFileSync(highscoreFile, JSON.stringify(highscores, null, 2));
    res.json(highscores);
});

app.listen(port, () => {
    console.log(`Server kör på http://localhost:${port}`);
});