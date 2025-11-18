import { initMap } from "./map.js";
import { showStartScreen, showGameScreen, startButton, submitGuessButton } from "./ui.js";
import './howto.js'
import { startTimer, stopTimer, resetTimer, handleGuess } from "./game.js";
import { initializeDragging, loadHistoricalImage } from "./image.js";
import { initializeMenu } from "./menu.js";


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
            alert("Time's up!");
            resetTimer();
        });
    });


    
    if (submitGuessButton) {
        submitGuessButton.addEventListener("click", (e) => {
            handleGuess();
            return false;
        });
        
        // Prevent map from capturing clicks on the button
        submitGuessButton.addEventListener("mousedown", (e) => {
            e.stopPropagation();
        });
        
        submitGuessButton.addEventListener("mouseup", (e) => {
            e.stopPropagation();
        });
    } else {
        console.error("Submit guess button not found!");
    }
});
