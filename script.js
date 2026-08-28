"use strict";

/* ------------------------------
   Elements
------------------------------ */

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const themeToggle = document.getElementById("themeToggle");

const ticketForm = document.getElementById("ticketForm");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const closeToast = document.getElementById("closeToast");

const currentYear = document.getElementById("currentYear");

const faqItems = document.querySelectorAll(".faq-item");
const mobileNavLinks = document.querySelectorAll(".mobile-nav a");


/* ------------------------------
   Footer year
------------------------------ */

currentYear.textContent = new Date().getFullYear();


/* ------------------------------
   Header scroll styling
------------------------------ */

function updateHeader() {
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateHeader);

updateHeader();


/* ------------------------------
   Mobile navigation
------------------------------ */

function closeMobileMenu() {
  mobileNav.classList.remove("open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}


menuToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  menuToggle.setAttribute(
    "aria-label",
    isOpen
      ? "Close navigation"
      : "Open navigation"
  );
});


mobileNavLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});


window.addEventListener("resize", () => {
  if (window.innerWidth > 1024) {
    closeMobileMenu();
  }
});


/* ------------------------------
   Theme
------------------------------ */

function applyTheme(theme) {
  const useDarkTheme = theme === "dark";

  document.body.classList.toggle(
    "dark",
    useDarkTheme
  );

  themeToggle.textContent = useDarkTheme
    ? "☀"
    : "☾";

  themeToggle.setAttribute(
    "aria-label",
    useDarkTheme
      ? "Switch to light mode"
      : "Switch to dark mode"
  );
}


function loadTheme() {
  const savedTheme = localStorage.getItem(
    "techguard-theme"
  );

  if (savedTheme) {
    applyTheme(savedTheme);
    return;
  }

  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  applyTheme(
    prefersDark ? "dark" : "light"
  );
}


themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains(
    "dark"
  );

  const newTheme = isDark
    ? "light"
    : "dark";

  localStorage.setItem(
    "techguard-theme",
    newTheme
  );

  applyTheme(newTheme);
});


loadTheme();


/* ------------------------------
   FAQ
------------------------------ */

function updateFaqHeight(item) {
  const answer = item.querySelector(".faq-answer");

  if (item.classList.contains("active")) {
    answer.style.maxHeight =
      `${answer.scrollHeight}px`;
  } else {
    answer.style.maxHeight = "0px";
  }
}


faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");

  updateFaqHeight(item);

  button.addEventListener("click", () => {
    const wasActive = item.classList.contains(
      "active"
    );

    faqItems.forEach((faqItem) => {
      faqItem.classList.remove("active");
      updateFaqHeight(faqItem);
    });

    if (!wasActive) {
      item.classList.add("active");
      updateFaqHeight(item);
    }
  });
});


window.addEventListener("resize", () => {
  faqItems.forEach(updateFaqHeight);
});


/* ------------------------------
   Support ticket IDs
------------------------------ */

function createTicketNumber() {
  const now = new Date();

  const year = now
    .getFullYear()
    .toString()
    .slice(-2);

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const randomNumber = Math.floor(
    1000 + Math.random() * 9000
  );

  return `TG-${year}${month}-${randomNumber}`;
}


/* ------------------------------
   Toast notifications
------------------------------ */

let toastTimer = null;


function showToast(message) {
  toastMessage.textContent = message;

  toast.classList.add("show");

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(() => {
    hideToast();
  }, 6000);
}


function hideToast() {
  toast.classList.remove("show");

  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
}


closeToast.addEventListener(
  "click",
  hideToast
);


/* ------------------------------
   Ticket form
------------------------------ */

ticketForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    if (!ticketForm.checkValidity()) {
      ticketForm.reportValidity();
      return;
    }

    const formData = new FormData(
      ticketForm
    );

    const ticket = {
      ticketNumber: createTicketNumber(),
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      issueType: formData.get("issueType"),
      priority: formData.get("priority"),
      description: formData.get("description"),
      createdAt: new Date().toISOString()
    };

    saveTicket(ticket);

    showToast(
      `Ticket ${ticket.ticketNumber} has been created. We'll contact ${ticket.email}.`
    );

    ticketForm.reset();
  }
);


/* ------------------------------
   Demo ticket storage

   This stores submitted tickets locally
   in the browser so the demo works
   without a backend.
------------------------------ */

function saveTicket(ticket) {
  const storageKey = "techguard-support-tickets";

  let tickets = [];

  try {
    const existingTickets =
      localStorage.getItem(storageKey);

    if (existingTickets) {
      tickets = JSON.parse(
        existingTickets
      );
    }
  } catch (error) {
    console.warn(
      "Unable to read existing tickets:",
      error
    );
  }

  tickets.push(ticket);

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(tickets)
    );
  } catch (error) {
    console.warn(
      "Unable to save ticket:",
      error
    );
  }
}