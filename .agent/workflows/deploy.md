---
description: Deploy the DreamHomes website (Railway for Strapi, Vercel for Frontend)
---

### 🚀 Production Deployment Workflow

Follow these steps to deploy the decoupled architecture.

#### Part 1: Strapi CMS (Railway)
1. **Prepare Repository**: Ensure your project is pushed to GitHub.
2. **Connect Railway**: Login to [Railway.app](https://railway.app) and create a "New Project".
3. **Select Repository**: Search for your `DreamHomes` repo.
4. **Subdirectory**: Set the root directory for this service to `dreamhomes-cms`.
5. **PostgreSQL**: Railway will prompt to add a database. Add **PostgreSQL**.
6. **Env Vars**: Railway automatically maps variables, but ensure these are set:
   - `DATABASE_URL`: (Mapped from PostgreSQL)
   - `APP_KEYS`: (Generate 4 random strings)
   - `API_TOKEN_SALT`: (Random string)
   - `ADMIN_JWT_SECRET`: (Random string)
   - `TRANSFER_TOKEN_SALT`: (Random string)
   - `JWT_SECRET`: (Random string)
   - `NODE_ENV`: `production`

#### Part 2: Frontend (Vercel)
1. **Connect Vercel**: Login to [Vercel.com](https://vercel.com) and click "Add New" > "Project".
2. **Select Repository**: Select the same `DreamHomes` repo.
3. **Framework Preset**: Select **Other** or **Vanilla HTML**.
4. **Ignored Files**: Ensure `dreamhomes-cms` folder is NOT being built as part of the frontend. (Vercel handles this by ignoring non-static files if you select the root).
5. **Final Step**: Copy the Vercel URL (e.g., `dreamhomes.vercel.app`).

#### Part 3: Connect the Two
1. **Update Strapi CORS**: In Railway, add an Env Var `CORS_ORIGIN` and set it to your Vercel URL.
2. **Update Frontend Config**: 
   - Locally, the `js/config.js` is already dynamic. 
   - However, for production, make sure you don't have to manually edit files. The current logic in `js/config.js` will fallback to the current origin if not localhost, which is perfect if you host them separately but want them to be flexible!

---

**Tip**: Always run `/sync` after a deployment to verify the production connection.
