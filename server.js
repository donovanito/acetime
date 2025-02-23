// Ange URL till din PHP-fil på One.com
const API_URL = "https://dindomän.com/tennisspel/highscores.php";  

// Funktion för att hämta highscore-listan
function getHighScores() {
    fetch(API_URL)
        .then(response => response.json())
        .then(highscores => {
            let scoresHtml = "";
            highscores.forEach(score => {
                scoresHtml += `<li>${score.name}: ${score.time} sek (${score.date})</li>`;
            });
            document.getElementById("leaderboard").innerHTML = scoresHtml;
        })
        .catch(error => console.error("Fel vid hämtning av highscore:", error));
}

// Funktion för att skicka en ny highscore
function saveScore(name, time) {
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            time: parseFloat(time),
            date: new Date().toISOString().split('T')[0]  // Format YYYY-MM-DD
        })
    })
    .then(response => response.json())
    .then(updatedScores => {
        console.log("Highscore sparat:", updatedScores);
        getHighScores();  // Uppdatera listan direkt
    })
    .catch(error => console.error("Fel vid sparande av highscore:", error));
}

// Ladda highscore-listan när sidan öppnas
document.addEventListener("DOMContentLoaded", getHighScores);

// Koppla en knapp i spelet för att spara highscore
document.getElementById("submitScore").addEventListener("click", function() {
    let playerName = document.getElementById("playerName").value;
    let playerTime = document.getElementById("playerTime").value;

    if (playerName && playerTime) {
        saveScore(playerName, playerTime);
    } else {
        alert("Fyll i namn och tid!");
    }
});