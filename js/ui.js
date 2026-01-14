/**
 * UI Utilities and Components
 */

export function showToast(message, type = 'info') {
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Base styles are in CSS, but we ensure positioning here
    toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
  `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export function initScrollAnimations() {
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

export function initMobileMenu() {
    const navLinks = document.getElementById("navLinks");
    const menuToggle = document.getElementById("menuToggle");

    if (navLinks && menuToggle) {
        menuToggle.onclick = () => {
            navLinks.classList.toggle("active");
            menuToggle.classList.toggle("active");
        };

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (navLinks.classList.contains("active")) {
                if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                    navLinks.classList.remove("active");
                    menuToggle.classList.remove("active");
                }
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove("active");
                menuToggle.classList.remove("active");
            });
        });
    }
}

export function initHeaderScroll() {
    const header = document.getElementById("header");
    if (!header) return;

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

export function initCounterAnimations() {
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


export function initFaqAccordions() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector(".faq-answer");
            const icon = item.querySelector(".faq-icon");
            const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";

            // Close others
            faqItems.forEach(other => {
                if (other !== item) {
                    other.querySelector(".faq-answer").style.maxHeight = "0px";
                    const otherIcon = other.querySelector(".faq-icon");
                    if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
                }
            });

            if (isOpen) {
                answer.style.maxHeight = "0px";
                if (icon) icon.style.transform = "rotate(0deg)";
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
                if (icon) icon.style.transform = "rotate(180deg)";
            }
        });
    });
}

/**
 * Property Modal Logic
 */
export function openPropertyModal(p) {
    const modal = document.getElementById("propertyModal");
    if (!modal || !p) return;

    // Populate modal components
    const modalImg = document.getElementById("modalImage");
    if (modalImg) modalImg.src = p.image;

    const modalTitle = document.getElementById("modalTitle");
    if (modalTitle) modalTitle.textContent = p.title;

    const modalLoc = document.getElementById("modalLocation");
    if (modalLoc) modalLoc.querySelector('span').textContent = p.location;

    const modalPrice = document.getElementById("modalPrice");
    if (modalPrice) modalPrice.textContent = `₦${p.price}`;

    const modalDesc = document.getElementById("modalDescription");
    if (modalDesc) modalDesc.textContent = p.description;

    const modalFeat = document.getElementById("modalFeatures");
    if (modalFeat) {
        modalFeat.innerHTML = `
            <div class="modal-feature">🛏️ <span>${p.beds}</span><small>Bedrooms</small></div>
            <div class="modal-feature">🛁 <span>${p.baths}</span><small>Bathrooms</small></div>
            <div class="modal-feature">📐 <span>${p.area}</span><small>Area</small></div>
        `;
    }

    // Update CTAs if present in index.html
    const ctaContainer = modal.querySelector('.modal-cta');
    if (ctaContainer) {
        ctaContainer.innerHTML = `
            <a href="property.html?id=${p.id}" class="btn btn-primary">View Full Details</a>
            <a href="contact.html?propertyId=${p.id}" class="btn btn-outline">Inquire Now</a>
        `;
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

export function closePropertyModal() {
    const modal = document.getElementById("propertyModal");
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}

/**
 * Cookie Consent Logic
 */
export function initCookieConsent() {
    const banner = document.getElementById('cookieConsent');
    if (!banner) return;

    if (!localStorage.getItem('cookieAccepted')) {
        setTimeout(() => banner.classList.add('show'), 2000);
    }

    const acceptBtn = banner.querySelector('.btn-primary');
    const declineBtn = banner.querySelector('.btn-outline');

    if (acceptBtn) {
        acceptBtn.onclick = () => {
            localStorage.setItem('cookieAccepted', 'true');
            banner.classList.remove('show');
            showToast('Preferences saved!', 'success');
        };
    }

    if (declineBtn) {
        declineBtn.onclick = () => {
            localStorage.setItem('cookieAccepted', 'false');
            banner.classList.remove('show');
        };
    }
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
