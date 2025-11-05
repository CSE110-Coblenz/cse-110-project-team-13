export const startScreen = document.getElementById("start-screen")!;
export const gameScreen = document.getElementById("game-screen")!;
export const startButton = document.getElementById("start-button")!;
export const backButton = document.getElementById("back-button")!;

export function showStartScreen() {
    startScreen.style.display = "flex";
    gameScreen.style.display = "none";
}

export function showGameScreen() {
    startScreen.style.display = "none";
    gameScreen.style.display = "flex";
}