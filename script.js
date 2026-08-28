document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // Mobile Navigation
  // =========================
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    // Close menu after clicking a link
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    // Reset menu when returning to desktop size
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      }
    });
  }


  // =========================
  // Automatic Footer Year
  // =========================
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  // =========================
  // Smooth Scrolling
  // =========================
  document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      const header = document.querySelector(".site-header");

      const headerHeight = header
        ? header.offsetHeight
        : 0;

      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        12;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });

    });

  });


  // =========================
  // Contact Form
  // =========================
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (contactForm) {

    contactForm.addEventListener("submit", (event) => {

      event.preventDefault();

      const formData = new FormData(contactForm);

      const name =
        (formData.get("name") || "")
        .toString()
        .trim();

      const company =
        (formData.get("company") || "")
        .toString()
        .trim();

      const email =
        (formData.get("email") || "")
        .toString()
        .trim();

      const phone =
        (formData.get("phone") || "")
        .toString()
        .trim();

      const service =
        (formData.get("service") || "")
        .toString()
        .trim();

      const message =
        (formData.get("message") || "")
        .toString()
        .trim();


      // Required fields check
      if (!name || !email || !service || !message) {

        if (formMessage) {

          formMessage.textContent =
            "Please complete all required fields before submitting.";

          formMessage.style.color =
            "#c0392b";

        }

        return;
      }


      // =========================
      // Create Email
      // =========================

      const subject = encodeURIComponent(
        `Website inquiry: ${service} - ${name}`
      );


      const body = encodeURIComponent(
`New Website Support Request

Name: ${name}

Company:
${company || "Not provided"}

Email:
${email}

Phone:
${phone || "Not provided"}

Service Needed:
${service}

Project / Support Details:

${message}`
      );


      const mailtoLink =
        `mailto:johnniecraft.tech@gmail.com?subject=${subject}&body=${body}`;


      if (formMessage) {

        formMessage.textContent =
          "Opening your email application with your request...";

        formMessage.style.color =
          "#1c9f7d";

      }


      window.location.href = mailtoLink;

    });

  }


  // =========================
  // Active Navigation Link
  // =========================
  const sections =
    document.querySelectorAll("main section[id]");

  const navLinks =
    document.querySelectorAll(
      '.main-nav a[href^="#"]'
    );


  if (
    sections.length &&
    navLinks.length &&
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(

        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }


            navLinks.forEach((link) => {
              link.classList.remove("active");
            });


            const activeLink =
              document.querySelector(
                `.main-nav a[href="#${entry.target.id}"]`
              );


            if (activeLink) {
              activeLink.classList.add("active");
            }

          });

        },

        {
          rootMargin: "-35% 0px -55% 0px",
          threshold: 0
        }

      );


    sections.forEach((section) => {
      observer.observe(section);
    });

  }

});