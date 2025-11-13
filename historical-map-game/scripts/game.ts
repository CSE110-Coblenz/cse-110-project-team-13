          
const timeDisplay = document.getElementById("time") as HTMLElement;
const scoreDisplay = document.getElementById("score") as HTMLElement; 
let score = 0; 
const GUESS_TIME = 120;
let timeLeft = GUESS_TIME; // seconds
let timerInterval: number | null = null;

function startGame(): void {

}
    
export function startTimer(onTimeUp?: () => void) {
  timeLeft = GUESS_TIME;
  updateTimer();

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
function updateScore(newScore: number): void {
        score = newScore; 
        scoreDisplay.textContent = `Score: ${score}`; 
}


function handleGuess(): void {
    stopTimer();
    updateScore(score + 10); // currently adding 10 points per guess 
}