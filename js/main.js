/**
 * Main Application Entry Point
 */
import {
    initHeaderScroll,
    initMobileMenu,
    initScrollAnimations,
    initCounterAnimations,
    initFaqAccordions,
    initCookieConsent,
    openPropertyModal,
    closePropertyModal
} from './ui.js';
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

    setTimeout(() => {
        if (progress) progress.style.width = '100%';
    }, 100);
    setTimeout(() => {
        if (progress) progress.remove();
    }, 1000);
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
    initCookieConsent();

    // Close Modal Logic
    const closeBtn = document.querySelector('.modal-close');
    const modalOverlay = document.getElementById('propertyModal');
    if (closeBtn) closeBtn.onclick = closePropertyModal;
    if (modalOverlay) {
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) closePropertyModal();
        };
    }

    // Register Service Worker for Offline Support
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('SW Registered'))
                .catch(err => console.log('SW Registration failed', err));
        });
    }

    const path = window.location.pathname;

    // Homepage Logic
    if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
        const propertyGrid = document.getElementById('propertyGrid');
        if (propertyGrid) {
            try {
                const properties = await fetchFeaturedProperties(3);
                if (properties && properties.length > 0) {
                    propertyGrid.innerHTML = properties.map((p, i) => renderPropertyCard(p, i)).join('');

                    // Attach Modal Trigger for Homepage only
                    propertyGrid.addEventListener('click', (e) => {
                        const viewDetailsBtn = e.target.closest('.btn-outline');

                        if (viewDetailsBtn) {
                            // Check if it's the specific view details button
                            e.preventDefault(); // Stop navigation to property.html for modal preview
                            const pId = viewDetailsBtn.getAttribute('href').split('id=')[1];
                            const pData = properties.find(p => (p.id == pId || p.documentId == pId));
                            if (pData) openPropertyModal(pData);
                        }
                    });

                    initScrollAnimations();
                }
            } catch (error) {
                console.log('Homepage: Using fallback static content', error);
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
