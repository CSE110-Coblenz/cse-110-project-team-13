import { initMap } from "./map.js";
import { showStartScreen, showGameScreen, showEndGameScreen, startButton, submitGuessButton, playAgainButton } from "./ui/ui.js";
import './howto.js';
import { startTimer, stopTimer, resetTimer, handleGuess, resetGame } from "./game.js";
import { disableDoubleClickOnImage, initializeDragging } from "./image.js";
import { initializeMenu } from "./menu.js";
import { initializeRounds } from "./ui/results.js";
window.addEventListener("DOMContentLoaded", () => {
    console.log('Main: DOMContentLoaded fired');
    // Hide end game screen
    const endGameScreen = document.getElementById('end-game-screen');
    if (endGameScreen) {
        endGameScreen.style.display = 'none';
    }
    initializeMenu();
    initializeDragging();
    initializeRounds(); // Number of rounds can be updated in results.ts by updating totalRounds
    showStartScreen();
    disableDoubleClickOnImage(); // Added in feature/start-screen-mini-game-buttons to ensure users can't save image to discover name of the event as an extra hint
    // Start game button handler
    startButton.addEventListener("click", () => {
        showGameScreen();
        initMap("map-placeholder"); // only map.ts knows how to do this
        // Allow users to see and click Submit Guess Button again, included it here as whenever startbutton was clicked, for some reason it wouldn't appear without this code
        const submitGuessButton = document.getElementById("submit-guess-game");
        if (submitGuessButton) {
            submitGuessButton.style.display = "block";
        }
        startTimer(() => {
            // alert("Time's up!");
            resetTimer();
            showEndGameScreen(0); //temp score for now, use currrent score later
        });
    });
    //play again button (from end game screen)
    playAgainButton === null || playAgainButton === void 0 ? void 0 : playAgainButton.addEventListener('click', () => {
        console.log("Play again clicked from end game screen");
        resetGame();
        stopTimer();
        showStartScreen();
    });
    //back to start button (from game screen)
    const backToStartButton = document.getElementById('back-to-start-button');
    backToStartButton === null || backToStartButton === void 0 ? void 0 : backToStartButton.addEventListener('click', () => {
        console.log("Back to start clicked");
        resetGame();
        stopTimer();
        showStartScreen();
    });
    if (submitGuessButton) {
        submitGuessButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
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
    }
    else {
        console.error("Submit guess button not found!");
    }
});
