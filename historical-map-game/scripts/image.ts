export const imageContainer = document.getElementById("historical-image-container")!;
export const imageCard = document.getElementById("image-card")!;
export const hintButton = document.getElementById("hint-button")!;
export const maximizeButton = document.getElementById("maximize-button")!;
export const historicalImage = document.getElementById("historical-image") as HTMLImageElement;
export const hintText = document.getElementById("hint-text")!;

let isMaximized = false;
let isDragging = false;
let currentX: number;
let currentY: number;
let initialX: number;
let initialY: number;
let xOffset = 0;
let yOffset = 0;

// Flip image to show hint
export function toggleHint() {
    imageCard.classList.toggle("flipped");
}

// Maximize/Minimize image
export function toggleMaximize() {
    isMaximized = !isMaximized;
    imageContainer.classList.toggle("image-maximized");
    imageContainer.classList.toggle("image-minimized");
    
    if (isMaximized) {
        maximizeButton.textContent = "✕";
        // Reset position when maximized
        imageContainer.style.transform = "";
    } else {
        maximizeButton.textContent = "🔍";
    }
}

// Drag functionality
function dragStart(e: MouseEvent | TouchEvent) {
    if (e.type === "touchstart") {
        initialX = (e as TouchEvent).touches[0].clientX - xOffset;
        initialY = (e as TouchEvent).touches[0].clientY - yOffset;
    } else {
        initialX = (e as MouseEvent).clientX - xOffset;
        initialY = (e as MouseEvent).clientY - yOffset;
    }

    if (e.target === imageContainer || (e.target as HTMLElement).closest("#image-card")) {
        isDragging = true;
    }
}

function drag(e: MouseEvent | TouchEvent) {
    if (isDragging) {
        e.preventDefault();
        
        if (e.type === "touchmove") {
            currentX = (e as TouchEvent).touches[0].clientX - initialX;
            currentY = (e as TouchEvent).touches[0].clientY - initialY;
        } else {
            currentX = (e as MouseEvent).clientX - initialX;
            currentY = (e as MouseEvent).clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, imageContainer);
    }
}

function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

function setTranslate(xPos: number, yPos: number, el: HTMLElement) {
    if (!isMaximized) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
}

// Initialize drag listeners
export function initializeDragging() {
    imageContainer.addEventListener("mousedown", dragStart);
    imageContainer.addEventListener("touchstart", dragStart);
    
    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag);
    
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("touchend", dragEnd);
}

// Set image source and hint
export function loadHistoricalImage(imageSrc: string, hint: string) {
    historicalImage.src = imageSrc;
    hintText.textContent = hint;
}

// Event listeners
hintButton.addEventListener("click", toggleHint);
maximizeButton.addEventListener("click", toggleMaximize);
