---
description: Perform a health check and sync properties with Strapi
---

### Smart Development Sync

This workflow ensures your modularized frontend is correctly talking to Strapi and that all property types are accounted for.

// turbo
1. Check Strapi Health
   `curl http://localhost:1337/_health`

2. Verify API Module Consistency
   Check if `js/api.js` has the correct `STRAPI_URL` set in `js/config.js`.

3. Static to Dynamic Transition
   Ensure that any hardcoded properties in `js/properties.js` are matched by items in the Strapi "Property" collection.

4. Run Linting / Syntax Check
   `npx -y eslint js/**/*.js`

---

**Next Steps**: 
- If healthy, proceed to `npm run build` (if using a build step later).
- If unhealthy, check your Strapi terminal for errors.
