declare const L: any;  // L exists globally
import { isDragging, isImageLockedInPlace } from "./image.js";


export let map: any = null;
export let marker: any = null;


export function initMap(containerId: string): void {
    if (map) return;
    
    map = L.map(containerId, {
      minZoom: 3,
      worldCopyJump: false,
      maxBounds: [[-85, -180], [85, 200]]
    }).setView([20, 0], 2);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
    
    map.on('click', (e: L.LeafletMouseEvent) => {
        if (isDragging || !isImageLockedInPlace()) 
          return; 

        console.log('Clicked:', e.latlng);
    
        if (!marker) {
          marker = L.marker(e.latlng).addTo(map);
        } else {
          marker.setLatLng(e.latlng);
        }
      });
      
}