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

        const formData = {
            firstName: document.getElementById("firstName")?.value.trim(),
            lastName: document.getElementById("lastName")?.value.trim(),
            email: document.getElementById("email")?.value.trim(),
            phone: document.getElementById("phone")?.value.trim(),
            subject: document.getElementById("subject")?.value,
            message: document.getElementById("message")?.value.trim()
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
            const result = await submitInquiry(formData);
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
}
