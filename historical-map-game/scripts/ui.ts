export const startScreen = document.getElementById("start-screen")!;
export const gameScreen = document.getElementById("game-screen")!;
export const startButton = document.getElementById("start-button")!;
export const submitGuessButton = document.getElementById("submit-guess-game")!;

export function showStartScreen() {
    startScreen.style.display = "flex";
    gameScreen.style.display = "none";
}

export function showGameScreen() {
    startScreen.style.display = "none";
    gameScreen.style.display = "flex";
}