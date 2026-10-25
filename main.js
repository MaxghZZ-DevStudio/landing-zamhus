/* ==========================================================================
   Zamhu's Grill — Interacciones
   ========================================================================== */

// --- Configuración general ---
const CONFIG = {
  whatsapp: '51987654321',
};

// Abre WhatsApp con un mensaje ya escrito
function openWhatsApp(message) {
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
}

// --- Menú móvil (hamburguesa) ---
function initMobileMenu() {
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  const icon = burger.querySelector('.icon');

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    icon.textContent = open ? 'close' : 'menu';
  };

  burger.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'));
  });

  // Cerrar al elegir una sección
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  // Cerrar con Escape o tocando fuera del header
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) setOpen(false);
  });

  // Cerrar si la pantalla pasa a escritorio
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

// --- Enlace activo según la sección visible ---
function initActiveNav() {
  const links = document.querySelectorAll('[data-nav]');
  const ids = [...new Set([...links].map((link) => link.hash.slice(1)))];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.hash === `#${id}`);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, {
    // Zona activa: franja superior de la pantalla, debajo del header
    rootMargin: '-80px 0px -55% 0px',
  });

  sections.forEach((section) => observer.observe(section));
}

// --- Botones "Pedir" → WhatsApp ---
// Cualquier botón con data-item y data-price envía el pedido de ese plato.
function initOrderButtons() {
  document.addEventListener('click', (e) => {
    const button = e.target.closest('[data-item]');
    if (!button) return;

    const { item, price } = button.dataset;
    openWhatsApp(`Hola Zamhu's Grill, deseo pedir: ${item} (S/ ${price}). ¿Tienen disponibilidad?`);
  });
}

// --- Pestañas de la Carta Completa ---
// Clic o flechas del teclado (← → Inicio Fin) para cambiar de categoría.
function initTabs() {
  const tabs = [...document.querySelectorAll('.carta__tab')];
  if (!tabs.length) return;

  const activate = (tab) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.classList.toggle('is-active', selected);
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
    // En celular, desliza la fila para que la pestaña elegida quede visible
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab));

    tab.addEventListener('keydown', (e) => {
      const keys = {
        ArrowRight: tabs[(i + 1) % tabs.length],
        ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length],
        Home: tabs[0],
        End: tabs[tabs.length - 1],
      };
      const next = keys[e.key];
      if (!next) return;
      e.preventDefault();
      next.focus();
      activate(next);
    });
  });
}

// --- Año actual en el footer ---
function initYear() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNav();
  initOrderButtons();
  initTabs();
  initYear();
});
