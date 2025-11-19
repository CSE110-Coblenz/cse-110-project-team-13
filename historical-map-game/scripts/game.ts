declare const L: any; 

import { map, marker } from "./map.js";
import { showResultScreen } from "./ui/results.js";
import { GAME_CONFIG } from "./utils.js";

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

//we are using the first event as the only event for now
const currentEvent = {
  id: 1,
  name: "Battle of Megiddo",
  location: {
    latitude: 32.5840,
    longitude: 35.1828,
    city: "Megiddo",
    country: "Ancient Egypt / Canaan (modern Israel)"
  }
};

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

export function startTimer(onTimeUp?: () => void) {
  timeLeft = GUESS_TIME;
  updateTimer();
  gameStartTime = Date.now();

  timerInterval = window.setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      stopTimer();
      if (onTimeUp) onTimeUp();
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
    currentScore = score;
    scoreDisplay.textContent = `Score: ${score}`;
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
  console.log("Score updated, current score:", currentScore);

  showResultScreen(
    { lat: guessLat, lng: guessLon },
    { lat: correctLat, lng: correctLon },
    distanceKm,
    totalScore
  );
  
}