declare const L: any;  // L exists globally
import { isDragging, isImageLockedInPlace } from "./image.js";

export let map: any = null;
export let marker: any = null;

function adjustMapBoundsToScreen() {
    const bounds = L.latLngBounds([[-85, -180], [85, 180]]);
    if (map) {
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 2 });
        map.setMaxBounds(bounds);
        map.invalidateSize();
    }
}

export function initMap(containerId: string): void {
    if (map) return;

    map = L.map(containerId, {
        minZoom: 3,
        worldCopyJump: false
    }).setView([20, 0], 2);

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: "Tiles &copy; Esri — Sources: Esri, USGS, NOAA",
        noWrap: true
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
        console.log('Clicked:', e.latlng);

        if (!marker) {
            marker = L.marker(e.latlng).addTo(map);
        } else {
            marker.setLatLng(e.latlng);
        }
    });

    // Initial bounds adjustment for responsiveness
    adjustMapBoundsToScreen();

    // Responsive to window resizing
    window.addEventListener("resize", adjustMapBoundsToScreen);
}