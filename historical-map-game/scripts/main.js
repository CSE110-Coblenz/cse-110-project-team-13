document.addEventListener('DOMContentLoaded', function () {
    // Elements
    var gameScreen = document.getElementById('game-screen');
    var startScreen = document.getElementById('start-screen');
    var startButton = document.getElementById('start-button');
    var backButton = document.getElementById('back-button');
    var mapPlaceholder = document.getElementById('map-placeholder');
    // Null check at the beginning
    if (!startScreen || !gameScreen || !startButton || !backButton || !mapPlaceholder) {
        console.error('Required DOM elements not found');
        return; // Exit early if anything is missing
    }
    startButton.addEventListener("click", function () {
        console.log('Start clicked 🎮');
        startScreen.style.display = "none";
        gameScreen.style.display = "block";
        initMap();
    });
    backButton.addEventListener("click", function () {
        gameScreen.style.display = "none";
        startScreen.style.display = "flex";
    });
    function initMap() {
        var map = L.map("map-placeholder").setView([20, 0], 2);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);
    }
});
