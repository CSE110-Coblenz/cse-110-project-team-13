import { initMap } from "./map.js";
import { showStartScreen, showGameScreen, startButton, } from "./ui.js";
import './howto.js'
import { startTimer, stopTimer, resetTimer } from "./game.js";
import { initializeDragging, loadHistoricalImage } from "./image.js";
import { initializeMenu } from "./menu.js"; // ADD THIS LINE


window.addEventListener("DOMContentLoaded", () => {
    console.log('Main: DOMContentLoaded fired');

    initializeMenu();

    initializeDragging();
    
    loadHistoricalImage(
    "./assets/images/events/pyramids.jpg",
    "These structures were built as tombs for pharaohs."
    );
    
    showStartScreen();

    startButton.addEventListener("click", () => {
        showGameScreen();
        initMap("map-placeholder"); // only map.ts knows how to do this
        startTimer(() => {
            alert("Time’s up!");
            resetTimer();
        });
    });


});
