import { initMap } from "./map.js";
import { showStartScreen, showGameScreen, startButton, backButton, submitGuessButton } from "./ui.js";
import './howto.js'
import { startTimer, stopTimer, resetTimer, handleGuess } from "./game.js";


window.addEventListener("DOMContentLoaded", () => {
    showStartScreen();

    startButton.addEventListener("click", () => {
        showGameScreen();
        initMap("map-placeholder"); // only map.ts knows how to do this
        startTimer(() => {
            alert("Time's up!");
            resetTimer();
        });
    });

    backButton.addEventListener("click", () => {
        showStartScreen();
        stopTimer();
        resetTimer();
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
