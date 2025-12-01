// menu.ts - Hamburger Menu Module
// Provides navigation menu with Back to Start and Mini Game options
import { MatchingGame } from "./matching-game.js";
import { TimelineGame } from "./timeline-game.js";

let mg1: MatchingGame | null = null;
let mg2: TimelineGame | null = null;

export function initializeMenu(): void {
    console.log("Initializing menu...");

    // Core required elements
    const menuToggle = document.getElementById("menu-toggle") as HTMLButtonElement | null;
    const menuNav = document.getElementById("menu-nav") as HTMLElement | null;
    const menuHome = document.getElementById("menu-home") as HTMLButtonElement | null;

    const minigame1Modal = document.getElementById("minigame1-modal") as HTMLDivElement | null;
    const minigame2Modal = document.getElementById("minigame2-modal") as HTMLDivElement | null;
    const closeButtons = document.querySelectorAll(".close-modal") as NodeListOf<HTMLButtonElement>;

    // Hamburger menu items
    const menuMinigame1 = document.getElementById("menu-minigame1") as HTMLButtonElement | null;
    const menuMinigame2 = document.getElementById("menu-minigame2") as HTMLButtonElement | null;

    // Top-of-page buttons
    const topMinigame1 = document.getElementById("top-minigame1") as HTMLButtonElement | null;
    const topMinigame2 = document.getElementById("top-minigame2") as HTMLButtonElement | null;

    // Validate strictly required elements
    if (!menuToggle || !menuNav || !menuHome || !minigame1Modal || !minigame2Modal) {
        console.error("Menu: Required DOM elements not found");
        if (!menuToggle) console.error("  - menuToggle not found");
        if (!menuNav) console.error("  - menuNav not found");
        if (!menuHome) console.error("  - menuHome not found");
        if (!minigame1Modal) console.error("  - minigame1Modal not found");
        if (!minigame2Modal) console.error("  - minigame2Modal not found");
        return;
    }

    if (!topMinigame1) console.warn("Top Matching Game button (top-minigame1) not found");
    if (!topMinigame2) console.warn("Top Timeline Game button (top-minigame2) not found");

    console.log("Menu: All required elements found, setting up event listeners...");

    // ========== HAMBURGER MENU ==========
    menuToggle.addEventListener("click", (e: MouseEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Menu toggle clicked");
        menuToggle.classList.toggle("active");
        menuNav.classList.toggle("menu-hidden");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event: MouseEvent): void => {
        const target = event.target as HTMLElement;
        if (!menuToggle.contains(target) && !menuNav.contains(target)) {
            menuToggle.classList.remove("active");
            menuNav.classList.add("menu-hidden");
        }
    });

    // Back to start
    menuHome.addEventListener("click", (e: MouseEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Back to start clicked");

        const gameScreen = document.getElementById("game-screen") as HTMLDivElement | null;
        const startScreen = document.getElementById("start-screen") as HTMLDivElement | null;

        if (gameScreen && startScreen) {
            gameScreen.style.display = "none";
            startScreen.style.display = "flex";
        }

        menuToggle.classList.remove("active");
        menuNav.classList.add("menu-hidden");
    });

    // Helper: prevent double-initialization if already open
    const isModalActive = (modal: HTMLDivElement | null): boolean =>
        !!modal && modal.classList.contains("active");

    // ========== HAMBURGER MINI GAME BUTTONS ==========
    if (menuMinigame1) {
        menuMinigame1.addEventListener("click", (e: MouseEvent): void => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Hamburger Mini game 1 clicked");

            if (!minigame1Modal) return;
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
        menuMinigame2.addEventListener("click", (e: MouseEvent): void => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Hamburger Mini game 2 clicked");

            if (!minigame2Modal) return;
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
        topMinigame1.addEventListener("click", (e: MouseEvent): void => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Top Matching Game button clicked");

            if (!minigame1Modal) return;
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
        topMinigame2.addEventListener("click", (e: MouseEvent): void => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Top Timeline Game button clicked");

            if (!minigame2Modal) return;
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
    closeButtons.forEach((button: HTMLButtonElement): void => {
        button.addEventListener("click", function (this: HTMLButtonElement, e: MouseEvent): void {
            e.stopPropagation();
            e.preventDefault();
            const modalId = this.getAttribute("data-modal");
            if (modalId) {
                const modal = document.getElementById(modalId) as HTMLDivElement | null;
                if (modal) {
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
    const modals: HTMLDivElement[] = [minigame1Modal, minigame2Modal];
    modals.forEach((modal: HTMLDivElement): void => {
        modal.addEventListener("click", (event: MouseEvent): void => {
            if (event.target === modal) {
                modal.classList.remove("active");
            }
        });
    });

    // Escape closes modals
    document.addEventListener("keydown", (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
            minigame1Modal.classList.remove("active");
            minigame2Modal.classList.remove("active");
        }
    });

    console.log("Menu: Initialization complete!");
}
