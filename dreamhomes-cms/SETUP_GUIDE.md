# DreamHomes Backend - Strapi CMS

This folder contains instructions and configuration for setting up the Strapi headless CMS backend for the DreamHomes real estate website.

## Prerequisites

- Node.js >= 18.x
- npm >= 6.x
- A database (SQLite for development, PostgreSQL for production)

## Quick Start

### 1. Create New Strapi Project

Open terminal in this folder and run:

```bash
npx create-strapi-app@latest dreamhomes-cms --quickstart
```

This will create a new Strapi project with SQLite database and start the development server.

### 2. Access Admin Panel

After installation, open `http://localhost:1337/admin` to create your first admin user.

### 3. Create Content Types

Create the following content types in Strapi:

#### Property
| Field | Type | Required |
|-------|------|----------|
| title | Text | Yes |
| slug | UID (from title) | Yes |
| description | Rich Text | Yes |
| price | Number (Big integer) | Yes |
| priceDisplay | Text | Yes |
| location | Text | Yes |
| city | Enumeration (lagos, abuja, ogun, rivers, enugu) | Yes |
| type | Enumeration (villa, apartment, bungalow, duplex) | Yes |
| bedrooms | Number | Yes |
| bathrooms | Number | Yes |
| area | Text | Yes |
| image | Media (Single) | Yes |
| gallery | Media (Multiple) | No |
| badge | Text | No |
| featured | Boolean | No |
| amenities | JSON | No |
| agent | Relation (Agent) | No |

#### Agent
| Field | Type | Required |
|-------|------|----------|
| name | Text | Yes |
| email | Email | Yes |
| phone | Text | Yes |
| photo | Media (Single) | No |
| bio | Text | No |

#### Testimonial
| Field | Type | Required |
|-------|------|----------|
| quote | Text (Long) | Yes |
| clientName | Text | Yes |
| clientLocation | Text | Yes |
| clientPhoto | Media (Single) | No |
| rating | Number (1-5) | Yes |
| featured | Boolean | No |

#### Inquiry (Contact Form)
| Field | Type | Required |
|-------|------|----------|
| firstName | Text | Yes |
| lastName | Text | Yes |
| email | Email | Yes |
| phone | Text | No |
| subject | Text | Yes |
| message | Text (Long) | Yes |
| property | Relation (Property) | No |
| status | Enumeration (new, contacted, closed) | No |

### 4. API Permissions

Go to Settings > Users & Permissions > Roles > Public and enable:
- Property: find, findOne
- Agent: find, findOne
- Testimonial: find
- Inquiry: create

### 5. API Endpoints

Once configured, your API will be available at:

```
GET    /api/properties         - List all properties
GET    /api/properties/:id     - Get single property
GET    /api/properties?filters[city][$eq]=lagos  - Filter by city
GET    /api/agents             - List all agents
GET    /api/testimonials       - List all testimonials
POST   /api/inquiries          - Submit contact form
```

## Frontend Integration

Update the frontend JavaScript to fetch from Strapi:

```javascript
const STRAPI_URL = 'http://localhost:1337';

async function fetchProperties() {
  const response = await fetch(`${STRAPI_URL}/api/properties?populate=*`);
  const data = await response.json();
  return data.data;
}

async function fetchPropertyById(id) {
  const response = await fetch(`${STRAPI_URL}/api/properties/${id}?populate=*`);
  const data = await response.json();
  return data.data;
}

async function submitInquiry(formData) {
  const response = await fetch(`${STRAPI_URL}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: formData })
  });
  return response.json();
}
```

## Production Deployment

For production, you'll want to:

1. Use PostgreSQL instead of SQLite
2. Set up proper environment variables
3. Deploy to a hosting service (Railway, Render, DigitalOcean, etc.)

### Environment Variables

Create a `.env` file:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:password@host:5432/database
```

## Email Configuration

To enable email notifications for new inquiries, configure the email plugin:

1. Install email provider:
```bash
npm install @strapi/provider-email-nodemailer
```

2. Configure in `config/plugins.js`:
```javascript
module.exports = {
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-app-password',
        },
      },
      settings: {
        defaultFrom: 'noreply@dreamhomes.ng',
        defaultReplyTo: 'nejiswork@gmail.com',
      },
    },
  },
};
```

## Support

For Strapi documentation: https://docs.strapi.io/
