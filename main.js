// ================================
// HAMBURGER MENU (landing)
// ================================
const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '68px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = '#fff';
      navLinks.style.padding = '16px 24px';
      navLinks.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
      navLinks.style.zIndex = '998';
    }
  });
}

// ================================
// FORM STEPS (cotizacion.html)
// ================================
function nextStep(step) {
  // Hide all steps
  document.querySelectorAll('.form-step').forEach(s => s.classList.add('hidden'));

  // Show target step
  const target = document.getElementById('step-' + step);
  if (target) target.classList.remove('hidden');

  // Update step indicators
  document.querySelectorAll('.step').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 < step) el.classList.add('done');
    if (i + 1 === step) el.classList.add('active');
  });

  // Update step lines
  document.querySelectorAll('.step-line').forEach((line, i) => {
    line.classList.toggle('done', i < step - 1);
  });

  // Update done step circles
  document.querySelectorAll('.step.done .step-circle').forEach(c => {
    if (!c.dataset.orig) c.dataset.orig = c.textContent;
    c.textContent = '✓';
  });
  document.querySelectorAll('.step:not(.done) .step-circle').forEach(c => {
    if (c.dataset.orig) c.textContent = c.dataset.orig;
  });

  // If going to step 4, update confirmation price
  if (step === 4) {
    const total = document.getElementById('precio-total');
    const confirmPrecio = document.getElementById('confirm-precio');
    if (total && confirmPrecio) confirmPrecio.textContent = total.textContent;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================
// PRICE CALCULATOR (step 3)
// ================================
const planPrices = { basica: 150, media: 200, completa: 360 };
const extraPrices = { breakdown: 15, injury: 20, hire: 25, bonus: 10, mods: 30, key: 8 };

function updatePrice() {
  const selected = document.querySelector('input[name="cobertura"]:checked');
  const planBase = selected ? planPrices[selected.value] : 150;

  let extrasTotal = 0;
  document.querySelectorAll('input[name="extra"]:checked').forEach(cb => {
    extrasTotal += extraPrices[cb.value] || 0;
  });

  const planEl = document.getElementById('precio-plan');
  const extrasEl = document.getElementById('precio-extras');
  const totalEl = document.getElementById('precio-total');

  if (planEl) planEl.textContent = '$' + planBase + '/mes';
  if (extrasEl) extrasEl.textContent = '$' + extrasTotal + '/mes';
  if (totalEl) totalEl.textContent = '$' + (planBase + extrasTotal) + '/mes';
}

// Attach listeners for coverage selection
document.querySelectorAll('input[name="cobertura"]').forEach(r => r.addEventListener('change', updatePrice));
document.querySelectorAll('input[name="extra"]').forEach(cb => cb.addEventListener('change', updatePrice));

// ================================
// ADMIN PANEL (admin.html)
// ================================
function showSection(name) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));

  // Show target
  const target = document.getElementById('section-' + name);
  if (target) target.classList.remove('hidden');

  // Update sidebar active state
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(name)) {
      link.classList.add('active');
    }
  });

  // Update topbar title
  const titles = {
    cotizaciones: 'Cotizaciones',
    polizas: 'Pólizas activas',
    clientes: 'Clientes',
    configuracion: 'Configuración'
  };
  const titleEl = document.getElementById('topbar-title');
  if (titleEl) titleEl.textContent = titles[name] || name;

  return false;
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main = document.querySelector('.admin-main');
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('open');
    if (main) main.classList.toggle('expanded');
  }
}

// Config save buttons — show toast
document.querySelectorAll('.config-card .btn-green').forEach(btn => {
  btn.addEventListener('click', () => showToast('Cambios guardados exitosamente ✅'));
});

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Smooth scroll for landing anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
