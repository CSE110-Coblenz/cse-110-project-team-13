import { marker } from "./map.js";
import { GAME_CONFIG } from "./utils.js";
import eventsData from "../assets/events.json";

const timeDisplay = document.getElementById("time") as HTMLElement;
const GUESS_TIME = 120;
let timeLeft = GUESS_TIME;
let timerInterval: number | null = null;
let gameStartTime: number = 0;

//we are using the first event as the only event for now
const currentEvent = eventsData.events[0];

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
}

// Update display (MM:SS format)
function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.textContent = 
    `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updateScore(score: number): void {
  // TODO: Update score display in UI
}

export function handleGuess(): void {
  if (!marker) {
    console.error("No marker placed");
    return;
  }

  stopTimer();

  //user's location
  const guessLat = marker.getLatLng().lat;
  const guessLon = marker.getLatLng().lng;

  //answer location
  const correctLat = currentEvent.location.latitude;
  const correctLon = currentEvent.location.longitude;

  //distance calculation
  const distanceKm = calculateDistance(guessLat, guessLon, correctLat, correctLon);

  //time it took to guess
  const timeTaken = (Date.now() - gameStartTime) / 1000;
  const timeRemaining = GUESS_TIME - timeTaken;

  // score = inside radius bonus + distance score + time score
  const radiusBonus = distanceKm <= GAME_CONFIG.SCORING.DISTANCE_THRESHOLD ? 50 : 0;
  const distanceScore = Math.max(0, 100 * (1 - distanceKm / GAME_CONFIG.SCORING.MAX_DISTANCE_KM));
  const timeScore = Math.max(0, 50 * (timeRemaining / GUESS_TIME));
  const totalScore = radiusBonus + distanceScore + timeScore;

  console.log(`Distance: ${distanceKm.toFixed(2)} km, Time: ${timeTaken.toFixed(1)}s, Score: ${totalScore.toFixed(0)}`);

  updateScore(Math.round(totalScore));
}