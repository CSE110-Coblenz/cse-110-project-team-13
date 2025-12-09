var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// timeline-game.ts
export class TimelineGame {
    constructor(eventsSourceUrl) {
        this.events = [];
        this.currentEvent = null;
        this.timerValue = 60;
        this.timerInterval = null;
        // Try to load events (falls back to ./events.json)
        this.loadEvents(eventsSourceUrl).then(() => {
            this.setupElements();
            this.newRound();
            this.startTimer();
            this.initializePlayAgainButton();
            this.initializeSubmitButton();
            console.log("Timeline Game initialized");
        }).catch(err => {
            console.error("TimelineGame: failed to initialize", err);
        });
    }
    // ------------------ Data loading ------------------
    loadEvents(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const tryUrls = url ? [url, '/events.json', './events.json', 'assets/events.json'] : ['/events.json', './events.json', 'assets/events.json'];
            let lastErr = null;
            for (const u of tryUrls) {
                try {
                    const res = yield fetch(u);
                    if (!res.ok)
                        throw new Error(`HTTP ${res.status}`);
                    const json = yield res.json();
                    if (Array.isArray(json.events)) {
                        this.events = json.events;
                    }
                    else if (Array.isArray(json)) {
                        this.events = json;
                    }
                    else {
                        throw new Error('Unexpected JSON shape');
                    }
                    return;
                }
                catch (e) {
                    lastErr = e;
                }
            }
            throw lastErr;
        });
    }
    // ------------------ Setup DOM ------------------
    setupElements() {
        this.slider = document.getElementById("timeline-slider");
        const yearDisplay = document.getElementById("timeline-year-display");
        const image = document.getElementById("timeline-image");
        if (!this.slider) {
            console.error("TimelineGame: slider element #timeline-slider not found");
            return;
        }
        if (!yearDisplay) {
            console.error("TimelineGame: year display element #timeline-year-display not found");
            return;
        }
        if (!image) {
            console.error("TimelineGame: image element #timeline-image not found");
            return;
        }
        // slider configuration: -3000 (3000 BCE) to current year (2025)
        const currentYear = new Date().getFullYear();
        this.slider.min = (-3000).toString();
        this.slider.max = currentYear.toString();
        this.slider.step = "1";
        // set initial label
        this.updateSliderLabel(parseInt(this.slider.value || this.slider.max || String(currentYear)));
        this.slider.addEventListener("input", () => {
            this.updateSliderLabel(parseInt(this.slider.value));
        });
    }
    updateSliderLabel(value) {
        const label = document.getElementById("timeline-year-display");
        if (!label)
            return;
        label.textContent = this.formatYear(value);
    }
    // ------------------ Round logic ------------------
    newRound() {
        if (!this.events || this.events.length === 0) {
            console.error("TimelineGame: no events loaded");
            return;
        }
        // pick a random event
        const event = this.events[Math.floor(Math.random() * this.events.length)];
        this.currentEvent = event;
        const nameEl = document.getElementById("timeline-name");
        const imageEl = document.getElementById("timeline-image");
        const hintEl = document.getElementById("timeline-hint");
        if (nameEl)
            nameEl.textContent = event.name || "Unknown event";
        if (imageEl)
            imageEl.src = event.image || "";
        if (hintEl) {
            // show the easiest hint available (hint-1)
            hintEl.textContent = event["hint-1"] || "";
        }
        // set slider to 0
        if (this.slider) {
            this.slider.value = "0";
            this.updateSliderLabel(0);
        }
        // clear previous results
        const resultEl = document.getElementById("timeline-result");
        if (resultEl) {
            resultEl.innerHTML = "";
        }
    }
    // ------------------ Submit & scoring ------------------
    /* private initializeSubmitButton() {
         const btn = document.getElementById("timeline-submit");
         if (!btn) return;
         btn.addEventListener("click", () => this.checkGuess());
     } */
    initializeSubmitButton() {
        const btn = document.getElementById("timeline-submit");
        if (!btn)
            return;
        btn.onclick = () => this.checkGuess();
    }
    checkGuess() {
        if (!this.currentEvent)
            return;
        const slider = this.slider;
        if (!slider)
            return;
        this.stopTimer();
        const guess = parseInt(slider.value, 10);
        const target = this.parseEventYear(this.currentEvent.year);
        const resultEl = document.getElementById("timeline-result");
        const scoreEl = document.getElementById("timeline-score");
        if (target == null) {
            if (resultEl)
                resultEl.textContent = `Could not parse event year (${this.currentEvent.year}).`;
            return;
        }
        const distance = Math.abs(guess - target); // in years
        const score = this.calculateScore(distance);
        // reveal result
        const formattedTarget = this.formatYear(target);
        const formattedGuess = this.formatYear(guess);
        if (resultEl) {
            resultEl.innerHTML = `
                <div>Correct year: <strong>${formattedTarget}</strong></div>
                <div>Your guess: <strong>${formattedGuess}</strong></div>
                <div>Distance: <strong>${distance} years</strong></div>
            `;
        }
        if (scoreEl)
            scoreEl.textContent = String(score);
        // add visual class to image to indicate correctness bands
        const imageEl = document.getElementById("timeline-image");
        if (imageEl) {
            imageEl.classList.remove("very-close", "close", "far", "very-far");
            if (distance === 0)
                imageEl.classList.add("very-close");
            else if (distance <= 25)
                imageEl.classList.add("close");
            else if (distance <= 200)
                imageEl.classList.add("far");
            else
                imageEl.classList.add("very-far");
        }
    }
    calculateScore(distance) {
        // Simple scoring: 0-100 where exact is 100. Each 10 years loses 1 point, capped.
        const raw = 100 - Math.floor(distance / 10);
        return Math.max(0, Math.min(100, raw));
    }
    // ------------------ Timer (optional) ------------------
    startTimer() {
        const timerEl = document.getElementById("timeline-timer");
        if (!timerEl)
            return;
        this.timerValue = 60;
        timerEl.textContent = `${this.timerValue}`;
        this.timerInterval = window.setInterval(() => {
            this.timerValue--;
            if (timerEl)
                timerEl.textContent = `${this.timerValue}`;
            if (this.timerValue <= 0) {
                this.stopTimer();
                // Auto-check guess when timer runs out
                this.checkGuess();
            }
        }, 1000);
    }
    stopTimer() {
        if (this.timerInterval != null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    // ------------------ Utilities: parse & format years ------------------
    /**
     * Parse the event.year string into an integer year.
     * - BCE years -> negative integers (e.g., 300 BCE => -300)
     * - CE / no suffix -> positive integers (e.g., 79 => 79)
     * - ranges (e.g., "447–432 BCE" or "447-432 BCE") -> rounded midpoint
     * - approximate prefixes like "c." are ignored
     * Returns null if it can't parse.
     */
    parseEventYear(yearStr) {
        if (yearStr == null)
            return null;
        if (typeof yearStr === "number")
            return yearStr;
        let s = String(yearStr).trim();
        // normalize dash characters
        s = s.replace(/\u2013|\u2014/g, "-"); // en/em dashes -> hyphen
        s = s.replace(/–/g, "-");
        s = s.replace(/\s+/g, " ");
        // detect BCE / CE
        const hasBCE = /BCE|BC|B\.C\./i.test(s);
        const hasCE = /CE|AD|A\.D\./i.test(s);
        // remove approximate/c./ca. prefixes and text like "(legendary)"
        s = s.replace(/\b(c\.|ca\.|circa)\b/ig, "");
        s = s.replace(/\(.*?\)/g, "");
        s = s.replace(/[^\d\-\s]/g, ""); // remove non digits and hyphen/space
        s = s.trim();
        if (!s)
            return null;
        // range?
        const parts = s.split("-").map(p => p.trim()).filter(Boolean);
        const numbers = [];
        for (const p of parts) {
            const n = parseInt(p, 10);
            if (!isNaN(n))
                numbers.push(n);
        }
        if (numbers.length === 0)
            return null;
        let value;
        if (numbers.length === 1) {
            value = numbers[0];
        }
        else {
            // midpoint and round
            const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
            value = Math.round(avg);
        }
        if (hasBCE)
            return -Math.abs(value);
        if (hasCE)
            return Math.abs(value);
        // if no era but number looks like very old (>=1000) assume positive (CE),
        // but for safety, keep as positive.
        return value;
    }
    formatYear(y) {
        if (y < 0) {
            return `${Math.abs(y)} BCE`;
        }
        else {
            return `${y} CE`;
        }
    }
    // ------------------ Reset / Play again ------------------
    /*private initializePlayAgainButton() {
        const btn = document.getElementById("timeline-play-again");
        if (!btn) return;
        btn.addEventListener("click", () => {
            this.reset();
        });
    } */
    initializePlayAgainButton() {
        const btn = document.getElementById("timeline-play-again");
        if (!btn)
            return;
        btn.onclick = () => this.reset();
    }
    reset() {
        // clear visual state
        const resultEl = document.getElementById("timeline-result");
        if (resultEl)
            resultEl.innerHTML = "";
        const scoreEl = document.getElementById("timeline-score");
        if (scoreEl)
            scoreEl.textContent = "0";
        const imageEl = document.getElementById("timeline-image");
        if (imageEl) {
            imageEl.classList.remove("very-close", "close", "far", "very-far");
        }
        this.newRound();
        this.stopTimer();
        this.startTimer();
    }
    destroy() {
        this.stopTimer();
        // remove any classes we added
        document.querySelectorAll("#timeline-image").forEach(el => {
            el.classList.remove("very-close", "close", "far", "very-far");
        });
    }
}
