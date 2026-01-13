export const CONFIG = {
    STRAPI_URL: window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? 'http://127.0.0.1:1337'
        : window.location.origin,
    API_TOKEN: '',
};
