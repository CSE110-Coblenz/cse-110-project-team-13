import { initMap } from "./map.js";
import { showStartScreen, showGameScreen, showEndGameScreen, startButton, submitGuessButton, playAgainButton } from "./ui/ui.js";
import './howto.js'
import { startTimer, stopTimer, resetTimer, handleGuess, resetGame, nextRound } from "./game.js";
import { disableDoubleClickOnImage, initializeDragging, loadHistoricalImage } from "./image.js";
import { initializeMenu } from "./menu.js";
import { initializeRounds, totalRounds } from "./ui/results.js";
import { TimelineGame } from './timeline-game.js';


window.addEventListener("DOMContentLoaded", () => {
    console.log('Main: DOMContentLoaded fired');

    // Hide end game screen
    const endGameScreen = document.getElementById('end-game-screen');
    if (endGameScreen) {
        endGameScreen.style.display = 'none';
    }

    initializeMenu();

    // Initialize Timeline Game (Mini Game 2)
    let timelineGameInstance: TimelineGame | null = null;

    const minigame2Button = document.getElementById('menu-minigame2');
    const minigame2Modal = document.getElementById('minigame2-modal');
    const minigame2CloseBtn = minigame2Modal?.querySelector('.close-modal');

    // Open modal and initialize game
    minigame2Button?.addEventListener('click', () => {
        if (minigame2Modal) {
            minigame2Modal.classList.remove('modal-hidden');
            minigame2Modal.style.display = 'flex';
            // Initialize the timeline game when modal opens
            timelineGameInstance = new TimelineGame();
        }
    });

    // Close modal and destroy game
    minigame2CloseBtn?.addEventListener('click', () => {
        if (minigame2Modal) {
            minigame2Modal.style.display = 'none';
            minigame2Modal.classList.add('modal-hidden');
            // Clean up the game instance
            timelineGameInstance?.destroy();
            timelineGameInstance = null;
        }
    });


    initializeDragging();

    initializeRounds(); // Number of rounds can be updated in results.ts by updating totalRounds
    
    showStartScreen();

    disableDoubleClickOnImage(); // Added in feature/start-screen-mini-game-buttons to ensure users can't save image to discover name of the event as an extra hint

    
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

    //play again button (from end game screen)
    playAgainButton?.addEventListener('click', () => {
        console.log("Play again clicked from end game screen");
        resetGame();
        stopTimer();
        showStartScreen();
    });

    //back to start button (from game screen)
    const backToStartButton = document.getElementById('back-to-start-button');
    backToStartButton?.addEventListener('click', () => {
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
    } else {
        console.error("Submit guess button not found!");
    }
});
