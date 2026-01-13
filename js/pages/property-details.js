/**
 * Property Details Page Logic
 */
import { fetchPropertyById } from '../api.js';
import { showToast } from '../ui.js';

export async function initPropertyDetailsPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) return;

    try {
        const p = await fetchPropertyById(id);
        if (p) {
            updateUI(p);
            setupShareButtons();
        }
    } catch (error) {
        console.error('Failed to load property details', error);
        showToast('Failed to load property details. Using fallback.', 'error');
    }
}

function updateUI(p) {
    document.getElementById('propertyTitle').textContent = p.title;
    document.getElementById('propertyLocation').innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg> ${p.location}`;
    document.getElementById('propertyPrice').textContent = p.price;
    document.getElementById('propertyDescription').textContent = p.description;
    document.getElementById('mainImage').src = p.image;
    document.getElementById('propertyBadge').textContent = p.badge || 'Available';

    const featuresHtml = `
        <div class="feature-box"><span class="feature-value">${p.beds}</span><span class="feature-label">Bedrooms</span></div>
        <div class="feature-box"><span class="feature-value">${p.baths}</span><span class="feature-label">Bathrooms</span></div>
        <div class="feature-box"><span class="feature-value">${p.area}</span><span class="feature-label">Area</span></div>
        <div class="feature-box"><span class="feature-value">${p.type}</span><span class="feature-label">Type</span></div>
    `;
    document.getElementById('propertyFeatures').innerHTML = featuresHtml;

    if (p.amenities && p.amenities.length > 0) {
        const amenitiesGrid = document.getElementById('amenitiesGrid');
        if (amenitiesGrid) {
            amenitiesGrid.innerHTML = p.amenities.map(a => `<div class="amenity-item">✓ ${a}</div>`).join('');
        }
    }

    document.title = `${p.title} - DreamHomes`;
}

function setupShareButtons() {
    const shareContainer = document.querySelector('.share-buttons');
    if (!shareContainer) return;

    const btns = shareContainer.querySelectorAll('.share-btn');
    const platforms = ['facebook', 'twitter', 'whatsapp', 'copy'];

    btns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            const platform = platforms[i];
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(document.getElementById('propertyTitle').textContent);

            if (platform === 'copy') {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!', 'success');
            } else {
                const links = {
                    facebook: `https://facebook.com/sharer/sharer.php?u=${url}`,
                    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
                    whatsapp: `https://wa.me/?text=${text}%20${url}`
                };
                window.open(links[platform], '_blank');
            }
        });
    });
}
