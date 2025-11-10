import { initMap } from "./map.js";
import { showStartScreen, showGameScreen, startButton, backButton } from "./ui.js";
import './howto.js'
import { startTimer, stopTimer, resetTimer } from "./game.js";
import { initializeDragging, loadHistoricalImage } from "./image.js";


window.addEventListener("DOMContentLoaded", () => {
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

    backButton.addEventListener("click", () => {
        showStartScreen();
        stopTimer();
        resetTimer();
    });


});
