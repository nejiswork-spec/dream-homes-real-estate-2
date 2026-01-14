import { CONFIG } from './config.js';

export async function strapiRequest(endpoint, options = {}) {
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

export async function fetchProperties(filters = {}) {
    let query = '/properties?populate=*';

    if (filters.city) query += `&filters[city][$eq]=${filters.city}`;
    if (filters.type) query += `&filters[type][$eq]=${filters.type}`;
    if (filters.featured) query += `&filters[featured][$eq]=true`;
    if (filters.beds) query += `&filters[bedrooms][$gte]=${filters.beds}`;

    query += '&sort=createdAt:desc';

    const data = await strapiRequest(query);
    return transformProperties(data.data);
}

export async function fetchPropertyById(identifier) {
    const data = await strapiRequest(`/properties/${identifier}?populate=*`);
    return transformProperty(data.data);
}

export async function fetchFeaturedProperties(limit = 3) {
    const query = `/properties?populate=*&filters[featured][$eq]=true&pagination[limit]=${limit}&sort=createdAt:desc`;
    const data = await strapiRequest(query);
    return transformProperties(data.data);
}

function transformProperties(strapiData) {
    if (!strapiData) return [];
    return strapiData.map(transformProperty);
}

function transformProperty(item) {
    const attrs = item.attributes || item;
    let imageUrl = 'images/villa.png';
    let galleryUrls = [];

    if (attrs.images && Array.isArray(attrs.images) && attrs.images.length > 0) {
        imageUrl = `${CONFIG.STRAPI_URL}${attrs.images[0].url}`;
        galleryUrls = attrs.images.map(img => `${CONFIG.STRAPI_URL}${img.url}`);
    } else if (attrs.image?.data?.attributes?.url) {
        imageUrl = `${CONFIG.STRAPI_URL}${attrs.image.data.attributes.url}`;
    }

    return {
        id: item.id || item.documentId,
        title: attrs.title,
        description: attrs.description,
        price: attrs.price,
        location: attrs.location,
        type: attrs.property_type || attrs.type,
        beds: attrs.bedrooms,
        baths: attrs.bathrooms,
        area: attrs.area,
        image: imageUrl,
        gallery: galleryUrls,
        badge: attrs.listing_status === 'for-sale' ? 'For Sale' : attrs.listing_status,
        featured: attrs.featured,
        amenities: typeof attrs.amenities === 'string' ? attrs.amenities.split(',').map(s => s.trim()) : (attrs.amenities || []),
        agent: null
    };
}

export async function submitInquiry(formData) {
    // Using Formspree as requested by the user
    // The first time this is submitted, Formspree will send an activation email to nejiswork@gmail.com
    const formspreeUrl = 'https://formspree.io/f/nejiswork@gmail.com';

    const payload = {
        name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Anonymous',
        email: formData.email,
        phone: formData.phone || '',
        message: formData.message || 'No message provided',
        _subject: formData.subject || `DreamHomes Inquiry: ${formData.firstName || 'New Lead'}`,
        property_id: formData.propertyId || 'General Inquiry',
        recaptcha_token: formData.recaptchaToken || ''
    };

    const response = await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message via Formspree');
    }

    return { success: true };
}

export async function fetchMetadata() {
    try {
        const properties = await fetchProperties();
        const cities = [...new Set(properties.map(p => p.location.split(',').pop().trim()))];
        const types = [...new Set(properties.map(p => p.type))];
        return { cities, types };
    } catch (e) {
        return { cities: [], types: [] };
    }
}
