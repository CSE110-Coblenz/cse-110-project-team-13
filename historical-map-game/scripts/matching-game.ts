export class MatchingGame {
    private draggedItem: HTMLElement | null = null;
    private timerValue = 60;
    private timerInterval: number | null = null;
    
    // Properties
    private totalPairs = 3;
    private allEvents: any[] = [];
    private currentEvents: any[] = [];

    constructor() {
        this.loadEvents().then(() => {
            this.initializeGame();
        }).catch(err => {
            console.error("Failed to load events for matching game:", err);
        });
    }

    // Load events from JSON
    private async loadEvents() {
        const tryUrls = ['./events.json', '/events.json', 'assets/events.json'];
        let lastErr: any = null;

        for (const url of tryUrls) {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                
                if (json.events && Array.isArray(json.events)) {
                    this.allEvents = json.events;
                } else if (Array.isArray(json)) {
                    this.allEvents = json;
                } else {
                    throw new Error('Unexpected JSON shape');
                }
                console.log(`Loaded ${this.allEvents.length} events for matching game`);
                return;
            } catch (e) {
                lastErr = e;
            }
        }
        throw lastErr;
    }

    private initializeGame() {
        this.selectRandomEvents();
        this.generateImages();
        this.generateLabels();
        this.initializeDragging(); 
        this.startTimer(); 
        this.initializePlayAgainButton(); 
        this.initializeCheckButton(); 
        console.log("Matching Game initialized"); 
    }

    // Select random events
    private selectRandomEvents() {
        const shuffled = [...this.allEvents].sort(() => Math.random() - 0.5);
        this.currentEvents = shuffled.slice(0, this.totalPairs);
        console.log("Selected events:", this.currentEvents.map(e => e.name));
    }

    // Generate images in order
    private generateImages() {
        const imagesRow = document.getElementById("images-row");
        if (!imagesRow) return;

        imagesRow.innerHTML = '';
        
        this.currentEvents.forEach((event, index) => {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'match-image';
            imageDiv.dataset.eventId = String(event.id);
            imageDiv.dataset.position = String(index);
            imageDiv.innerHTML = `<img src="${event.image}" alt="${event.name}" />`;
            imagesRow.appendChild(imageDiv);
        });
    }

    // Generate labels SHUFFLED
    private generateLabels() {
        const labelsRow = document.getElementById("labels-row");
        if (!labelsRow) return;

        labelsRow.innerHTML = '';
        
        // Shuffle the labels
        const shuffledEvents = [...this.currentEvents].sort(() => Math.random() - 0.5);
        
        shuffledEvents.forEach(event => {
            const labelDiv = document.createElement('div');
            labelDiv.className = 'match-label';
            labelDiv.dataset.eventId = String(event.id);
            labelDiv.textContent = event.name;
            labelsRow.appendChild(labelDiv);
        });

        // Update total matches
        const totalMatchesEl = document.getElementById("total-matches");
        if (totalMatchesEl) {
            totalMatchesEl.textContent = `${this.totalPairs}`;
        }
    }

    private initializeDragging() {
        const labels = document.querySelectorAll<HTMLElement>(".match-label");

        labels.forEach(label => {
            label.draggable = true;

            label.addEventListener("dragstart", () => {
                this.draggedItem = label;
                label.classList.add("dragging");
            });

            label.addEventListener("dragend", () => {
                label.classList.remove("dragging");
            });
        
            // Allow dropping ON TOP of another label
            label.addEventListener("dragover", (e) => e.preventDefault());

            label.addEventListener("drop", (e) => {
                e.preventDefault();
                if (!this.draggedItem) return;
                if (this.draggedItem === label) return; // can't drop on itself

                // Swap nodes 
                this.swapNames(this.draggedItem, label);
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

        this.timerValue = 60;
        timerEl.textContent = `${this.timerValue}`;

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

    // REVEAL RESULTS (Position-based matching)
    private revealResults() {
        const images = document.querySelectorAll<HTMLElement>(".match-image");
        const labels = document.querySelectorAll<HTMLElement>(".match-label");

        let correctCount = 0;

        images.forEach((img, index) => {
            const correctId = img.dataset.eventId;
            const label = labels[index];

            // Clear previous states
            img.classList.remove("correct", "incorrect");
            label.classList.remove("correct", "incorrect", "selected");

            if (label.dataset.eventId === correctId) {
                img.classList.add("correct");
                label.classList.add("correct");
                correctCount++;
            } else {
                img.classList.add("incorrect");
                label.classList.add("incorrect");
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
        document.querySelectorAll(".match-image, .match-label").forEach(el => {
            el.classList.remove("correct", "incorrect", "selected", "dragging");
        });

        // 2. Reset score 
        const score = document.getElementById("match-score");
        if (score) score.textContent = "0";

        // 3. Shuffle name order 
        this.shuffleNames();

        // 4. Re-enable dragging 
        document.querySelectorAll(".match-label").forEach(label => {
            (label as HTMLElement).draggable = true;
        });

        // 5. Restart timer 
        this.stopTimer();
        this.startTimer();
    }

    // SHUFFLE 
    private shuffleNames() {
        this.selectRandomEvents();
        this.generateImages();
        this.generateLabels();
        // Re-initialize dragging after generating new labels
        this.initializeDragging();
    }

    // DESTROY 
    public destroy() {
        this.stopTimer();
        document.querySelectorAll(".match-image, .match-label").forEach(el => {
            el.classList.remove("correct", "incorrect", "selected", "dragging");
        });
    }
}
