---
description: Deploy the DreamHomes website
---

# Deploy Guidelines

## Static Deployment (Frontend Only)

1.  **Netlify / Vercel**:
    *   Drag and drop the `Web Dev` folder to Netlify Drop or import via GitHub on Vercel.
    *   Ensure the build command is empty (it's static HTML/CSS/JS).
    *   Publish directory is `./` (root).

2.  **GitHub Pages**:
    *   Push the code to a GitHub repository.
    *   Go to Settings > Pages.
    *   Select `main` branch and `/root` folder.

## Full Stack Deployment (With Strapi)

1.  **Backend (Strapi)**:
    *   Follow instructions in `backend/README.md`.
    *   Deploy Strapi to Heroku, Railway, or DigitalOcean App Platform.
    *   Update `strapi-api.js` with your production Strapi URL.

2.  **Frontend**:
    *   Deploy the frontend as above.
    *   Update `script.js` to enable dynamic content fetching (uncomment `initStrapiContent()` call).

## Post-Deployment Checklist

- [ ] Verify Contact Form (EmailJS)
- [ ] Check WhatsApp link works on mobile
- [ ] verify Google Analytics firing
- [ ] Test Cookie Consent persistence
