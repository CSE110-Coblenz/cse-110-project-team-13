// menu.ts - Hamburger Menu Module
// Provides navigation menu with Back to Start and Mini Game options
import { MatchingGame } from "./matching-game.js";
import { TimelineGame } from "./timeline-game.js";

let mg1: MatchingGame | null = null;
let mg2: TimelineGame | null = null;

export function initializeMenu(): void {
    console.log('Initializing menu...');
    
    // Get all required DOM elements with type assertions
    const menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement | null;
    const menuNav = document.getElementById('menu-nav') as HTMLElement | null;
    const menuHome = document.getElementById('menu-home') as HTMLButtonElement | null;
    const menuMinigame1 = document.getElementById('menu-minigame1') as HTMLButtonElement | null;
    const menuMinigame2 = document.getElementById('menu-minigame2') as HTMLButtonElement | null;
    
    const minigame1Modal = document.getElementById('minigame1-modal') as HTMLDivElement | null;
    const minigame2Modal = document.getElementById('minigame2-modal') as HTMLDivElement | null;
    const closeButtons = document.querySelectorAll('.close-modal') as NodeListOf<HTMLButtonElement>;

    // Validate all required elements exist
    if (!menuToggle || !menuNav || !menuHome || !menuMinigame1 || !menuMinigame2 || !minigame1Modal || !minigame2Modal) {
        console.error('Menu: Required DOM elements not found');
        if (!menuToggle) console.error('  - menuToggle not found');
        if (!menuNav) console.error('  - menuNav not found');
        if (!menuHome) console.error('  - menuHome not found');
        if (!menuMinigame1) console.error('  - menuMinigame1 not found');
        if (!menuMinigame2) console.error('  - menuMinigame2 not found');
        if (!minigame1Modal) console.error('  - minigame1Modal not found');
        if (!minigame2Modal) console.error('  - minigame2Modal not found');
        return;
    }

    console.log('Menu: All elements found, setting up event listeners...');

    // Toggle menu visibility on hamburger click
    menuToggle.addEventListener('click', (e: MouseEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        console.log('Menu toggle clicked');
        menuToggle.classList.toggle('active');
        menuNav.classList.toggle('menu-hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event: MouseEvent): void => {
        const target = event.target as HTMLElement;
        if (!menuToggle.contains(target) && !menuNav.contains(target)) {
            menuToggle.classList.remove('active');
            menuNav.classList.add('menu-hidden');
        }
    });

    // Menu Option 1: Back to Start
    menuHome.addEventListener('click', (e: MouseEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        console.log('Back to start clicked');
        
        const gameScreen = document.getElementById('game-screen') as HTMLDivElement;
        const startScreen = document.getElementById('start-screen') as HTMLDivElement;
        
        if (gameScreen && startScreen) {
            gameScreen.style.display = 'none';
            startScreen.style.display = 'flex';
        }
        
        // Close menu after action
        menuToggle.classList.remove('active');
        menuNav.classList.add('menu-hidden');
    });

    // Menu Option 2: Open Mini Game 1
    menuMinigame1.addEventListener('click', (e: MouseEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        console.log('Mini game 1 clicked');
        minigame1Modal.classList.add('active');
        mg1 = new MatchingGame();
        // Close menu after action
        menuToggle.classList.remove('active');
        menuNav.classList.add('menu-hidden');
    });

    // Menu Option 3: Open Mini Game 2
    menuMinigame2.addEventListener('click', (e: MouseEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        console.log('Mini game 2 clicked');
        minigame2Modal.classList.add('active');
        

         // Create timeline game instance and store it so we can destroy it later
        if (mg2) {
            mg2.destroy();
            mg2 = null;
        }
        mg2 = new TimelineGame(); // loads events.json automatically

        // Close menu after action
        menuToggle.classList.remove('active');
        menuNav.classList.add('menu-hidden');
    });

    // Close modal buttons
    closeButtons.forEach((button: HTMLButtonElement): void => {
        button.addEventListener('click', function(this: HTMLButtonElement, e: MouseEvent): void {
            e.stopPropagation();
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                const modal = document.getElementById(modalId) as HTMLDivElement | null;
                if (modal) {
                    modal.classList.remove('active');
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

    // Close modal when clicking outside the content
    const modals: HTMLDivElement[] = [minigame1Modal, minigame2Modal];
    modals.forEach((modal: HTMLDivElement): void => {
        modal.addEventListener('click', (event: MouseEvent): void => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            minigame1Modal.classList.remove('active');
            minigame2Modal.classList.remove('active');
        }
    });

    console.log('Menu: Initialization complete!');
}
