#!/bin/bash

# Create the project structure
mkdir -p historical-map-game/{scripts,assets/images/events,tests}

# Create all files
cd historical-map-game
touch index.html styles.css
touch scripts/main.js scripts/game.js scripts.map.js scripts/ui.js scripts/data.js scripts/utils.js
touch assets/events.json

# Add basic content to key files
echo "<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>Historical Map Game</title>
    <link rel=\"stylesheet\" href=\"styles.css\">
</head>
<body>
    <div id=\"app\">
        <div id=\"menu-screen\" class=\"screen active\"></div>
        <div id=\"game-screen\" class=\"screen\"></div>
        <div id=\"results-screen\" class=\"screen\"></div>
    </div>
    <script type=\"module\" src=\"scripts/main.js\"></script>
</body>
</html>" > index.html

echo "// Game constants and configuration
export const GAME_CONFIG = {
    TOTAL_QUESTIONS: 10,
    SCORING: {
        PERFECT_GUESS: 100,
        DISTANCE_THRESHOLD: 500
    }
};" > scripts/utils.js

echo "Project structure created successfully!"