declare const L: any;  // L exists globally

export let map: any = null;
let marker: any = null;


export function initMap(containerId: string): void {
    if (map) return;
    map = L.map(containerId).setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
    
    map.on('click', (e: L.LeafletMouseEvent) => {
        console.log('Clicked:', e.latlng);
    
        if (!marker) {
          marker = L.marker(e.latlng).addTo(map);
        } else {
          marker.setLatLng(e.latlng);
        }
      });
      
}




