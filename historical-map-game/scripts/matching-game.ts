export class MatchingGame {
    private draggedItem: HTMLElement | null = null;
    private timerValue = 60;
    private timerInterval: number | null = null;

    constructor() {
        this.initializeDragging();
        this.startTimer();
        this.initializePlayAgainButton();
        this.initializeCheckButton();
        console.log("Matching Game initialized");
    }

    // ---------------- Dragging ----------------
    private initializeDragging() {
        const names = document.querySelectorAll<HTMLElement>(".event-name");
        const images = document.querySelectorAll<HTMLElement>(".event-image");

        names.forEach(name => {
            name.draggable = true;

            name.addEventListener("dragstart", () => {
                this.draggedItem = name;
                name.classList.add("dragging");
            });

            name.addEventListener("dragend", () => {
                name.classList.remove("dragging");
            });
        
            // Allow dropping ON TOP of another name
            name.addEventListener("dragover", (e) => e.preventDefault());

            name.addEventListener("drop", (e) => {
                e.preventDefault();
                if (!this.draggedItem) return;
                if (this.draggedItem === name) return; // can't drop on itself

                // Swap nodes
                this.swapNames(this.draggedItem, name);
                this.draggedItem = null;
            });
        });
    }
    // DRAG AND DROP HANDLING
    private swapNames(a: HTMLElement, b: HTMLElement) {
        const parent = a.parentElement;
        if (!parent) return;

        const aNext = a.nextElementSibling === b ? a : a.nextElementSibling;

        parent.insertBefore(a, b);
        parent.insertBefore(b, aNext);
    }

    // TIMER
    private startTimer() {
        const timerEl = document.getElementById("match-timer");
        if (!timerEl) return;

        this.timerInterval = window.setInterval(() => {
            this.timerValue--;
            timerEl.textContent = `${this.timerValue}`;

            if (this.timerValue <= 0) {
                this.stopTimer();
                this.revealResults();
            }
        }, 1000);
    }

    private stopTimer() {
        if (this.timerInterval != null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // CHECK ANSWERS
    private initializeCheckButton() {
        const btn = document.getElementById("check-answers");
        if (!btn) return;

        btn.addEventListener("click", () => {
            this.stopTimer();
            this.revealResults();
        });
    }

    private revealResults() {
        const images = document.querySelectorAll<HTMLElement>(".images-side .event-image");
        const names = document.querySelectorAll<HTMLElement>(".names-side .event-name");

        let correctCount = 0;

        images.forEach((img, index) => {
            const correctId = img.dataset.eventId;
            const name = names[index];

            img.classList.remove("correct", "incorrect");

            if (name.dataset.eventId === correctId) {
                img.classList.add("correct");
                correctCount++;
            } else {
                img.classList.add("incorrect");
            }
        });

        const score = document.getElementById("match-score");
        if (score) score.textContent = `${correctCount}`;
    }

    // RESET GAME
    private initializePlayAgainButton() {
        const btn = document.getElementById("play-again");
        if (!btn) return;

        btn.addEventListener("click", () => this.reset());
    }

    public reset() {
        console.log("Resetting mini-game...");

        // 1. Remove correctness borders
        document.querySelectorAll(".event-image").forEach(img => {
            img.classList.remove("correct", "incorrect");
        });

        // 2. Reset score
        const score = document.getElementById("match-score");
        if (score) score.textContent = "0";

        // 3. Shuffle name order
        this.shuffleNames();

        // 4. Re-enable dragging
        document.querySelectorAll(".event-name").forEach(name => {
            (name as HTMLElement).draggable = true;
        });

        // 5. Restart timer
        this.startTimer();
    }

    private shuffleNames() {
        const list = document.querySelector(".names-side");
        if (!list) return;

        const items = Array.from(list.children);

        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            list.appendChild(items[j]);
            items.splice(j, 1);
        }
    }
      public destroy() {
        this.stopTimer();
        document.querySelectorAll(".event-image").forEach(img => {
            img.classList.remove("correct", "incorrect");
        });
    }
}