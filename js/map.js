/**
 * Map utility module using Leaflet.js
 */

export function initOverviewMap(containerId, properties) {
    if (!window.L || !document.getElementById(containerId)) return;

    // Default center for Nigeria
    const nigeriaCenter = [9.0820, 8.6753];
    const map = L.map(containerId).setView(nigeriaCenter, 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const bounds = [];

    properties.forEach(p => {
        // Fallback coord logic: If no lat/long provided, generate stable pseudo-coords based on ID and City
        const lat = p.latitude || (6.5244 + (Math.sin(p.id) * 0.1));
        const lng = p.longitude || (3.3792 + (Math.cos(p.id) * 0.1));
        const coord = [lat, lng];

        const marker = L.marker(coord).addTo(map);
        marker.bindPopup(`
            <div style="width: 150px;">
                <img src="${p.image}" style="width:100%; border-radius: 8px; margin-bottom: 8px;">
                <h4 style="margin:0; font-size:14px;">${p.title}</h4>
                <p style="margin:4px 0; color: #66748b;">${p.price}</p>
                <a href="property.html?id=${p.id}" style="font-size:12px; color: #2563eb; text-decoration: none; font-weight:600;">View Details</a>
            </div>
        `);
        bounds.push(coord);
    });

    if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

export function initPropertyMap(containerId, property) {
    if (!window.L || !document.getElementById(containerId)) return;

    const lat = property.latitude || 6.5244;
    const lng = property.longitude || 3.3792;
    const coord = [lat, lng];

    const map = L.map(containerId).setView(coord, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker(coord).addTo(map);
    marker.bindPopup(`<strong>${property.title}</strong><br>${property.location}`).openPopup();
}
