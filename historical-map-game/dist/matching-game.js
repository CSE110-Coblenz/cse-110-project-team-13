var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class MatchingGame {
    constructor(eventsSourceUrl) {
        this.events = [];
        this.timerValue = 60;
        this.timerInterval = null;
        this.selectedImage = null;
        this.selectedName = null;
        this.gameActive = true;
        this.eventListeners = [];
        this.events = [];
        this.timerValue = 60;
        this.timerInterval = null;
        this.selectedImage = null;
        this.selectedName = null;
        this.gameActive = true;
        this.eventListeners = [];
        this.loadEvents(eventsSourceUrl)
            .then(() => {
            this.loadRandomEvents();
            this.initializeSelection();
            this.startTimer();
            this.initializePlayAgainButton();
            console.log("Matching Game initialized");
        })
            .catch(err => console.error("Matching Game failed:", err));
    }
    // ---------------- Selection Handling ----------------
    initializeSelection() {
        const images = document.querySelectorAll(".event-image");
        const names = document.querySelectorAll(".event-name");
        images.forEach(img => {
            // make click handler for image
            const clickHandler = (e) => {
                if (!this.gameActive)
                    return; // Prevent clicking after timer ends
                if (img.classList.contains("matched"))
                    return;
                if (this.selectedImage)
                    this.selectedImage.classList.remove("selected");
                this.selectedImage = img;
                img.classList.add("selected");
                this.tryMatch();
            };
            img.addEventListener("click", clickHandler);
            this.eventListeners.push({ element: img, type: "click", handler: clickHandler });
            // Prevent users from right-clicking on images
            const contextHandler = (e) => {
                e.preventDefault();
                return false;
            };
            img.addEventListener("contextmenu", contextHandler);
            this.eventListeners.push({ element: img, type: "contextmenu", handler: contextHandler });
        });
        names.forEach(name => {
            const clickHandler = (e) => {
                if (!this.gameActive)
                    return; // Prevent clicking after timer ends
                if (name.classList.contains("matched"))
                    return;
                if (this.selectedName)
                    this.selectedName.classList.remove("selected");
                this.selectedName = name;
                name.classList.add("selected");
                this.tryMatch();
            };
            name.addEventListener("click", clickHandler);
            this.eventListeners.push({ element: name, type: "click", handler: clickHandler });
        });
    }
    tryMatch() {
        if (!this.selectedImage || !this.selectedName)
            return;
        const imgId = this.selectedImage.dataset.eventId;
        const nameId = this.selectedName.dataset.eventId;
        if (imgId === nameId) {
            // Correct match - turn green permanently
            this.selectedImage.classList.add("matched");
            this.selectedName.classList.add("matched");
            this.selectedImage.classList.remove("drop-invalid", "selected");
            this.selectedName.classList.remove("drop-invalid", "selected");
            this.selectedImage = null;
            this.selectedName = null;
        }
        else {
            // Incorrect match - turn red temporarily
            this.selectedImage.classList.add("drop-invalid");
            this.selectedName.classList.add("drop-invalid");
            this.selectedImage.classList.remove("selected");
            this.selectedName.classList.remove("selected");
            // Store references before clearing
            const wrongImg = this.selectedImage;
            const wrongName = this.selectedName;
            this.selectedImage = null;
            this.selectedName = null;
            // Remove red after 1 second so they can try again
            setTimeout(() => {
                wrongImg.classList.remove("drop-invalid");
                wrongName.classList.remove("drop-invalid");
            }, 1000);
        }
        this.updateScore();
    }
    updateScore() {
        const matched = document.querySelectorAll(".event-image.matched").length;
        const score = document.getElementById("match-score");
        if (score)
            score.textContent = `${matched}`;
    }
    // ---------------- Timer ----------------
    startTimer() {
        const timerEl = document.getElementById("match-timer");
        if (!timerEl)
            return;
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
    stopTimer() {
        if (this.timerInterval !== null)
            clearInterval(this.timerInterval);
        this.timerInterval = null;
    }
    revealResults() {
        this.gameActive = false; // Disable matching
        const images = document.querySelectorAll(".event-image");
        const names = document.querySelectorAll(".event-name");
        images.forEach(img => {
            const id = img.dataset.eventId;
            const name = Array.from(names).find(n => n.dataset.eventId === id);
            if (name && !img.classList.contains("matched")) {
                img.classList.add("drop-invalid");
                name.classList.add("drop-invalid");
            }
        });
        this.updateScore();
    }
    // ---------------- Reset Game ----------------
    initializePlayAgainButton() {
        const btn = document.getElementById("play-again");
        if (!btn)
            return;
        const handler = () => this.reset();
        btn.addEventListener("click", handler);
        this.eventListeners.push({ element: btn, type: "click", handler: handler });
    }
    // resets game; similar to constructor
    reset() {
        this.stopTimer();
        this.gameActive = true; // Re-enable game on reset
        // remove event listeners
        this.removeEventListeners();
        // Clear all classes
        document.querySelectorAll(".event-image").forEach(img => {
            img.className = "event-image";
        });
        document.querySelectorAll(".event-name").forEach(name => {
            name.className = "event-name";
        });
        this.selectedImage = null;
        this.selectedName = null;
        this.loadRandomEvents();
        this.initializeSelection(); // re-bind events after reload
        this.updateScore();
        this.startTimer();
        this.initializePlayAgainButton(); // re-bind play again button
    }
    // ---------------- Load Events ----------------
    loadEvents(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const urls = url
                ? [url, '/events.json', './events.json', 'assets/events.json']
                : ['/events.json', './events.json', 'assets/events.json'];
            let lastErr = null;
            for (const u of urls) {
                try {
                    const res = yield fetch(u);
                    if (!res.ok)
                        throw new Error(`HTTP ${res.status}`);
                    const json = yield res.json();
                    this.events = Array.isArray(json.events)
                        ? json.events
                        : Array.isArray(json)
                            ? json
                            : [];
                    console.log(`Loaded ${this.events.length} events for matching game`);
                    return;
                }
                catch (e) {
                    lastErr = e;
                }
            }
            throw lastErr;
        });
    }
    // ---------------- Load Random Events ----------------
    loadRandomEvents() {
        const matchingArea = document.querySelector("#minigame1-modal .matching-area");
        if (!matchingArea)
            return;
        matchingArea.innerHTML = "";
        const selected = this.shuffle([...this.events]).slice(0, 10);
        const shuffledNames = this.shuffle([...selected]);
        // Create rows with image on left, name on right
        selected.forEach((ev, index) => {
            const row = document.createElement("div");
            row.classList.add("match-row");
            // Create image div
            const imgDiv = document.createElement("div");
            imgDiv.classList.add("event-image");
            imgDiv.dataset.eventId = String(ev.id);
            imgDiv.innerHTML = `<img src="${ev.image}" alt="${ev.name || ev.title}" />`;
            // Create name div with shuffled name
            const nameEvent = shuffledNames[index];
            const nameDiv = document.createElement("div");
            nameDiv.classList.add("event-name");
            nameDiv.dataset.eventId = String(nameEvent.id);
            nameDiv.textContent = nameEvent.name || nameEvent.title;
            row.appendChild(imgDiv);
            row.appendChild(nameDiv);
            matchingArea.appendChild(row);
        });
    }
    shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }
    removeEventListeners() {
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.eventListeners = [];
    }
    destroy() {
        this.stopTimer();
        this.removeEventListeners();
        // Clear references
        this.selectedImage = null;
        this.selectedName = null;
        // Reset state of game
        this.gameActive = false;
        this.events = [];
        // Clear Mini Game UI
        const matchingArea = document.querySelector("#minigame1-modal .matching-area");
        if (matchingArea) {
            matchingArea.innerHTML = "";
        }
        console.log("Matching Game destroyed");
    }
}
