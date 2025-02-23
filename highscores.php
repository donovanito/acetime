<?php
$filename = 'highscores.json';

// Funktion för att hämta användarens IP-adress
function getUserIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        return $_SERVER['REMOTE_ADDR'];
    }
}

// Hantera GET-förfrågan för att hämta highscores
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($filename)) {
        $highscores = json_decode(file_get_contents($filename), true);
        usort($highscores, function($a, $b) {
            return $a['time'] - $b['time'];
        });
        echo json_encode($highscores);
    } else {
        echo json_encode([]);
    }
}

// Hantera POST-förfrågan för att lägga till en ny highscore
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data['name'];
    $time = $data['time'];
    $date = $data['date'];
    $win = $data['win'];

    if (file_exists($filename)) {
        $highscores = json_decode(file_get_contents($filename), true);
    } else {
        $highscores = [];
    }

    // Lägg till den nya highscoren
    $highscores[] = ['name' => $name, 'time' => $time, 'date' => $date, 'win' => $win];

    // Sortera highscores efter tid
    usort($highscores, function($a, $b) {
        return $a['time'] - $b['time'];
    });

    // Uppdatera namn till IP-adress om det inte är en topp-10-tid
    $ip = getUserIP();
    foreach ($highscores as $index => &$score) {
        if ($index >= 10) {
            $score['name'] = $ip;
        }
    }

    // Spara highscores till filen
    file_put_contents($filename, json_encode($highscores));
    echo "New record created successfully";
}
?>