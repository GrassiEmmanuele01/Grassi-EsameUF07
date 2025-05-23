// theme.js

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("themeToggle");

  // Controlla il tema salvato
  const savedTheme = localStorage.getItem("theme") || "light";

  if (savedTheme === "dark") {
    toggle.checked = true;
    loadDarkStyles();
  } else {
    loadLightStyles();
  }

  // Applica la classe al body
  document.body.classList.add(savedTheme + "-mode");

  toggle.addEventListener("change", function (event) {
    if (event.target.checked) {
      // Dark mode
      localStorage.setItem("theme", "dark");
      loadDarkStyles();
      document.body.classList.replace("light-mode", "dark-mode");
    } else {
      // Light mode
      localStorage.setItem("theme", "light");
      loadLightStyles();
      document.body.classList.replace("dark-mode", "light-mode");
    }
  });
});

// Funzione per caricare i CSS della dark mode
function loadDarkStyles() {
  unloadAllModeStyles(); // Rimuove eventuali stili esistenti
  addStyleSheet("../style/dark/style.css");
  addStyleSheet("../style/dark/01tm.css");
  addStyleSheet("../style/dark/02crono-advanced.css");
  addStyleSheet("../style/dark/02crono-base.css");
  addStyleSheet("../style/dark/03meteo.css");
}

// Funzione per caricare i CSS della light mode
function loadLightStyles() {
  unloadAllModeStyles(); // Rimuove eventuali stili esistenti
  addStyleSheet("../style/light/style.css");
  addStyleSheet("../style/light/01tm.css");
  addStyleSheet("../style/light/02crono-advanced.css");
  addStyleSheet("../style/light/02crono-base.css");
  addStyleSheet("../style/light/03meteo.css");
}

// Funzione per rimuovere tutti i fogli di stile aggiunti
function unloadAllModeStyles() {
  const stylesheets = document.querySelectorAll("link[data-theme-style]");
  stylesheets.forEach((link) => link.remove());
}

// Funzione per aggiungere un foglio di stile dinamico
function addStyleSheet(href) {
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute("data-theme-style", ""); // Etichetta per riconoscerlo
  document.head.appendChild(link);
} 

// Funzione per applicare il tema (aggiunge o rimuove la classe dark-mode)
function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("themeToggle");

    // Recupera il tema salvato
    const savedTheme = localStorage.getItem("theme") || "light";

    // Applica subito il tema
    applyTheme(savedTheme);
    if (savedTheme === "dark") {
        toggle.checked = true;
    }

    // Cambia tema quando l'utente clicca
    toggle.addEventListener("change", function (event) {
        if (event.target.checked) {
            localStorage.setItem("theme", "dark");
            applyTheme("dark");
        } else {
            localStorage.setItem("theme", "light");
            applyTheme("light");
        }
    });
});