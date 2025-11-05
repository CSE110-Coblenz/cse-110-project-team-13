import { initMap } from "./map.js";
import { showStartScreen, showGameScreen, startButton, backButton } from "./ui.js";

    window.addEventListener("DOMContentLoaded", () => {
    showStartScreen();

    startButton.addEventListener("click", () => {
        showGameScreen();
        initMap("map-placeholder"); // only map.ts knows how to do this
    });

    backButton.addEventListener("click", () => {
        showStartScreen();
    });
});
