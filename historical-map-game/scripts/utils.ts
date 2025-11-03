// Game constants and configuration
// 1. GAME CONFIGURATION (needed by everyone)
export const GAME_CONFIG = {
    TOTAL_QUESTIONS: 10, // update it later to 30
    SCORING: {
        PERFECT_GUESS: 100,
        MAX_DISTANCE_KM: 10000,
        DISTANCE_THRESHOLD: 500
    }
};

// 2. MAP CONFIGURATION (needed by map.js)
export const MAP_CONFIG = {
    MIN_ZOOM: 2,
    MAX_ZOOM: 6,
    DEFAULT_CENTER: [20, 0],
    DEFAULT_ZOOM: 2
};

// 3. SCREEN CONSTANTS (needed by ui.js)
export const SCREENS = {
    MENU: 'menu',
    GAME: 'game',
    RESULTS: 'results'
};

// // 4. CORE UTILITY FUNCTIONS (needed by multiple files)
// export function getDistance(lat1, lon1, lat2, lon2) {
//     // Calculate distance between two coordinates in km
// }

// export function shuffleArray(array) {
//     // Randomize array order for events
// }

// export function clamp(value, min, max) {
//     // Keep value within bounds
// }