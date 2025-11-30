declare const L: any; 

import { map, marker } from "./map.js";
import { showResultScreen } from "./ui/results.js";
import { GAME_CONFIG } from "./utils.js";
import { showStartScreen, showGameScreen, showEndGameScreen, startButton, submitGuessButton, playAgainButton } from "./ui/ui.js";
import { setHeapSnapshotNearHeapLimit } from "v8";
import { totalRounds, initializeRounds } from "./ui/results.js";

let timeDisplay: HTMLElement | null = null;
let scoreDisplay: HTMLElement | null = null;

let actualMarker: any = null; 

//initializes display elements when DOM is ready
function initDisplays() {
  timeDisplay = document.getElementById("time");
  scoreDisplay = document.getElementById("score");
}
const GUESS_TIME = 120;
let timeLeft = GUESS_TIME;
let timerInterval: number | null = null;
let gameStartTime: number = 0;
let currentScore: number = 0;

//here is where we store the events
let allEvents: any[] = [];
let usedEventIndices: number[] = [];
let currentEvent: any = null;


//reset game state
export async function resetGame(): Promise<void> {
  currentScore = 0;
  usedEventIndices = [];
  currentEvent = null;
  timeLeft = GUESS_TIME;
  
  //clear score display
  if (scoreDisplay) {
    scoreDisplay.textContent = "Score: 0";
  }
  
  await loadEvents();
  console.log("Game state reset");

  // Initialize round number, that way the current round correctly appears as one when user plays
  initializeRounds(totalRounds, 1);
}

//first we want to load the events from the JSON file
async function loadEvents(): Promise<void> {
  try {
    const response = await fetch('./assets/events.json');
    const data = await response.json();
    allEvents = data.events;
    pickRandomEvent();
    console.log("Loaded events:", allEvents.length);
  } catch (error) {
    console.error("Failed to load events:", error);
  }
}

//pick a random event that hasn't been used yet
function pickRandomEvent(): boolean {
  //Show total number of rounds, then we are done.
  // To adjust the number of total rounds, go into scripts/ui/results.ts
  if (usedEventIndices.length >= totalRounds) {
    return false;
  }
  
  //keep going if we still have more to pick
  let randomIndex: number;
  do {
    randomIndex = Math.floor(Math.random() * allEvents.length);
  } while (usedEventIndices.includes(randomIndex));
  
  usedEventIndices.push(randomIndex);
  currentEvent = allEvents[randomIndex];
  console.log("Picked new event:", currentEvent.name, "- Event #" + usedEventIndices.length);
  updateEventImage();
  return true;
}

//use Haversine formula to calculate distance between guess and answer
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; //radius of earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function startGame(): void {
  gameStartTime = Date.now();
}

export async function startTimer(onTimeUp?: () => void) {
  // Load events if not already loaded
  if (allEvents.length === 0) {
    await loadEvents();
  }
  
  // Pick an event if we don't have one
  if (!currentEvent) {
    console.log("No current event, picking one...");
    pickRandomEvent();
  }
  
  timeLeft = GUESS_TIME;
  updateTimer();
  gameStartTime = Date.now();

  timerInterval = window.setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      stopTimer();
      if(!marker) {
        resetGame();
        showStartScreen();
      } //safety reset if no marker
      else{
        handleGuess();
      }
    }
  }, 1000);
}

// Stop the countdown
export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Reset the countdown
export function resetTimer() {
  timeLeft = GUESS_TIME;
  updateTimer();
  currentScore = 0;
  usedEventIndices = []; //reset the used events
  if (!scoreDisplay) {
    scoreDisplay = document.getElementById("score");
  }
  if (scoreDisplay) {
    scoreDisplay.textContent = "Score: 0";
  }
}

// Update display (MM:SS format)
function updateTimer() {
  if (!timeDisplay) {
    timeDisplay = document.getElementById("time");
  }
  if (timeDisplay) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = 
      `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}

function updateScore(score: number): void {
  if (!scoreDisplay) {
    scoreDisplay = document.getElementById("score");
  }
  if (scoreDisplay) {
    currentScore += score;
    console.log("Round score:", score, "Total score:", currentScore);
    scoreDisplay.textContent = `Score: ${currentScore}`;
  } else {
    console.error("Score display element not found!");
  }
}

export function handleGuess(): void {
  console.log("handleGuess called");
  console.log("Marker:", marker);
  
  if (!marker) {
    alert("Please place a marker on the map first!");
    console.error("No marker placed");
    return;
  }

  if (!currentEvent) {
    alert("No event loaded!");
    return;
  }

  console.log("Stopping timer...");
  stopTimer();

  const guessLat = marker.getLatLng().lat;
  const guessLon = marker.getLatLng().lng;
  console.log("Guess location:", guessLat, guessLon);

  const correctLat = currentEvent.location.latitude;
  const correctLon = currentEvent.location.longitude;
  console.log("Correct location:", correctLat, correctLon);


  const distanceKm = calculateDistance(guessLat, guessLon, correctLat, correctLon);
  console.log("Distance:", distanceKm, "km");

  
  const timeTaken = (Date.now() - gameStartTime) / 1000;
  const timeRemaining = GUESS_TIME - timeTaken;
  console.log("Time taken:", timeTaken, "seconds");


  const radiusBonus = distanceKm <= GAME_CONFIG.SCORING.DISTANCE_THRESHOLD ? 50 : 0;
  const distanceScore = Math.max(0, 100 * (1 - distanceKm / GAME_CONFIG.SCORING.MAX_DISTANCE_KM));
  const timeScore = Math.max(0, 50 * (timeRemaining / GUESS_TIME));
  const totalScore = radiusBonus + distanceScore + timeScore;

  console.log(`Distance: ${distanceKm.toFixed(2)} km, Time: ${timeTaken.toFixed(1)}s, Score: ${totalScore.toFixed(0)}`);
  console.log(`Radius bonus: ${radiusBonus}, Distance score: ${distanceScore.toFixed(2)}, Time score: ${timeScore.toFixed(2)}`);

  updateScore(Math.round(totalScore));

  //show result screen with guess vs actual location
  showResultScreen(
    { lat: guessLat, lng: guessLon },
    { lat: correctLat, lng: correctLon },
    distanceKm,
    Math.round(totalScore)
  );
}

//function to advance to next round (called from results screen)
export function nextRound(): void {
  console.log("nextRound called");
  console.log("Used events:", usedEventIndices.length, "Total events:", allEvents.length);
  
  //move to next event
  const hasNext = pickRandomEvent();
  if (!hasNext) {
    console.log("No more events! Game complete. Final score:", currentScore);
    showEndGameScreen(currentScore);
    
    //resetGame(); not neccesary, the end game screen handles this.
    stopTimer();
    //showStartScreen(); not neccesary, the end game screen handles this.
  } else {
    console.log("Moving to next event:", currentEvent?.name);

    // Allow users to see and click Submit Guess Button again
    const submitGuessButton = document.getElementById("submit-guess-game");
    if (submitGuessButton) {
      submitGuessButton.style.display = "block"; 
    }

    //updateEventImage(); Not neccesary because we are calling this in pickRandomEvent()
    
    //reset timer for next event
    timeLeft = GUESS_TIME;
    updateTimer();
    gameStartTime = Date.now();
    
    //restart timer
    timerInterval = window.setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) {
        stopTimer();
        if(!marker) {
          resetGame();
          showStartScreen();
        } //safety reset if no marker
        else{
          handleGuess();
        }
      }
    }, 1000);
  }
}

//update the image to match the new event
function updateEventImage(): void {
  if (!currentEvent) return;
  
  const imageElement = document.getElementById("historical-image") as HTMLImageElement;
  const hintTextElement = document.getElementById("hint-text") as HTMLElement;
  if (imageElement && currentEvent.image) {
    imageElement.src = currentEvent.image;
    hintTextElement.textContent = currentEvent["hint-1"];
    console.log("Updated image to:", currentEvent.image);
  }
}