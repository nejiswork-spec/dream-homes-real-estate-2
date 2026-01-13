/**
 * DreamHomes - Strapi API Integration
 * This file handles all communication with the Strapi CMS backend
 */

// Configuration - Update these for production
const CONFIG = {
    STRAPI_URL: 'https://dream-homes-real-estate-2-production.up.railway.app',
    API_TOKEN: '', // Optional: Add if using authenticated requests
};

// ============================================
// API Helper Functions
// ============================================

async function strapiRequest(endpoint, options = {}) {
    const url = `${CONFIG.STRAPI_URL}/api${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
    };

    if (CONFIG.API_TOKEN) {
        headers['Authorization'] = `Bearer ${CONFIG.API_TOKEN}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: { ...headers, ...options.headers },
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            console.error('Strapi API Response Error:', errorBody);
            throw new Error(`API Error: ${response.status} - ${errorBody.error?.message || response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Strapi Request Failed:', error);
        throw error;
    }
}

// ============================================
// Properties API
// ============================================

/**
 * Fetch all properties with optional filters
 * @param {Object} filters - Optional filters { city, type, priceRange, beds }
 * @returns {Promise<Array>} Array of properties
 */
async function fetchProperties(filters = {}) {
    let query = '/properties?populate=*';

    // Add filters
    if (filters.city) {
        query += `&filters[city][$eq]=${filters.city}`;
    }
    if (filters.type) {
        query += `&filters[type][$eq]=${filters.type}`;
    }
    if (filters.featured) {
        query += `&filters[featured][$eq]=true`;
    }
    if (filters.beds) {
        query += `&filters[bedrooms][$gte]=${filters.beds}`;
    }

    // Add sorting
    query += '&sort=createdAt:desc';

    const data = await strapiRequest(query);
    return transformProperties(data.data);
}

/**
 * Fetch single property by ID or slug
 * @param {string|number} identifier - Property ID or slug
 * @returns {Promise<Object>} Property object
 */
async function fetchPropertyById(identifier) {
    const data = await strapiRequest(`/properties/${identifier}?populate=*`);
    return transformProperty(data.data);
}

/**
 * Fetch featured properties for homepage
 * @param {number} limit - Number of properties to fetch
 * @returns {Promise<Array>} Array of featured properties
 */
async function fetchFeaturedProperties(limit = 3) {
    const query = `/properties?populate=*&filters[featured][$eq]=true&pagination[limit]=${limit}&sort=createdAt:desc`;
    const data = await strapiRequest(query);
    return transformProperties(data.data);
}

// Transform Strapi response to frontend format
function transformProperties(strapiData) {
    if (!strapiData) return [];
    return strapiData.map(transformProperty);
}

function transformProperty(item) {
    // Handle both Strapi 5 (flat) and Strapi 4 (attributes) formats
    const attrs = item.attributes || item;

    // Handle images safely
    let imageUrl = 'images/villa.png';
    let galleryUrls = [];

    if (attrs.images && Array.isArray(attrs.images) && attrs.images.length > 0) {
        // Strapi 5 array
        imageUrl = `${CONFIG.STRAPI_URL}${attrs.images[0].url}`;
        galleryUrls = attrs.images.map(img => `${CONFIG.STRAPI_URL}${img.url}`);
    } else if (attrs.image?.data?.attributes?.url) {
        // Strapi 4
        imageUrl = `${CONFIG.STRAPI_URL}${attrs.image.data.attributes.url}`;
    }

    return {
        id: item.id || item.documentId,
        title: attrs.title,
        description: attrs.description,
        price: attrs.price, // Schema uses 'price' string
        location: attrs.location,
        type: attrs.property_type || attrs.type, // Adjusted for your schema change
        beds: attrs.bedrooms,
        baths: attrs.bathrooms,
        area: attrs.area,
        image: imageUrl,
        gallery: galleryUrls,
        badge: attrs.listing_status === 'for-sale' ? 'For Sale' : attrs.listing_status,
        featured: attrs.featured,
        amenities: typeof attrs.amenities === 'string' ? attrs.amenities.split(',').map(s => s.trim()) : (attrs.amenities || []),
        agent: null // Simplify for now to avoid errors if agent isn't populated
    };
}

// ============================================
// Testimonials API
// ============================================

/**
 * Fetch all testimonials
 * @returns {Promise<Array>} Array of testimonials
 */
async function fetchTestimonials() {
    try {
        const data = await strapiRequest('/testimonials?populate=*&sort=createdAt:desc');
        const items = data.data || [];

        return items.map(item => {
            const attrs = item.attributes || item;
            let photoUrl = 'https://randomuser.me/api/portraits/men/1.jpg';

            if (attrs.photo && attrs.photo.url) {
                photoUrl = `${CONFIG.STRAPI_URL}${attrs.photo.url}`;
            } else if (attrs.photo?.data?.attributes?.url) {
                photoUrl = `${CONFIG.STRAPI_URL}${attrs.photo.data.attributes.url}`;
            }

            return {
                id: item.id,
                quote: attrs.quote,
                name: attrs.clientName,
                location: attrs.location, // Schema uses 'location'
                image: photoUrl,
                rating: attrs.rating,
            };
        });
    } catch (e) {
        console.error("Error fetching testimonials", e);
        return [];
    }
}

// ============================================
// Agents API
// ============================================

/**
 * Fetch all agents
 * @returns {Promise<Array>} Array of agents
 */
async function fetchAgents() {
    try {
        const data = await strapiRequest('/agents?populate=*');
        const items = data.data || [];

        return items.map(item => {
            const attrs = item.attributes || item;
            let photoUrl = null;

            if (attrs.photo && attrs.photo.url) {
                photoUrl = `${CONFIG.STRAPI_URL}${attrs.photo.url}`;
            } else if (attrs.photo?.data?.attributes?.url) {
                photoUrl = `${CONFIG.STRAPI_URL}${attrs.photo.data.attributes.url}`;
            }

            return {
                id: item.id,
                name: attrs.name,
                email: attrs.email,
                phone: attrs.phone,
                photo: photoUrl,
            };
        });
    } catch (e) {
        console.error("Error fetching agents", e);
        return [];
    }
}

// ============================================
// Contact/Inquiry API
// ============================================

/**
 * Submit contact form inquiry to Strapi
 * @param {Object} formData - Form data object
 * @returns {Promise<Object>} Response from Strapi
 */
async function submitInquiry(formData) {
    // Only send what the schema definitely has: name, email, phone, message
    const payload = {
        data: {
            name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Anonymous',
            email: formData.email,
            phone: formData.phone || '',
            message: formData.message || 'No message provided'
        }
    };

    // If there's property interest, add it to the message or the interest field
    if (formData.subject || formData.propertyId) {
        const interest = formData.propertyId ? `Property ID: ${formData.propertyId}` : formData.subject;
        payload.data.property_interest = interest;
    }

    const result = await strapiRequest('/inquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    return { success: true, data: result.data };
}

// ============================================
// Initialize Dynamic Content
// ============================================

/**
 * Initialize the page with content from Strapi
 * Call this function when using Strapi backend
 */
async function initStrapiContent() {
    try {
        // Check if Strapi is available
        const health = await fetch(`${CONFIG.STRAPI_URL}/_health`);
        if (!health.ok) {
            console.log('Strapi not available, using static content');
            return false;
        }

        console.log('Strapi connected, loading dynamic content...');

        // Load properties on listings page
        if (document.getElementById('propertyGrid')) {
            const properties = await fetchProperties();
            renderProperties(properties);
        }

        // Load featured properties on homepage
        if (document.querySelector('.featured')) {
            const featured = await fetchFeaturedProperties(3);
            renderFeaturedProperties(featured);
        }

        // Load testimonials
        if (document.querySelector('.testimonial-slider')) {
            const testimonials = await fetchTestimonials();
            if (testimonials.length > 0) {
                initDynamicTestimonials(testimonials);
            }
        }

        return true;
    } catch (error) {
        console.log('Using static content (Strapi unavailable):', error.message);
        return false;
    }
}

// Render properties from Strapi data
function renderProperties(properties) {
    const grid = document.getElementById('propertyGrid');
    if (!grid || properties.length === 0) return;

    grid.innerHTML = properties.map((p, index) => `
    <div class="property-card animate-on-scroll ${index > 0 ? 'delay-' + (index % 3) : ''}" 
         data-price="${p.priceValue < 100000000 ? 'low' : p.priceValue < 300000000 ? 'mid' : 'high'}"
         data-location="${p.city}" 
         data-type="${p.type}" 
         data-beds="${p.beds}">
      <div class="property-image">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        ${p.badge ? `<span class="property-badge">${p.badge}</span>` : ''}
        <button class="property-favorite" onclick="toggleFavorite(this)" aria-label="Add to favorites">
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
          <div class="property-price">${p.price}</div>
          <a href="property.html?id=${p.id}" class="btn btn-outline">View Details</a>
        </div>
      </div>
    </div>
  `).join('');

    // Re-initialize animations
    initScrollAnimations();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchProperties,
        fetchPropertyById,
        fetchFeaturedProperties,
        fetchTestimonials,
        fetchAgents,
        submitInquiry,
        initStrapiContent,
    };
}

// Auto-initialize if Strapi is configured
// Uncomment the line below when Strapi is set up
// document.addEventListener('DOMContentLoaded', initStrapiContent);

console.log('Strapi API module loaded. To enable, call initStrapiContent()');
