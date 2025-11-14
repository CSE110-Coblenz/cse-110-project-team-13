declare const L: any;  // L exists globally

export let map: any = null;
export let marker: any = null;


export function initMap(containerId: string): void {
    if (map) return;
    map = L.map(containerId, {
      minZoom: 3,
      worldCopyJump: false,
      maxBounds: [[-85, -180], [85, 200]]
    }).setView([20, 0], 2);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri — Sources: Esri, USGS, NOAA"
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