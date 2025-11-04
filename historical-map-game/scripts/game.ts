import { GAME_CONFIG } from "./utils"

console.log('hello world!');

export class Game {
    private timer: number | null = null;


    /**
     * Updates the score counter
     * @param score 
     */
    updateScore(score: number): void {
        
    }

    /**
     * Updates the timer
     * @param time 
     */
    updateTimer(time: number): void {
        
    }

    /**
     * Start the timer
     */
    startTimer(): void {
        let timeRemaining = GAME_CONFIG.TIMER.GUESS_TIME;
        this.timer = setInterval(() => {
            timeRemaining -= 1;
            this.updateTimer(timeRemaining);
            if(timeRemaining <= 0) {
                this.submitGuess();
            }
        }, 1000);
    }

    /**
     * Stop the timer
     */
    stopTimer(): void {
        if(this.timer != null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    /**
     * End round when user submits guess or timer runs out
     */
    submitGuess(): void {
        this.stopTimer();
    }
}