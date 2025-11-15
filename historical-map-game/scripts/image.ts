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
let dragStartX = 0;
let dragStartY = 0;
let hasMoved = false;

export function isImageLockedInPlace(): boolean {
  return isImageLocked;
}

// Flip image to show hint
export function toggleHint(e: Event) {
  e.stopPropagation();
  e.preventDefault();
  console.log('Toggle hint clicked');
  imageCard.classList.toggle("flipped");
  console.log('Card classes:', imageCard.className);
}

// Maximize/Minimize image
// Maximize/Minimize image
export function toggleMaximize(e: Event) {
  e.stopPropagation();
  e.preventDefault();
  console.log('Toggle maximize clicked, current state:', isMaximized);
  
  isMaximized = !isMaximized;
  imageContainer.classList.toggle("image-maximized");
  imageContainer.classList.toggle("image-minimized");
  
  if (isMaximized) {
    maximizeButton.textContent = "✕";
    imageContainer.style.transform = "";
    
    // Center the image on the screen when maximizing
    const rect = imageContainer.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const centerLeft = (viewportWidth - rect.width) / 2;
    const centerTop = (viewportHeight - rect.height) / 2;
    
    imageContainer.style.left = `${centerLeft}px`;
    imageContainer.style.top = `${centerTop}px`;
    imageContainer.style.position = "absolute";
    
    console.log('Image maximized and centered');
  } else {
    maximizeButton.textContent = "🔍";
    console.log('Image minimized');
  }
}

function dragStart(e: PointerEvent) {
  // Don't start drag if clicking on buttons
  const target = e.target as HTMLElement;
  if (target.closest('#hint-button') || target.closest('#maximize-button')) {
    console.log('Click on button, not dragging');
    return;
  }

  console.log('Drag start');
  isPointerDown = true;
  hasMoved = false;
  isImageLocked = false;

  // Store starting position
  dragStartX = e.clientX;
  dragStartY = e.clientY;

  if (map) map.dragging.disable();

  const rect = imageContainer.getBoundingClientRect();
  // Calculate offset from the current position
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  
  imageContainer.setPointerCapture(e.pointerId);
  imageContainer.style.cursor = "grabbing";
}

function dragMove(e: PointerEvent) {
  if (!isPointerDown) return;

  // Calculate distance moved
  const moveX = Math.abs(e.clientX - dragStartX);
  const moveY = Math.abs(e.clientY - dragStartY);

  // Only start dragging if moved more than 5 pixels
  if (moveX > 5 || moveY > 5) {
    hasMoved = true;
    isDragging = true;
  }

  if (!hasMoved) return;

  // Calculate new position
  const left = e.clientX - offsetX;
  const top = e.clientY - offsetY;
  
  imageContainer.style.position = "absolute";
  imageContainer.style.left = `${left}px`;
  imageContainer.style.top = `${top}px`;
}

function dragEnd(e: PointerEvent) {
  if (!isPointerDown) return;
  
  console.log('Drag end, hasMoved:', hasMoved);
  isPointerDown = false;
  imageContainer.style.cursor = "grab";
  
  setTimeout(() => {
    isDragging = false;
    if (hasMoved) {
      isImageLocked = true;
    }
    hasMoved = false;
  }, 100);

  if (map) map.dragging.enable();

  try {
    imageContainer.releasePointerCapture(e.pointerId);
  } catch (e) {
    // Ignore if pointer capture wasn't set
  }
}

export function initializeDragging() {
  imageContainer.addEventListener("pointerdown", dragStart);
  document.addEventListener("pointermove", dragMove);
  document.addEventListener("pointerup", dragEnd);
  console.log('Dragging initialized');
}

// Set image source and hint
export function loadHistoricalImage(imageSrc: string, hint: string) {
  historicalImage.src = imageSrc;
  hintText.textContent = hint;
  console.log('Image loaded:', imageSrc);
}

// Event listeners for buttons
hintButton.addEventListener("click", (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  toggleHint(e);
});

maximizeButton.addEventListener("click", (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  toggleMaximize(e);
});

console.log('Image.ts loaded successfully');
