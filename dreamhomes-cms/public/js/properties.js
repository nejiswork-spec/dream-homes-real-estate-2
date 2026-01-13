/**
 * Property Handling and Rendering
 */
import { showToast } from './ui.js';

export function renderPropertyCard(p, index) {
    return `
    <div class="property-card animate-on-scroll ${index > 0 ? 'delay-' + (index % 3) : ''}" 
         data-price="${p.priceValue < 100000000 ? 'low' : p.priceValue < 300000000 ? 'mid' : 'high'}"
         data-location="${p.location.toLowerCase()}" 
         data-type="${p.type}" 
         data-beds="${p.beds}">
      <div class="property-image">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        ${p.badge ? `<span class="property-badge">${p.badge}</span>` : ''}
        <button class="property-favorite" data-id="${p.id}" aria-label="Add to favorites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="property-content">
        <div class="property-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          ${p.location}
        </div>
        <h4 class="property-title">${p.title}</h4>
        <div class="property-features">
          <div class="property-feature">🛏️ ${p.beds} Beds</div>
          <div class="property-feature">🛁 ${p.baths} Baths</div>
          <div class="property-feature">📐 ${p.area}</div>
        </div>
        <div class="property-footer">
          <div class="property-price">₦${p.price}</div>
          <a href="property.html?id=${p.id}" class="btn btn-outline">View Details</a>
        </div>
      </div>
    </div>
  `;
}

export function initFavoriteButtons() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.property-favorite');
        if (!btn) return;

        btn.classList.toggle("active");
        const isFavorite = btn.classList.contains("active");
        const svg = btn.querySelector("svg");

        if (isFavorite) {
            svg.setAttribute("fill", "currentColor");
            showToast("Added to favorites!", "success");
        } else {
            svg.setAttribute("fill", "none");
            showToast("Removed from favorites", "info");
        }

        // Optional: Save to localStorage
        const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
        const id = btn.dataset.id;
        if (isFavorite && !favs.includes(id)) favs.push(id);
        else if (!isFavorite) {
            const index = favs.indexOf(id);
            if (index > -1) favs.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(favs));
    });
}
