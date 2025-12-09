import { nextRound } from "./game";
// Initialize Game State
let currentRound = 1;
const totalRounds = 10;
const nextBtn = document.getElementById("result-next");
export function initializeRoundCounter() {
    updateRoundDisplay();
}
// Updates the current-round and total-rounds elements (If we want to change the number of rounds we can easily do that by updating the const totalRounds)
export function updateRoundDisplay() {
    const currentRoundElement = document.getElementById('current-round');
    const totalRoundsElement = document.getElementById('total-rounds');
    if (currentRoundElement) {
        currentRoundElement.textContent = currentRound.toString();
    }
    if (totalRoundsElement) {
        totalRoundsElement.textContent = totalRounds.toString();
    }
    // INCREMENT THE ROUND
    currentRound++;
    updateRoundDisplay(); // Update the round counter display
    if (currentRound > totalRounds) {
        console.log("Final round completed - ending game");
    }
    else {
        console.log("Next round startin");
        nextRound();
    }
}
// Call when game is reset, always
export function resetRounds() {
    currentRound = 1;
    updateRoundDisplay();
}
