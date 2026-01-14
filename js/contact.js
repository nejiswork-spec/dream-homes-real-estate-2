/**
 * Contact Form Handling
 */
import { submitInquiry } from './api.js';
import { showToast } from './ui.js';

export function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const propertyId = urlParams.get('propertyId');

        const formData = {
            firstName: document.getElementById("firstName")?.value.trim(),
            lastName: document.getElementById("lastName")?.value.trim(),
            email: document.getElementById("email")?.value.trim(),
            phone: document.getElementById("phone")?.value.trim(),
            subject: document.getElementById("subject")?.value,
            message: document.getElementById("message")?.value.trim(),
            propertyId: propertyId || ''
        };

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.message || !formData.subject) {
            showToast("Please fill in all required fields", "warning");
            return;
        }

        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending...</span>`;
        submitBtn.disabled = true;

        try {
            // reCAPTCHA v3 protection
            let recaptchaToken = '';
            if (typeof grecaptcha !== 'undefined') {
                recaptchaToken = await grecaptcha.execute('6LdPHqsqAAAAAFHj_7Hj1-yC0-6J9_D4o-_-_-_-', { action: 'contact' });
            }

            const result = await submitInquiry({ ...formData, recaptchaToken });
            if (result && result.success) {
                contactForm.style.display = "none";
                const successMessage = document.getElementById("successMessage");
                if (successMessage) successMessage.classList.add("show");
                showToast("Message sent successfully!", "success");
            }
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Send Another Message logic
    const successBtn = document.querySelector("#successMessage button");
    if (successBtn) {
        successBtn.addEventListener("click", () => {
            document.getElementById("successMessage").classList.remove("show");
            contactForm.style.display = "block";
            contactForm.reset();
        });
    }

    // Office Map Init
    initOfficeMap();
}

function initOfficeMap() {
    const mapContainer = document.getElementById('officeMap');
    if (!mapContainer || !window.L) return;

    const officeCoord = [6.4300, 3.4244]; // Victoria Island, Lagos
    const map = L.map('officeMap').setView(officeCoord, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker(officeCoord).addTo(map)
        .bindPopup('<strong>DreamHomes HQ</strong><br>123 Victoria Island, Lagos')
        .openPopup();
}
