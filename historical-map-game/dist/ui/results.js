import { map, marker as guessMarker } from "../map.js";
import { nextRound } from "../game.js";
let actualMarker = null;
let currentRound = 1; // Added variable to keep count of rounds
export let totalRounds = 10; // Added variable to keep count of total rounds
const currentRoundElement = document.getElementById('current-round');
const totalRoundsElement = document.getElementById('total-rounds');
export function showResultScreen(guess, actual, distance, score) {
    var _a;
    console.log("showResultScreen called with:", { guess, actual, distance, score });
    // Disable Submit Guess Button. Ensures user can't spam guess button to get more points.
    const submitGuessButton = document.getElementById("submit-guess-game");
    if (submitGuessButton) {
        submitGuessButton.style.display = "none";
    }
    if (guessMarker) {
        guessMarker.setLatLng([guess.lat, guess.lng]);
    }
    if (!actualMarker) {
        actualMarker = L.marker([actual.lat, actual.lng], {
            title: "Actual Location",
            opacity: 0.9
        }).addTo(map);
    }
    else {
        actualMarker.setLatLng([actual.lat, actual.lng]);
    }
    const bounds = L.latLngBounds([guess.lat, guess.lng], [actual.lat, actual.lng]);
    map.fitBounds(bounds.pad(0.3));
    const resultScreen = document.getElementById("result-screen");
    const distanceEl = document.getElementById("result-distance");
    const scoreEl = document.getElementById("result-score");
    const feedbackEl = document.getElementById("result-feedback");
    console.log("Result elements:", { resultScreen, distanceEl, scoreEl, feedbackEl });
    if (!resultScreen || !distanceEl || !scoreEl || !feedbackEl) {
        console.error("Missing result screen elements!");
        return;
    }
    distanceEl.textContent = `Distance: ${distance.toFixed(1)} km`;
    scoreEl.textContent = `Score: ${Math.round(score)}`;
    let feedback = "";
    if (distance < 50)
        feedback = "Amazing! You were very close!";
    else if (distance < 200)
        feedback = "Great accuracy!";
    else if (distance < 500)
        feedback = "Not bad — you're in the right region.";
    else
        feedback = "Way off — study your history!";
    feedbackEl.textContent = feedback;
    resultScreen.classList.remove("hidden");
    const nextBtn = document.getElementById("result-next");
    if (nextBtn) {
        //remove old event listeners to prevent duplicates
        const newBtn = nextBtn.cloneNode(true);
        (_a = nextBtn.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(newBtn, nextBtn);
        newBtn.addEventListener("click", () => {
            resultScreen.classList.add("hidden");
            if (actualMarker) {
                map.removeLayer(actualMarker);
                actualMarker = null;
            }
            console.log("Next round starting");
            updateRoundDisplay(); // Update the round display counter
            nextRound(); //advance to next round
        });
    }
}
// Update the HTML content to display current round numbers
export function updateRoundDisplay() {
    currentRound++; // Increment by one
    if (currentRoundElement) {
        currentRoundElement.textContent = currentRound.toString();
    }
    if (totalRoundsElement) {
        totalRoundsElement.textContent = totalRounds.toString();
    }
}
export function initializeRounds(total = totalRounds, current = currentRound) {
    totalRounds = total;
    currentRound = current;
    if (currentRoundElement) {
        currentRoundElement.textContent = currentRound.toString();
    }
    if (totalRoundsElement) {
        totalRoundsElement.textContent = totalRounds.toString();
    }
}
