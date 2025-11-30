export class MatchingGame {
  private events: any[] = [];
  private timerValue = 60;
  private timerInterval: number | null = null;
  private selectedImage: HTMLElement | null = null;
  private selectedName: HTMLElement | null = null;
  private gameActive = true;

  constructor(eventsSourceUrl?: string) {
    this.events = [];
    this.timerValue = 60;
    this.timerInterval = null;
    this.selectedImage = null;
    this.selectedName = null;
    this.gameActive = true;

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
  private initializeSelection() {
    const images = document.querySelectorAll(".event-image");
    const names = document.querySelectorAll(".event-name");

    images.forEach(img => {
      img.addEventListener("click", () => {
        if (!this.gameActive) return; // Prevent clicking after timer ends
        if (img.classList.contains("matched")) return;
        if (this.selectedImage) this.selectedImage.classList.remove("selected");
        this.selectedImage = img as HTMLElement;
        img.classList.add("selected");
        this.tryMatch();
      });

      // Prevent users from right-clicking on images
      img.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        return false;
      });
    });

    names.forEach(name => {
      name.addEventListener("click", () => {
        if (!this.gameActive) return; // Prevent clicking after timer ends
        if (name.classList.contains("matched")) return;
        if (this.selectedName) this.selectedName.classList.remove("selected");
        this.selectedName = name as HTMLElement;
        name.classList.add("selected");
        this.tryMatch();
      });
    });
  }

  private tryMatch() {
    if (!this.selectedImage || !this.selectedName) return;

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
    } else {
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

  private updateScore() {
    const matched = document.querySelectorAll(".event-image.matched").length;
    const score = document.getElementById("match-score");
    if (score) score.textContent = `${matched}`;
  }

  // ---------------- Timer ----------------
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
    if (this.timerInterval !== null) clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  private revealResults() {
    this.gameActive = false; // Disable matching
    const images = document.querySelectorAll(".event-image");
    const names = document.querySelectorAll(".event-name");

    images.forEach(img => {
      const id = (img as HTMLElement).dataset.eventId;
      const name = Array.from(names).find(n => (n as HTMLElement).dataset.eventId === id);
      if (name && !img.classList.contains("matched")) {
        img.classList.add("drop-invalid");
        name.classList.add("drop-invalid");
      }
    });

    this.updateScore();
  }

  // ---------------- Reset Game ----------------
  private initializePlayAgainButton() {
    const btn = document.getElementById("play-again");
    if (!btn) return;
    btn.addEventListener("click", () => this.reset());
  }

  public reset() {
    this.stopTimer();
    this.gameActive = true; // Re-enable game on reset

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
  }

  // ---------------- Load Events ----------------
  private async loadEvents(url?: string) {
    const urls = url 
      ? [url, '/events.json', './events.json', 'assets/events.json'] 
      : ['/events.json', './events.json', 'assets/events.json'];

    let lastErr: any = null;

    for (const u of urls) {
      try {
        const res = await fetch(u);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        this.events = Array.isArray(json.events) 
          ? json.events 
          : Array.isArray(json) 
            ? json 
            : [];
        console.log(`Loaded ${this.events.length} events for matching game`);
        return;
      } catch (e) { 
        lastErr = e; 
      }
    }

    throw lastErr;
  }

  // ---------------- Load Random Events ----------------
  private loadRandomEvents() {
    const matchingArea = document.querySelector("#minigame1-modal .matching-area");
    if (!matchingArea) return;

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

  private shuffle<T>(arr: T[]): T[] {
    return arr.sort(() => Math.random() - 0.5);
  }

  public destroy() {
    this.stopTimer();
  }
}
