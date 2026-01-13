# 📝 How to Add Content to DreamHomes CMS

This guide walks you through filling your website with real data using the Strapi Admin Panel.

## 🚀 Prerequisites
1. Ensure your backend server is running (`npm run develop`).
2. Log in to the Admin Panel at **[http://localhost:1337/admin](http://localhost:1337/admin)**.

---

## 1️⃣ Adding a Property (House/Apartment)
This is the most important part!

1.  **Navigate**: In the left sidebar, click on **Content Manager**.
2.  **Select Type**: Under "Collection Types", click **Property**.
3.  **Create**: Click the **+ Create new entry** button (top right).
4.  **Fill Details**:
    *   **Title**: E.g., "Luxury Oceanview Villa".
    *   **Description**: "A beautiful 5-bedroom villa with a private pool..."
    *   **Price**: E.g., "₦450,000,000" (or just "450M").
    *   **Location**: E.g., "Lekki Phase 1, Lagos".
    *   **Type**: Select "villa" (or apartment/etc) from the dropdown.
    *   **Status**: Select "for-sale".
    *   **Bedrooms**: 5
    *   **Bathrooms**: 6
    *   **Area**: 450 (just the number).
    *   **Featured**: Toggle this **ON** (True) if you want it on the Homepage.
5.  **Images**:
    *   Click the media area to upload images.
    *   You can drag and drop multiple images of the house.
6.  **💾 SAVE**: Click **Save** in the top right.
7.  **🌍 PUBLISH**: Click **Publish** (top right). **Crucial Step!** If you don't publish, it won't show up.

---

## 2️⃣ Adding a Testimonial (Client Review)
To show social proof on the homepage.

1.  **Navigate**: In Content Manager, click **Testimonial**.
2.  **Create**: Click **+ Create new entry**.
3.  **Fill Details**:
    *   **ClientName**: E.g., "Chioma Okonkwo".
    *   **Location**: E.g., "Lagos, Nigeria".
    *   **Quote**: "DreamHomes made buying my first house so easy!"
    *   **Rating**: 5 (1 to 5).
    *   **Photo**: Upload a client photo (optional).
4.  **Save & Publish**.

---

## 3️⃣ Adding an Agent (Your Team)
To show who people should contact.

1.  **Navigate**: In Content Manager, click **Agent**.
2.  **Create**: Click **+ Create new entry**.
3.  **Fill Details**:
    *   **Name**: E.g., "Adeola Smith".
    *   **Email**: "adeola@dreamhomes.ng".
    *   **Phone**: "+234 800 123 4567".
    *   **Photo**: Upload their headshot.
4.  **Save & Publish**.

---

## 4️⃣ ⚠️ CRITICAL SITE SETTINGS (Do this once)
For your website to *see* this data, you must allow public access.

1.  Go to **Settings** (bottom of left sidebar).
2.  Under **Users & Permissions Plugin**, click **Roles**.
3.  Click on the **Public** role.
4.  Scroll down to **Permissions**:
    *   **Property**: Check `find` (get all) and `findOne` (get one).
    *   **Testimonial**: Check `find`.
    *   **Agent**: Check `find` and `findOne`.
    *   **Inquiry**: Check `create` (allows users to send messages).
5.  Click **Save** (top right).

---

### 🎉 You're Done!
Now verify it works:
Open this link in your browser: **[http://localhost:1337/api/properties](http://localhost:1337/api/properties)**
If you see JSON text with your property details, your backend is live and ready!
