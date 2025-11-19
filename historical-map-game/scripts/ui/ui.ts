// Screen States
export const startScreen = document.getElementById("start-screen")!;
export const gameScreen = document.getElementById("game-screen")!;

// Buttons for game play
export const startButton = document.getElementById("start-button")!;
export const submitGuessButton = document.getElementById("submit-guess-game")!;
export const playAgainButton = document.getElementById("play-again-button")!;


export function showStartScreen() {
    hideAllScreens();
    startScreen.style.display = "flex";
}

export function showGameScreen() {
    hideAllScreens();
    gameScreen.style.display = "flex";
}

// Function to show End Game Screen with play again button and final score
export function showEndGameScreen(finalScore: number): void {
    hideAllScreens();
    
    const finalScoreElement = document.getElementById('final-score');
    if (finalScoreElement) {
        finalScoreElement.textContent = finalScore.toString();
    }
    
    const endGameScreen = document.getElementById('end-game-screen');
    if (endGameScreen) {
        endGameScreen.style.display = 'flex';
    }
}

// Make sure hideAllScreens includes the end game screen
function hideAllScreens(): void {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        (screen as HTMLElement).style.display = 'none';
    });
}