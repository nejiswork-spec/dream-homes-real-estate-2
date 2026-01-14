/**
 * Listings Page Logic
 */
import { fetchProperties, fetchMetadata } from '../api.js';
import { renderPropertyCard } from '../properties.js';
import { initScrollAnimations } from '../ui.js';
import { initOverviewMap } from '../map.js';

export async function initListingsPage() {
    const propertyGrid = document.getElementById('propertyGrid');
    const filterForm = document.getElementById('filterForm');
    const propertyCount = document.getElementById('propertyCount');
    const noResults = document.getElementById('noResults');

    if (!propertyGrid) return;

    // Load Metadata for filters
    const populateFilters = async () => {
        const { cities, types } = await fetchMetadata();
        const citySelect = document.getElementById('locationFilter');
        const typeSelect = document.getElementById('typeFilter');

        if (citySelect && cities.length > 0) {
            citySelect.innerHTML = '<option value="">All Locations</option>' +
                cities.map(c => `<option value="${c.toLowerCase()}">${c}</option>`).join('');
        }
        if (typeSelect && types.length > 0) {
            typeSelect.innerHTML = '<option value="">All Types</option>' +
                types.map(t => `<option value="${t.toLowerCase()}">${t}</option>`).join('');
        }
    };

    populateFilters();

    // Load initial properties
    async function loadProperties(filters = {}) {
        try {
            propertyGrid.style.opacity = '0.5';
            const properties = await fetchProperties(filters);

            if (properties.length > 0) {
                propertyGrid.innerHTML = properties.map((p, i) => renderPropertyCard(p, i)).join('');
                propertyGrid.style.display = 'grid';
                noResults.style.display = 'none';
                if (propertyCount) propertyCount.textContent = properties.length;

                // Init Map
                initOverviewMap('overviewMap', properties);
            } else {
                propertyGrid.style.display = 'none';
                noResults.style.display = 'block';
                if (propertyCount) propertyCount.textContent = '0';
            }

            initScrollAnimations();
        } catch (error) {
            console.error('Failed to load properties', error);
        } finally {
            propertyGrid.style.opacity = '1';
        }
    }

    // Initial load
    loadProperties();

    // Setup filter listeners
    if (filterForm) {
        const applyBtn = filterForm.querySelector('.btn-primary');
        const resetBtn = filterForm.querySelector('.btn-outline');

        applyBtn.addEventListener('click', () => {
            const filters = {
                city: document.getElementById('locationFilter').value,
                type: document.getElementById('typeFilter').value,
                beds: document.getElementById('bedsFilter').value
            };
            loadProperties(filters);
        });

        resetBtn.addEventListener('click', () => {
            filterForm.reset();
            loadProperties();
        });
    }

    // Setup View Toggle
    const gridBtn = document.querySelector('.view-toggle button:first-child');
    const listBtn = document.querySelector('.view-toggle button:last-child');

    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', () => {
            propertyGrid.classList.remove('list-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        });

        listBtn.addEventListener('click', () => {
            propertyGrid.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        });
    }
}
