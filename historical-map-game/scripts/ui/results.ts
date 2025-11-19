
declare const L: any;

import { map, marker as guessMarker } from "../map.js";
import { nextRound } from "../game.js";

let actualMarker: any = null;

export function showResultScreen(
  guess: { lat: number; lng: number },
  actual: { lat: number; lng: number },
  distance: number,
  score: number
): void {
  console.log("showResultScreen called with:", { guess, actual, distance, score });

  
  if (guessMarker) {
    guessMarker.setLatLng([guess.lat, guess.lng]);
  }

  if (!actualMarker) {
    actualMarker = L.marker([actual.lat, actual.lng], {
      title: "Actual Location",
      opacity: 0.9
    }).addTo(map);
  } else {
    actualMarker.setLatLng([actual.lat, actual.lng]);
  }


  const bounds = L.latLngBounds(
    [guess.lat, guess.lng],
    [actual.lat, actual.lng]
  );
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
  if (distance < 50) feedback = "Amazing! You were very close!";
  else if (distance < 200) feedback = "Great accuracy!";
  else if (distance < 500) feedback = "Not bad — you're in the right region.";
  else feedback = "Way off — try using landmarks!";

  feedbackEl.textContent = feedback;

 
  resultScreen.classList.remove("hidden");

  const nextBtn = document.getElementById("result-next");
  if (nextBtn) {
    //remove old event listeners to prevent duplicates
    const newBtn = nextBtn.cloneNode(true) as HTMLElement;
    nextBtn.parentNode?.replaceChild(newBtn, nextBtn);
    
    newBtn.addEventListener("click", () => {
      resultScreen.classList.add("hidden");

      if (actualMarker) {
        map.removeLayer(actualMarker);
        actualMarker = null;
      }

      console.log("Next round starting...");
      
      //advance to next round
      nextRound();
    });
  }
}
