import { initMap } from "./map.js";
import { showStartScreen, showGameScreen, startButton, backButton } from "./ui.js";
import { startTimer, stopTimer, resetTimer } from "./game.js";

window.addEventListener("DOMContentLoaded", () => {
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
