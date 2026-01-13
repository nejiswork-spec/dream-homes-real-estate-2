/**
 * DreamHomes - Modern Real Estate Website
 * Complete JavaScript Functionality
 */

// ============================================
// Property Data
// ============================================
const properties = [
  {
    id: 0,
    title: "Oceanview Luxury Villa",
    location: "Lekki Phase 1, Lagos",
    price: "₦450M",
    priceValue: 450000000,
    type: "villa",
    beds: 5,
    baths: 4,
    area: "450 m²",
    image: "images/villa.png",
    badge: "Featured",
    description: "Experience ultimate luxury in this stunning oceanview villa located in the prestigious Lekki Phase 1. This masterpiece features 5 spacious bedrooms, each with en-suite bathrooms, a state-of-the-art kitchen, infinity pool overlooking the Atlantic Ocean, private cinema room, gym, and 24/7 security. The property sits on a generously sized plot with mature landscaping and offers the perfect blend of privacy and convenience.",
    features: ["Swimming Pool", "Home Theater", "Smart Home", "Garden", "Security", "Parking"]
  },
  {
    id: 1,
    title: "Skyline Penthouse",
    location: "Maitama, Abuja",
    price: "₦180M",
    priceValue: 180000000,
    type: "apartment",
    beds: 3,
    baths: 3,
    area: "280 m²",
    image: "images/apartment.png",
    badge: "New",
    description: "Perched atop one of Maitama's most exclusive buildings, this penthouse offers panoramic views of Abuja's stunning skyline. The open-concept living space features floor-to-ceiling windows, premium finishes throughout, and a private terrace perfect for entertaining. The gourmet kitchen comes fully equipped with imported appliances, and each bedroom offers a peaceful retreat with city views.",
    features: ["City Views", "Terrace", "Concierge", "Gym Access", "Parking", "24/7 Security"]
  },
  {
    id: 2,
    title: "Garden Paradise Bungalow",
    location: "Abeokuta, Ogun",
    price: "₦85M",
    priceValue: 85000000,
    type: "bungalow",
    beds: 4,
    baths: 2,
    area: "320 m²",
    image: "images/bungalow.png",
    badge: "Hot Deal",
    description: "Escape to tranquility in this beautifully designed bungalow surrounded by lush gardens. Perfect for families, this home features 4 comfortable bedrooms, a spacious living area with natural lighting, and a fully fitted kitchen. The expansive compound includes fruit trees, a vegetable garden, and ample parking space. Located in a quiet, secure neighborhood with easy access to schools and markets.",
    features: ["Garden", "Parking", "Quiet Area", "Near Schools", "Fruit Trees", "Storage"]
  },
  {
    id: 3,
    title: "Executive Waterfront Duplex",
    location: "Victoria Island, Lagos",
    price: "₦650M",
    priceValue: 650000000,
    type: "duplex",
    beds: 6,
    baths: 5,
    area: "600 m²",
    image: "images/villa.png",
    badge: "Premium",
    description: "This exceptional waterfront duplex represents the pinnacle of luxury living in Victoria Island. Spanning two floors, the property features 6 lavish bedrooms, multiple living areas, a chef's kitchen, and breathtaking lagoon views. Additional amenities include a private jetty, wine cellar, staff quarters, and a backup power system. A once-in-a-lifetime opportunity for discerning buyers.",
    features: ["Waterfront", "Private Jetty", "Wine Cellar", "Staff Quarters", "Generator", "BQ"]
  },
  {
    id: 4,
    title: "Urban Living Apartment",
    location: "Ikoyi, Lagos",
    price: "₦120M",
    priceValue: 120000000,
    type: "apartment",
    beds: 2,
    baths: 2,
    area: "150 m²",
    image: "images/apartment.png",
    badge: "New",
    description: "Modern living meets convenience in this stylish Ikoyi apartment. Designed for young professionals and small families, the space maximizes every square meter with smart storage solutions and an open floor plan. Enjoy amenities like a rooftop gym, swimming pool, and 24-hour security. Walking distance to restaurants, shops, and business centers.",
    features: ["Rooftop Pool", "Gym", "Security", "Near Amenities", "Modern Design", "Balcony"]
  },
  {
    id: 5,
    title: "Modern Family Bungalow",
    location: "Gwarinpa, Abuja",
    price: "₦75M",
    priceValue: 75000000,
    type: "bungalow",
    beds: 3,
    baths: 2,
    area: "250 m²",
    image: "images/bungalow.png",
    badge: "Reduced",
    description: "This recently renovated bungalow offers the perfect blend of comfort and affordability in Gwarinpa. The 3-bedroom home features modern finishes, a spacious living/dining area, and a well-appointed kitchen. The fenced compound provides security and privacy, while the location offers easy access to schools, hospitals, and shopping centers. An ideal starter home for growing families.",
    features: ["Renovated", "Fenced", "Near Hospital", "Good Roads", "Family Friendly", "Parking"]
  }
];

// ============================================
// DOM Content Loaded
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all features
  initHeader();
  initScrollAnimations();
  initCounterAnimations();
  initHeroSearch();
  initContactForm();
  initURLFilters();
});

// ============================================
// Header Scroll Effect
// ============================================
function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });
}

// ============================================
// Mobile Menu Toggle
// ============================================
function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  const menuToggle = document.getElementById("menuToggle");

  if (navLinks && menuToggle) {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active");
  }
}

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  const navLinks = document.getElementById("navLinks");
  const menuToggle = document.getElementById("menuToggle");

  if (navLinks && menuToggle && navLinks.classList.contains("active")) {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("active");
    }
  }
});

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

// ============================================
// Counter Animations
// ============================================
function initCounterAnimations() {
  const counters = document.querySelectorAll(".stat-number[data-target]");

  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += step;
    if (current < target) {
      element.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString() + "+";
    }
  };

  updateCounter();
}

// ============================================
// Hero Search
// ============================================
function initHeroSearch() {
  const searchForm = document.getElementById("heroSearchForm");

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const location = document.getElementById("heroLocation")?.value || "";
      const type = document.getElementById("heroType")?.value || "";
      const price = document.getElementById("heroPrice")?.value || "";

      // Build query string
      const params = new URLSearchParams();
      if (location) params.append("location", location);
      if (type) params.append("type", type);
      if (price) params.append("price", price);

      // Navigate to listings page with filters
      window.location.href = `listings.html?${params.toString()}`;
    });
  }
}

// ============================================
// Property Filters
// ============================================
function applyFilters() {
  const priceFilter = document.getElementById("priceFilter")?.value || "";
  const locationFilter = document.getElementById("locationFilter")?.value || "";
  const typeFilter = document.getElementById("typeFilter")?.value || "";
  const bedsFilter = document.getElementById("bedsFilter")?.value || "";

  const propertyCards = document.querySelectorAll("#propertyGrid .property-card");
  let visibleCount = 0;

  propertyCards.forEach((card) => {
    const matchesPrice = !priceFilter || card.dataset.price === priceFilter;
    const matchesLocation = !locationFilter || card.dataset.location === locationFilter;
    const matchesType = !typeFilter || card.dataset.type === typeFilter;
    const matchesBeds = !bedsFilter || parseInt(card.dataset.beds) >= parseInt(bedsFilter);

    if (matchesPrice && matchesLocation && matchesType && matchesBeds) {
      card.style.display = "block";
      card.style.animation = "fadeInUp 0.5s ease forwards";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  // Update count
  const countElement = document.getElementById("propertyCount");
  if (countElement) {
    countElement.textContent = visibleCount;
  }

  // Show/hide no results message
  const noResults = document.getElementById("noResults");
  const propertyGrid = document.getElementById("propertyGrid");
  if (noResults && propertyGrid) {
    if (visibleCount === 0) {
      noResults.style.display = "block";
      propertyGrid.style.display = "none";
    } else {
      noResults.style.display = "none";
      propertyGrid.style.display = "grid";
    }
  }
}

function resetFilters() {
  // Reset all filter selects
  const selects = document.querySelectorAll(".filters-form select");
  selects.forEach((select) => {
    select.value = "";
  });

  // Show all properties
  const propertyCards = document.querySelectorAll("#propertyGrid .property-card");
  propertyCards.forEach((card) => {
    card.style.display = "block";
    card.style.animation = "fadeInUp 0.5s ease forwards";
  });

  // Update count
  const countElement = document.getElementById("propertyCount");
  if (countElement) {
    countElement.textContent = propertyCards.length;
  }

  // Hide no results message
  const noResults = document.getElementById("noResults");
  const propertyGrid = document.getElementById("propertyGrid");
  if (noResults && propertyGrid) {
    noResults.style.display = "none";
    propertyGrid.style.display = "grid";
  }
}

// Initialize filters from URL parameters
function initURLFilters() {
  const urlParams = new URLSearchParams(window.location.search);

  const location = urlParams.get("location");
  const type = urlParams.get("type");
  const price = urlParams.get("price");

  if (location || type || price) {
    if (location) {
      const locationFilter = document.getElementById("locationFilter");
      if (locationFilter) locationFilter.value = location;
    }
    if (type) {
      const typeFilter = document.getElementById("typeFilter");
      if (typeFilter) typeFilter.value = type;
    }
    if (price) {
      const priceFilter = document.getElementById("priceFilter");
      if (priceFilter) priceFilter.value = price;
    }

    // Apply filters after a short delay to ensure DOM is ready
    setTimeout(applyFilters, 100);
  }
}

// ============================================
// View Toggle (Grid/List)
// ============================================
function setGridView() {
  const grid = document.getElementById("propertyGrid");
  const buttons = document.querySelectorAll(".view-toggle button");

  if (grid) {
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(350px, 1fr))";
  }

  buttons.forEach((btn, index) => {
    btn.classList.toggle("active", index === 0);
  });
}

function setListView() {
  const grid = document.getElementById("propertyGrid");
  const buttons = document.querySelectorAll(".view-toggle button");

  if (grid) {
    grid.style.gridTemplateColumns = "1fr";
  }

  buttons.forEach((btn, index) => {
    btn.classList.toggle("active", index === 1);
  });
}

// ============================================
// Favorite Toggle
// ============================================
function toggleFavorite(button) {
  button.classList.toggle("active");

  const svg = button.querySelector("svg");
  if (button.classList.contains("active")) {
    svg.setAttribute("fill", "currentColor");
    // Show feedback
    showToast("Added to favorites!");
  } else {
    svg.setAttribute("fill", "none");
    showToast("Removed from favorites");
  }
}

// ============================================
// Toast Notification
// ============================================
function showToast(message) {
  // Remove existing toast
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--secondary);
    color: white;
    padding: 16px 32px;
    border-radius: 50px;
    font-weight: 500;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    z-index: 9999;
    animation: fadeInUp 0.3s ease;
  `;

  document.body.appendChild(toast);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = "fadeIn 0.3s ease reverse";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// Property Modal
// ============================================
function openPropertyModal(index) {
  const modal = document.getElementById("propertyModal");
  const property = properties[index];

  if (!modal || !property) return;

  // Populate modal content
  document.getElementById("modalImage").src = property.image;
  document.getElementById("modalImage").alt = property.title;
  document.getElementById("modalTitle").textContent = property.title;
  document.getElementById("modalLocation").querySelector("span").textContent = property.location;
  document.getElementById("modalPrice").textContent = property.price;
  document.getElementById("modalDescription").textContent = property.description;

  // Build features
  const featuresHTML = `
    <div class="modal-feature">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span>${property.beds}</span>
      <small>Bedrooms</small>
    </div>
    <div class="modal-feature">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
        <line x1="10" y1="5" x2="8" y2="19"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
      <span>${property.baths}</span>
      <small>Bathrooms</small>
    </div>
    <div class="modal-feature">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
      </svg>
      <span>${property.area}</span>
      <small>Area</small>
    </div>
  `;
  document.getElementById("modalFeatures").innerHTML = featuresHTML;

  // Update CTA buttons to link to property page
  const ctaContainer = modal.querySelector('.modal-cta');
  if (ctaContainer) {
    ctaContainer.innerHTML = `
      <a href="property.html?id=${property.id}" class="btn btn-primary">View Full Details</a>
      <a href="contact.html" class="btn btn-outline">Schedule Visit</a>
    `;
  }

  // Show modal
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePropertyModal() {
  const modal = document.getElementById("propertyModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Close modal on overlay click
document.addEventListener("click", (e) => {
  const modal = document.getElementById("propertyModal");
  if (modal && e.target === modal) {
    closePropertyModal();
  }
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closePropertyModal();
  }
});

// ============================================
// Contact Form
// ============================================
function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) return;

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form values
    const firstName = document.getElementById("firstName")?.value.trim();
    const lastName = document.getElementById("lastName")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim() || "";
    const subject = document.getElementById("subject")?.value;
    const message = document.getElementById("message")?.value.trim();

    // Validate
    if (!firstName || !lastName || !email || !message || !subject) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address", "warning");
      return;
    }

    // Submit button state
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" style="animation: spin 1s linear infinite; margin-right: 8px;">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="60" stroke-linecap="round"/>
      </svg>
      Sending...
    `;
    submitBtn.disabled = true;

    // Load dynamic animation style if not exists
    if (!document.getElementById('spin-style')) {
      const style = document.createElement("style");
      style.id = 'spin-style';
      style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }

    try {
      // Call Strapi API
      if (typeof submitInquiry === 'function') {
        const result = await submitInquiry({
          firstName,
          lastName,
          email,
          phone,
          subject,
          message
        });

        if (result && result.success) {
          // Hide form, show success message
          contactForm.style.display = "none";
          const successMessage = document.getElementById("successMessage");
          if (successMessage) successMessage.classList.add("show");
          showToast("Message sent successfully!", "success");
        } else {
          throw new Error("Failed to send message to backend");
        }
      } else {
        throw new Error("Strapi API not loaded");
      }
    } catch (error) {
      console.error('Detailed Submission Error:', error);
      const errorMsg = error.message.includes('API Error')
        ? `Backend Error: ${error.message}`
        : 'Could not connect to server. Ensure Strapi is running.';
      showToast(errorMsg, "error");
    } finally {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

function resetContactForm() {
  const contactForm = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");

  if (contactForm && successMessage) {
    contactForm.reset();
    contactForm.style.display = "block";
    successMessage.classList.remove("show");
  }
}

// ============================================
// FAQ Accordion
// ============================================
function toggleFaq(element) {
  const answer = element.querySelector(".faq-answer");
  const icon = element.querySelector(".faq-icon");
  const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";

  // Close all other FAQs
  document.querySelectorAll(".faq-item").forEach((item) => {
    const itemAnswer = item.querySelector(".faq-answer");
    const itemIcon = item.querySelector(".faq-icon");
    if (item !== element && itemAnswer) {
      itemAnswer.style.maxHeight = "0px";
      if (itemIcon) itemIcon.style.transform = "rotate(0deg)";
    }
  });

  // Toggle current FAQ
  if (answer) {
    if (isOpen) {
      answer.style.maxHeight = "0px";
      if (icon) icon.style.transform = "rotate(0deg)";
    } else {
      answer.style.maxHeight = answer.scrollHeight + "px";
      if (icon) icon.style.transform = "rotate(180deg)";
    }
  }
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

// ============================================
// Preload Images
// ============================================
function preloadImages() {
  const images = [
    "images/villa.png",
    "images/apartment.png",
    "images/bungalow.png",
    "images/team.png",
    "images/hero-bg.png"
  ];

  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Preload images on page load
preloadImages();

// ============================================
// Performance: Debounce Scroll Events
// ============================================
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// Accessibility: Focus Management
// ============================================
document.addEventListener("keydown", (e) => {
  // Skip to main content
  if (e.key === "Tab" && e.shiftKey && document.activeElement === document.body) {
    const main = document.querySelector("main, .hero, section");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus();
    }
  }
});

// ============================================
// Cookie Consent
// ============================================
function initCookieConsent() {
  const consent = document.getElementById('cookieConsent');
  if (!consent) return;

  // Check if user already made a choice
  const cookieChoice = localStorage.getItem('cookieConsent');
  if (!cookieChoice) {
    setTimeout(() => {
      consent.classList.add('show');
    }, 2000);
  }
}

function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  const consent = document.getElementById('cookieConsent');
  if (consent) consent.classList.remove('show');

  // Initialize analytics if accepted
  initGoogleAnalytics();
  showToast('Preferences saved!');
}

function declineCookies() {
  localStorage.setItem('cookieConsent', 'declined');
  const consent = document.getElementById('cookieConsent');
  if (consent) consent.classList.remove('show');
  showToast('Preferences saved!');
}

// Initialize cookie consent on page load
document.addEventListener('DOMContentLoaded', initCookieConsent);

// ============================================
// Google Analytics Placeholder
// ============================================
function initGoogleAnalytics() {
  // Replace 'G-XXXXXXXXXX' with your actual GA4 measurement ID
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

  // Only load if cookies accepted
  if (localStorage.getItem('cookieConsent') !== 'accepted') return;

  // Google Analytics 4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}

// Initialize GA if already accepted
if (localStorage.getItem('cookieConsent') === 'accepted') {
  initGoogleAnalytics();
}

// ============================================
// EmailJS Contact Form Integration
// ============================================
// To use EmailJS:
// 1. Sign up at https://www.emailjs.com/
// 2. Create an email service and template
// 3. Replace the IDs below

const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const CONTACT_EMAIL = 'nejiswork@gmail.com';

// EmailJS will be loaded dynamically when needed
function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) {
      resolve(window.emailjs);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      resolve(window.emailjs);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Enhanced contact form with EmailJS
async function submitContactForm(formData) {
  try {
    await loadEmailJS();

    const templateParams = {
      to_email: CONTACT_EMAIL,
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject,
      message: formData.message
    };

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    return { success: true };
  } catch (error) {
    console.error('EmailJS error:', error);
    // Fallback: show success anyway for demo purposes
    return { success: true, demo: true };
  }
}

// ============================================
// Testimonial Carousel
// ============================================
const testimonials = [
  {
    quote: "DreamHomes made our house hunting journey incredibly smooth. Their team was professional, patient, and truly understood what we were looking for. We found our perfect home in Lekki within just two weeks!",
    name: "Chioma Okonkwo",
    location: "Lagos, Nigeria",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "I was skeptical about buying property online, but DreamHomes exceeded all my expectations. The virtual tours were detailed, and the agents were very responsive. Highly recommend!",
    name: "Emeka Adeyemi",
    location: "Abuja, Nigeria",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    quote: "As a first-time homebuyer, I had so many questions. The DreamHomes team guided me through every step of the process. Their expertise and patience made all the difference.",
    name: "Aisha Mohammed",
    location: "Port Harcourt, Nigeria",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    quote: "We sold our property through DreamHomes and got an excellent price within a month. Their marketing strategy and professional photography really made our listing stand out.",
    name: "Oluwaseun Bakare",
    location: "Ibadan, Nigeria",
    image: "https://randomuser.me/api/portraits/men/75.jpg"
  }
];

let currentTestimonial = 0;

function initTestimonialCarousel() {
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;

  // Replace static content with carousel
  slider.innerHTML = `
    <div class="testimonial-carousel">
      <div class="testimonial-card">
        <div class="testimonial-stars">
          ${'<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'.repeat(5)}
        </div>
        <p class="testimonial-quote" id="testimonialQuote">"${testimonials[0].quote}"</p>
        <div class="testimonial-author">
          <img id="testimonialImage" src="${testimonials[0].image}" alt="Client">
          <div class="testimonial-author-info">
            <h4 id="testimonialName">${testimonials[0].name}</h4>
            <p id="testimonialLocation">${testimonials[0].location}</p>
          </div>
        </div>
      </div>
      <div class="testimonial-dots">
        ${testimonials.map((_, i) => `<button class="testimonial-dot ${i === 0 ? 'active' : ''}" onclick="goToTestimonial(${i})"></button>`).join('')}
      </div>
    </div>
  `;

  // Auto-rotate testimonials
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
  }, 5000);
}

function goToTestimonial(index) {
  currentTestimonial = index;
  updateTestimonial();
}

function updateTestimonial() {
  const t = testimonials[currentTestimonial];
  const quote = document.getElementById('testimonialQuote');
  const image = document.getElementById('testimonialImage');
  const name = document.getElementById('testimonialName');
  const location = document.getElementById('testimonialLocation');
  const dots = document.querySelectorAll('.testimonial-dot');

  if (quote) {
    quote.style.opacity = '0';
    setTimeout(() => {
      quote.textContent = `"${t.quote}"`;
      quote.style.opacity = '1';
    }, 300);
  }

  if (image) image.src = t.image;
  if (name) name.textContent = t.name;
  if (location) location.textContent = t.location;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentTestimonial);
  });
}

// Initialize testimonial carousel
document.addEventListener('DOMContentLoaded', initTestimonialCarousel);

// ============================================
// Lazy Loading Images
// ============================================
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

document.addEventListener('DOMContentLoaded', initLazyLoading);

// ============================================
// Navigate to Property Detail Page
// ============================================
function viewPropertyDetail(id) {
  window.location.href = `property.html?id=${id}`;
}

console.log("DreamHomes website loaded successfully! 🏠");

// Initialize Strapi Content
initStrapiContent();
