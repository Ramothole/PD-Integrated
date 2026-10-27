// Business contact details. Leave a value empty to hide it on the site.
// Replace with verified details before launch.
const CONTACT = {
  email: "pdintegratedsheqsolutions@gmail.com",
  phone: "",   // e.g. "+27 00 000 0000"
  address: "", // e.g. "Street, Suburb, City, Province"
};

document.documentElement.classList.add("js");

// Contact details
for (const [key, value] of Object.entries(CONTACT)) {
  const row = document.querySelector(`[data-contact="${key}"]`);
  if (!row || !value) continue;
  const el = row.querySelector("a, em");
  el.textContent = value;
  if (key === "email") el.href = `mailto:${value}`;
  if (key === "phone") el.href = `tel:${value.replace(/[^\d+]/g, "")}`;
  row.hidden = false;
}

// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Mobile navigation
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}

// Header shadow on scroll
const header = document.querySelector(".site-header");
const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Highlight the nav link for the section in view
const links = [...document.querySelectorAll('.site-nav a[href^="#"]:not(.btn)')];
const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  // Reveal on scroll
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}

// Quotation form.
// Enquiries are emailed to CONTACT.email via FormSubmit (https://formsubmit.co).
// The first submission sends an activation email to that inbox; click the link
// in it once, and every enquiry after that is delivered.
const form = document.getElementById("quote-form");
if (form) {
  const status = form.querySelector(".form-status");
  const button = form.querySelector('button[type="submit"]');
  const say = (msg, ok) => { status.textContent = msg; status.className = `form-status ${ok ? "ok" : "err"}`; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.website.value) return; // honeypot: bots fill hidden fields

    let firstInvalid = null;
    form.querySelectorAll("[required]").forEach((field) => {
      const bad = !field.checkValidity();
      field.classList.toggle("invalid", bad);
      if (bad && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      say("Please complete the required fields and accept the privacy notice.", false);
      firstInvalid.focus();
      return;
    }

    const d = Object.fromEntries(new FormData(form));
    button.disabled = true;
    say("Sending your enquiry…", true);
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Quotation request: ${d.service}`,
          _replyto: d.email,
          _template: "table",
          _captcha: "false",
          Name: d.name,
          Company: d.company || "-",
          Email: d.email,
          Phone: d.phone || "-",
          Service: d.service,
          Message: d.message,
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || String(result.success) !== "true") throw new Error(result.message || res.statusText);
      form.reset();
      say("Thank you. Your enquiry has been sent and we will be in touch soon.", true);
    } catch {
      say(`Sorry, your enquiry could not be sent. Please email us at ${CONTACT.email}.`, false);
    } finally {
      button.disabled = false;
    }
  });

  form.addEventListener("input", (e) => {
    if (e.target.classList.contains("invalid") && e.target.checkValidity()) e.target.classList.remove("invalid");
  });
}
