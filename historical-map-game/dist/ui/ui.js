// Screen States
export const startScreen = document.getElementById("start-screen");
export const gameScreen = document.getElementById("game-screen");
// Buttons for game play
export const startButton = document.getElementById("start-button");
export const submitGuessButton = document.getElementById("submit-guess-game");
export const playAgainButton = document.getElementById("play-again-button");
export function showStartScreen() {
    hideAllScreens();
    startScreen.style.display = "flex";
}
export function showGameScreen() {
    hideAllScreens();
    gameScreen.style.display = "flex";
}
// Function to show End Game Screen with play again button and final score
export function showEndGameScreen(finalScore) {
    console.log("showEndGameScreen called with score:", finalScore);
    hideAllScreens();
    const finalScoreElement = document.getElementById('final-score');
    if (finalScoreElement) {
        finalScoreElement.textContent = finalScore.toString();
        console.log("Final score element updated");
    }
    else {
        console.error("Final score element not found!");
    }
    const endGameScreen = document.getElementById('end-game-screen');
    if (endGameScreen) {
        endGameScreen.style.display = 'flex';
        console.log("End game screen displayed");
    }
    else {
        console.error("End game screen element not found!");
    }
}
// Make sure hideAllScreens includes the end game screen and result screen
function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });
    //also hide result screen
    const resultScreen = document.getElementById('result-screen');
    if (resultScreen) {
        resultScreen.classList.add('hidden');
    }
}
