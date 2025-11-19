import { initMap } from "./map.js";
import { showStartScreen, showGameScreen, showEndGameScreen, startButton, submitGuessButton, playAgainButton } from "./ui/ui.js";
import './howto.js'
import { startTimer, stopTimer, resetTimer, handleGuess } from "./game.js";
import { initializeDragging, loadHistoricalImage } from "./image.js";
import { initializeMenu } from "./menu.js";


window.addEventListener("DOMContentLoaded", () => {
    console.log('Main: DOMContentLoaded fired');

    // Hide end game screen
    const endGameScreen = document.getElementById('end-game-screen');
    if (endGameScreen) {
        endGameScreen.style.display = 'none';
    }

    initializeMenu();

    initializeDragging();
    
    loadHistoricalImage(
    "./assets/images/events/pyramids.jpg",
    "These structures were built as tombs for pharaohs."
    );
    
    showStartScreen();


    // Start game button handler
    startButton.addEventListener("click", () => {
        showGameScreen();
        initMap("map-placeholder"); // only map.ts knows how to do this
        startTimer(() => {
            // alert("Time's up!");
            resetTimer();
            showEndGameScreen(0); //temp score for now, use currrent score later
        });
    });

    // Play again button handler
    playAgainButton?.addEventListener('click', () => {
        // Reset game and go to 
        resetTimer();
        showGameScreen();
    });

    // Back to start button handler
    const backToStartButton = document.getElementById('back-to-start-button');
    backToStartButton?.addEventListener('click', () => {
        // Reset game and go to start screen
        resetTimer();
        showStartScreen(); // Go back to main menu
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
    } else {
        console.error("Submit guess button not found!");
    }
});
