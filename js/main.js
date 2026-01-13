/**
 * Main Application Entry Point
 */
import { initHeaderScroll, initMobileMenu, initScrollAnimations, initCounterAnimations, initFaqAccordions } from './ui.js';
import { initContactForm } from './contact.js';
import { initFavoriteButtons } from './properties.js';
import { fetchFeaturedProperties } from './api.js';
import { renderPropertyCard } from './properties.js';

// Page specific modules
import { initListingsPage } from './pages/listings.js';
import { initPropertyDetailsPage } from './pages/property-details.js';

// SEO & Performance Helpers
function initPerformanceHooks() {
    // Add progress bar for page load simulation
    const progress = document.createElement('div');
    progress.className = 'page-load-progress';
    document.body.appendChild(progress);

    setTimeout(() => progress.style.width = '100%', 100);
    setTimeout(() => progress.remove(), 1000);
}

function initSEOHooks() {
    // Check for property page to inject structured data
    const path = window.location.pathname;
    if (path.includes('property.html')) {
        const title = document.getElementById('propertyTitle')?.textContent || 'Property';
        const price = document.getElementById('propertyPrice')?.textContent || '';

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "RealEstateListing",
            "name": title,
            "price": price,
            "url": window.location.href
        });
        document.head.appendChild(script);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // Basic UI Init (Always runs)
    initHeaderScroll();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimations();
    initFaqAccordions();
    initFavoriteButtons();
    initContactForm();
    initPerformanceHooks();
    initSEOHooks();

    const path = window.location.pathname;

    // Homepage Logic
    if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
        const propertyGrid = document.getElementById('propertyGrid');
        if (propertyGrid) {
            try {
                const properties = await fetchFeaturedProperties(3);
                if (properties && properties.length > 0) {
                    propertyGrid.innerHTML = properties.map((p, i) => renderPropertyCard(p, i)).join('');
                    initScrollAnimations();
                }
            } catch (error) {
                console.log('Homepage: Using fallback static content');
            }
        }
    }

    // Listings Page Logic
    if (path.includes('listings.html')) {
        initListingsPage();
    }

    // Property Detail Page Logic
    if (path.includes('property.html')) {
        initPropertyDetailsPage();
    }
});
