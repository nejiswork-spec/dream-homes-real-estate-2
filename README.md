# DreamHomes

React + TypeScript + Vite. Lora headings, Manrope interface, GSAP ScrollTrigger and Lenis sharing one ticker. The existing layout and section order remain; eyebrows are removed and the AIVORA footer credit is centred.

## Run locally

```powershell
npm install
npm run dev -- --port 5181
```

Use the address printed by Vite. Port 5180 is the default. Dependencies on this machine were copied from an existing installation because registry access was unavailable; package.json is the dependency source of truth.

```powershell
npm run test
npm run build
```

The build creates static HTML entries with route-specific metadata and readable property content before React starts. /property/property-slug URLs work directly. Legacy #/ links migrate automatically. Vercel filesystem routing serves generated pages, then falls back to React routes. Rebuild after publishing content to refresh the static snapshots, social previews and sitemap. Runtime listing data is fetched fresh from Supabase.

## Connect Supabase

1. Choose the intended Supabase project and apply supabase/schema.sql in its SQL editor. The schema is repeatable for this project's existing tables and policies. It creates properties, enquiries, an admin allowlist, a public photo bucket and access policies.
2. Create or invite an administrator using Supabase Authentication, then add that approved user's UUID to private.admin_users using the final commented SQL example. There is no public admin signup or self-assigned role.
3. Copy .env.example to .env.local. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or the legacy anon key). Set VITE_SITE_URL to the public HTTPS origin for canonical URLs and the sitemap. Never expose the service-role key through VITE_ variables.
4. Restart Vite. Open /admin. Sign in, add a property, upload photos, save and publish it. Existing slugs are immutable to preserve URLs. Unpublish removes a listing from runtime public reads; a fresh deployment removes old static snapshots.
5. Deploy the enquiry function using the Supabase CLI:

```powershell
supabase functions deploy submit-enquiry --project-ref YOUR_PROJECT_REF
```

Set ALLOWED_ORIGINS and ENQUIRY_RATE_SECRET through the project's Edge Function secrets. ALLOWED_ORIGINS is a comma-separated list of exact origins, for example the production HTTPS origin and your current local preview origin. ENQUIRY_RATE_SECRET must be a strong random secret. Hosted Supabase supplies SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY server-side. Do not put these server secrets in the browser configuration. The public endpoint disables gateway JWT verification intentionally; origin checks, validation, rate limits and the restricted database RPC control submissions instead.

## What works

- Responsive homepage, about, listings, detailed property and contact pages.
- Buy/rent, location, type, minimum/maximum price and minimum-bedroom filters. Search state is preserved in the URL. Sorting and saved homes work together with filters.
- Galleries use only photos attached to the property, with keyboard-accessible modal viewing. Current samples have one photo each; unrelated images are never presented as additional views of a sample home.
- Property availability, neighbourhood details, amenities and document information support real content. Missing information is stated plainly.
- Viewing enquiry form with date, consent, validation, pending/success/error states. Success is shown only after the server confirms storage. Dates are requests, not confirmed appointments.
- Admin password authentication, refreshable in-memory session, create/edit properties, public photo uploads, publish/unpublish and last-100 enquiry inbox with status updates.
- Public reads require published records. Authenticated users must be allowlisted to edit. Enquiries cannot be inserted directly by public clients and are visible only to admins. The Edge Function validates input and inserts transactionally with IP/email/global rate limits. It does not send email or WhatsApp notifications.

## Operational limits

The DreamHomes Supabase project is connected locally and its schema has been applied. Public REST checks confirm published listings can be read and enquiries cannot be read anonymously. The enquiry function is deployed and its allowed origins and rate-limit salt are configured. Public enquiry submissions are enabled. Live checks confirmed a valid enquiry returns 201 and persists in the database, missing consent returns 400, an unapproved origin returns 403, and the next submission after five accepted enquiries returns 429. Administrator login, private inbox reads, status updates, draft saving, publishing and unpublishing have now passed live checks. Photo upload testing passed after browser file access was enabled: a PNG uploaded to Supabase Storage, the draft saved successfully, and reopening the editor retained the uploaded gallery URL. The test property remains unpublished. The database contains one clearly labelled integration-test property, left unpublished. Five integration-test enquiries are Closed. SQL and Edge runtime integration cannot be validated from a frontend build alone.

The local browser connection became unavailable during this implementation, so updated mobile visuals and full browser flows still require verification. Review design-qa.md for the exact status.

Sample data is labelled and excluded from indexing. Supabase errors never silently fall back to samples. No amenities, verification badges or availability claims are invented. Before launch replace sample images with photographs and details you own and have verified. Photo bucket objects are public, including uploaded drafts: do not upload private documents or photographs that are not ready for public access. Runtime unpublished records can remain in an older static deployment until rebuilt; never use published listings for confidential data.

Admin refresh tokens stay in memory, so reloading requires signing in again. A refreshed token is used before expiry. Browser logout clears the local token immediately. Use Supabase account recovery and project security settings for administrator account management.

The enquiry limiter provides basic protection. Confirm the hosted proxy supplies trustworthy x-forwarded-for headers during deployment; requests without a client address fail closed. Monitor abuse and add a CAPTCHA/WAF if traffic requires it. Configure retention and deletion procedures for enquiries before collecting real customer data. The inbox is the current notification mechanism.

Original reference repository: https://github.com/nejiswork-spec/dream-homes-real-estate-2 . Clone was blocked by DNS; this rebuild has not been pushed to that repository or deployed.
