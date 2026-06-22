const profileButton = document.querySelector(".avatar-button");
const profileDrawer = document.querySelector(".profile-drawer");
const drawerBackdrop = document.querySelector(".drawer-backdrop");
const drawerClose = document.querySelector(".drawer-close");
const markReadButton = document.querySelector(".mark-read");
const messagesSection = document.querySelector(".messages-section");
const messageBadge = document.querySelector(".message-button .notification-dot");
const messageButton = document.querySelector(".message-button");
const languageButton = document.querySelector(".language-button");
const currentLanguage = document.querySelector(".current-language");
const languageOptions = [...document.querySelectorAll(".language-list button")];
const bottomLinks = [...document.querySelectorAll(".bottom-nav a")];
const dots = [...document.querySelectorAll(".carousel-dots i")];
const pageViews = [...document.querySelectorAll(".page-view")];
const genericTitle = document.querySelector(".generic-title");
const genericHeading = document.querySelector(".generic-heading");
let activeNews = 0;

const primaryPages = new Set(["home", "lead", "marketing", "academy", "more"]);
const explicitPages = new Set(["messages", "calendar", "warranty", "monitoring", "language"]);
const pageNames = {
  "lead-detail": "Lead details", "asset-detail": "Marketing asset", "course-detail": "Course details",
  "profile": "Profile", "account": "Account", "users": "User management", "password": "Change password",
  "confirm": "Confirm information",
  "settings": "Settings", "support": "Help center", "news-detail": "Latest news",
  "all-news": "Latest news", "all-benefits": "Partner benefits", "benefit-detail": "Partner benefits",
  "apply": "Partner application", "lead-create": "Add new lead", "membership": "Membership level"
};

function showPage() {
  const route = window.location.hash.slice(1) || "home";
  const page = primaryPages.has(route) || explicitPages.has(route) ? route : "generic";
  pageViews.forEach((view) => view.classList.toggle("active", view.dataset.page === page));

  const primaryRoute = primaryPages.has(route) ? route : null;
  bottomLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${primaryRoute}`));

  if (page === "generic") {
    const title = pageNames[route] || "Portal details";
    genericTitle.textContent = title;
    genericHeading.textContent = title;
  }

  setDrawer(false);
  window.scrollTo({ top: 0, behavior: "instant" });
}

function setDrawer(open) {
  document.body.classList.toggle("drawer-open", open);
  profileDrawer.classList.toggle("open", open);
  profileDrawer.setAttribute("aria-hidden", String(!open));
  profileButton.setAttribute("aria-expanded", String(open));

  if (open) {
    drawerBackdrop.hidden = false;
    requestAnimationFrame(() => drawerBackdrop.classList.add("visible"));
  } else {
    drawerBackdrop.classList.remove("visible");
    window.setTimeout(() => { drawerBackdrop.hidden = true; }, 220);
  }
}

profileButton.addEventListener("click", () => setDrawer(true));
messageButton.addEventListener("click", () => { window.location.hash = "messages"; });
languageButton.addEventListener("click", () => {
  window.location.hash = "language";
});
drawerClose.addEventListener("click", () => setDrawer(false));
drawerBackdrop.addEventListener("click", () => setDrawer(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setDrawer(false);
});

markReadButton.addEventListener("click", () => {
  messagesSection.classList.add("read");
  messageBadge.hidden = true;
  markReadButton.textContent = "All read";
  markReadButton.disabled = true;
});

function setActiveNews(index) {
  activeNews = (index + dots.length) % dots.length;
  dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === activeNews));
}

document.querySelector(".carousel-prev").addEventListener("click", () => setActiveNews(activeNews - 1));
document.querySelector(".carousel-next").addEventListener("click", () => setActiveNews(activeNews + 1));

bottomLinks.forEach((link) => {
  link.addEventListener("click", () => {});
});

document.querySelectorAll(".segmented-control").forEach((control) => {
  control.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    control.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  });
});

languageOptions.forEach((option) => {
  option.addEventListener("click", () => {
    languageOptions.forEach((item) => {
      const selected = item === option;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-checked", String(selected));
    });
    languageButton.querySelector("span").textContent = option.dataset.code;
    currentLanguage.textContent = option.dataset.name;
  });
});

document.querySelectorAll(".search-field input").forEach((input) => {
  input.addEventListener("input", () => {
    const list = input.closest(".page-view").querySelector(".record-list, .asset-list, .tool-records");
    if (!list) return;
    [...list.children].forEach((item) => {
      item.hidden = !item.textContent.toLowerCase().includes(input.value.trim().toLowerCase());
    });
  });
});

window.addEventListener("hashchange", showPage);
showPage();
