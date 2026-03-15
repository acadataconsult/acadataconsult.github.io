// ====== EDIT THESE SETTINGS ======
const SETTINGS = {
  whatsappNumberInternational: "233265355732", // e.g., "233501234567"
  officialEmail: "acadataconsult@gmail.com",
  facebookUrl: "https://facebook.com/YOUR_PAGE",
  instagramUrl: "https://www.instagram.com/acadatainsightconsult/",
  peopleServed: 50,

  // Optional (only needed if you have a booking button)
  bookingUrl: "#",
};
// =================================

// WhatsApp floating button
const whatsappBtn = document.getElementById("whatsappBtn");
const whatsappLink = `https://wa.me/${SETTINGS.whatsappNumberInternational}?text=${encodeURIComponent(
  "Hi Acadata Insight Consult! I need help with my thesis/project data analysis."
)}`;
if (whatsappBtn) whatsappBtn.href = whatsappLink;

// Floating email
const emailLink = document.getElementById("emailLink");
if (emailLink) {
  emailLink.href = `mailto:${SETTINGS.officialEmail}`;
  emailLink.textContent = SETTINGS.officialEmail;
}

// Footer social links (ONLY PLACE THEY APPEAR)
const fbFooter = document.getElementById("fbLinkFooter");
const igFooter = document.getElementById("igLinkFooter");
if (fbFooter) fbFooter.href = SETTINGS.facebookUrl;
if (igFooter) igFooter.href = SETTINGS.instagramUrl;

// Book Now button (ONLY in Testimonials now)
const bookBtn = document.getElementById("bookNowTestimonials");
if (bookBtn && SETTINGS.bookingUrl) bookBtn.href = SETTINGS.bookingUrl;

// People served counter (animated)
const servedEl = document.getElementById("servedCount");

function animateCount(el, target) {
  let current = 0;
  const steps = 80;
  const increment = Math.max(1, Math.floor(target / steps));

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = String(target);
      clearInterval(timer);
      return;
    }
    el.textContent = String(current);
  }, 18);
}

if (servedEl) {
  servedEl.dataset.target = String(SETTINGS.peopleServed);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(servedEl, SETTINGS.peopleServed);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(servedEl);
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --------------------
// Toast popup (no extra HTML needed)
// --------------------
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // animate in
  requestAnimationFrame(() => toast.classList.add("toast--show"));

  // remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove("toast--show");
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}

// --------------------
// Contact form submit (Formspree)
// --------------------
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    if (formStatus) formStatus.textContent = "Sending message...";

    try {
      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        contactForm.reset(); // clears the form
        if (formStatus) formStatus.textContent = "";
        showToast("Message sent successfully!", "success");
      } else {
        if (formStatus)
          formStatus.textContent = "Something went wrong. Please try again.";
        showToast("Failed to send. Please try again.", "error");
      }
    } catch (error) {
      if (formStatus) formStatus.textContent = "Network error. Please try again.";
      showToast("Network error. Please try again.", "error");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}