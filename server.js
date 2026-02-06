const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HS_FILE = path.join(__dirname, 'highscores.json');

app.use(express.json());
app.use(express.static(__dirname));

function loadScores() {
    try { return JSON.parse(fs.readFileSync(HS_FILE, 'utf8')); }
    catch { return []; }
}

function saveScores(scores) {
    fs.writeFileSync(HS_FILE, JSON.stringify(scores, null, 2));
}

app.get('/api/highscores', (req, res) => {
    res.json(loadScores().slice(0, 10));
});

app.post('/api/highscores', (req, res) => {
    const { name, score } = req.body;
    if (!name || typeof score !== 'number') return res.status(400).json({ error: 'name and score required' });
    const scores = loadScores();
    scores.push({ name: String(name).slice(0, 16), score: Math.floor(score), date: new Date().toISOString().split('T')[0] });
    scores.sort((a, b) => b.score - a.score);
    saveScores(scores.slice(0, 50));
    res.json(scores.slice(0, 10));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
