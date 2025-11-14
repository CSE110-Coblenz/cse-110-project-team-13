export const imageContainer = document.getElementById("historical-image-container")!;
export const imageCard = document.getElementById("image-card")!;
export const hintButton = document.getElementById("hint-button")!;
export const maximizeButton = document.getElementById("maximize-button")!;
export const historicalImage = document.getElementById("historical-image") as HTMLImageElement;
export const hintText = document.getElementById("hint-text")!;

export let isDragging = false;
let isImageLocked = false;

import { map } from "./map.js";

let isMaximized = false;
let isPointerDown = false;
let offsetX = 0;
let offsetY = 0;

export function isImageLockedInPlace(): boolean {
  return isImageLocked;
}

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

function dragStart(e: PointerEvent) {
    isDragging = true;
    isPointerDown = true;
    isImageLocked = false;

    if (map) map.dragging.disable();


    const rect = imageContainer.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    imageContainer.setPointerCapture(e.pointerId);
}

function dragMove(e: PointerEvent) {
    if (!isPointerDown) return;

    const left = e.clientX - offsetX;
    const top = e.clientY - offsetY;

    imageContainer.style.position = "absolute";
    imageContainer.style.left = `${left}px`;
    imageContainer.style.top = `${top}px`;
}


function dragEnd(e: PointerEvent) {
   if (!isPointerDown) return;

    isPointerDown = false;
    isDragging = false;

    setTimeout(() => {
    isDragging = false;

    // Lock the image after drag completes
    // 100ms delay to prevent race condition with map click
    isImageLocked = true; 
    }, 100); 
  
  if (map) map.dragging.enable();
  imageContainer.releasePointerCapture(e.pointerId);
  
}

export function initializeDragging() {
    imageContainer.addEventListener("pointerdown", dragStart);
    document.addEventListener("pointermove", dragMove);
    document.addEventListener("pointerup", dragEnd);
}
// Set image source and hint
export function loadHistoricalImage(imageSrc: string, hint: string) {
    historicalImage.src = imageSrc;
    hintText.textContent = hint;
}

// Event listeners
hintButton.addEventListener("click", toggleHint);
maximizeButton.addEventListener("click", toggleMaximize);
