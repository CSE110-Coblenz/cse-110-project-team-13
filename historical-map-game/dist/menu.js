// menu.ts - Hamburger Menu Module
// Provides navigation menu with Back to Start and Mini Game options
import { MatchingGame } from "./matching-game.js";
import { TimelineGame } from "./timeline-game.js";
import { stopTimer, resumeTimer } from "./game.js";
let mg1 = null;
let mg2 = null;
export function initializeMenu() {
    console.log("Initializing menu...");
    // Core required elements
    const menuToggle = document.getElementById("menu-toggle");
    const menuNav = document.getElementById("menu-nav");
    const menuHome = document.getElementById("menu-home");
    const minigame1Modal = document.getElementById("minigame1-modal");
    const minigame2Modal = document.getElementById("minigame2-modal");
    const closeButtons = document.querySelectorAll(".close-modal");
    // Hamburger menu items
    const menuMinigame1 = document.getElementById("menu-minigame1");
    const menuMinigame2 = document.getElementById("menu-minigame2");
    // Top-of-page buttons
    const topMinigame1 = document.getElementById("top-minigame1");
    const topMinigame2 = document.getElementById("top-minigame2");
    // Validate strictly required elements
    if (!menuToggle || !menuNav || !menuHome || !minigame1Modal || !minigame2Modal) {
        console.error("Menu: Required DOM elements not found");
        if (!menuToggle)
            console.error("  - menuToggle not found");
        if (!menuNav)
            console.error("  - menuNav not found");
        if (!menuHome)
            console.error("  - menuHome not found");
        if (!minigame1Modal)
            console.error("  - minigame1Modal not found");
        if (!minigame2Modal)
            console.error("  - minigame2Modal not found");
        return;
    }
    if (!topMinigame1)
        console.warn("Top Matching Game button (top-minigame1) not found");
    if (!topMinigame2)
        console.warn("Top Timeline Game button (top-minigame2) not found");
    console.log("Menu: All required elements found, setting up event listeners...");
    // ========== HAMBURGER MENU ==========
    menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Menu toggle clicked");
        menuToggle.classList.toggle("active");
        menuNav.classList.toggle("menu-hidden");
    });
    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!menuToggle.contains(target) && !menuNav.contains(target)) {
            menuToggle.classList.remove("active");
            menuNav.classList.add("menu-hidden");
        }
    });
    // Back to start
    menuHome.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Back to start clicked");
        const gameScreen = document.getElementById("game-screen");
        const startScreen = document.getElementById("start-screen");
        if (gameScreen && startScreen) {
            gameScreen.style.display = "none";
            startScreen.style.display = "flex";
        }
        menuToggle.classList.remove("active");
        menuNav.classList.add("menu-hidden");
    });
    // Helper: prevent double-initialization if already open
    const isModalActive = (modal) => !!modal && modal.classList.contains("active");
    //this pauses the timer of the main game if we are in the minigame
    const pauseMainGameForMinigame = (modal) => {
        if (!modal)
            return;
        //pause if the popup is open
        if (!modal.classList.contains("active")) {
            stopTimer();
        }
    };
    const resumeMainGameAfterMinigame = (modal) => {
        if (!modal)
            return;
        //only resume timer after user closes modal
        if (modal.classList.contains("active")) {
            //continue the timer from where it left off
            resumeTimer();
        }
    };
    // ========== HAMBURGER MINI GAME BUTTONS ==========
    if (menuMinigame1) {
        menuMinigame1.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Hamburger Mini game 1 clicked");
            if (!minigame1Modal)
                return;
            pauseMainGameForMinigame(minigame1Modal);
            if (isModalActive(minigame1Modal)) {
                console.log("Mini game 1 modal already active, ignoring extra click");
                return;
            }
            minigame1Modal.classList.add("active");
            if (mg1) {
                mg1.destroy();
                mg1 = null;
            }
            mg1 = new MatchingGame();
            menuToggle.classList.remove("active");
            menuNav.classList.add("menu-hidden");
        });
    }
    if (menuMinigame2) {
        menuMinigame2.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Hamburger Mini game 2 clicked");
            if (!minigame2Modal)
                return;
            pauseMainGameForMinigame(minigame2Modal);
            if (isModalActive(minigame2Modal)) {
                console.log("Mini game 2 modal already active, ignoring extra click");
                return;
            }
            minigame2Modal.classList.add("active");
            if (mg2) {
                mg2.destroy();
                mg2 = null;
            }
            mg2 = new TimelineGame();
            menuToggle.classList.remove("active");
            menuNav.classList.add("menu-hidden");
        });
    }
    // ========== TOP-OF-PAGE MINI GAME BUTTONS ==========
    if (topMinigame1) {
        topMinigame1.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Top Matching Game button clicked");
            if (!minigame1Modal)
                return;
            pauseMainGameForMinigame(minigame1Modal);
            if (isModalActive(minigame1Modal)) {
                console.log("Mini game 1 modal already active, ignoring extra click");
                return;
            }
            minigame1Modal.classList.add("active");
            if (mg1) {
                mg1.destroy();
                mg1 = null;
            }
            mg1 = new MatchingGame();
        });
    }
    if (topMinigame2) {
        topMinigame2.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Top Timeline Game button clicked");
            if (!minigame2Modal)
                return;
            pauseMainGameForMinigame(minigame2Modal);
            if (isModalActive(minigame2Modal)) {
                console.log("Mini game 2 modal already active, ignoring extra click");
                return;
            }
            minigame2Modal.classList.add("active");
            if (mg2) {
                mg2.destroy();
                mg2 = null;
            }
            mg2 = new TimelineGame(); // loads events.json automatically
        });
    }
    // ========== MODAL CLOSE BUTTONS ==========
    closeButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            const modalId = this.getAttribute("data-modal");
            if (modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    resumeMainGameAfterMinigame(modal);
                    modal.classList.remove("active");
                }
            }
            if (modalId === "minigame1-modal" && mg1) {
                mg1.destroy();
                mg1 = null;
            }
            if (modalId === "minigame2-modal" && mg2) {
                mg2.destroy();
                mg2 = null;
            }
        });
    });
    // Click outside content closes modal
    const modals = [minigame1Modal, minigame2Modal];
    modals.forEach((modal) => {
        if (!modal)
            return;
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                resumeMainGameAfterMinigame(modal);
                modal.classList.remove("active");
            }
        });
    });
    // Escape closes modals
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (minigame1Modal && minigame1Modal.classList.contains("active")) {
                resumeMainGameAfterMinigame(minigame1Modal);
                minigame1Modal.classList.remove("active");
            }
            if (minigame2Modal && minigame2Modal.classList.contains("active")) {
                resumeMainGameAfterMinigame(minigame2Modal);
                minigame2Modal.classList.remove("active");
            }
        }
    });
    console.log("Menu: Initialization complete!");
}
