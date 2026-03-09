/* ═══════════════════════════════════════════
   ALUR42 v2 — main.js
   • Navbar scroll + mobile menu
   • Reveal on scroll
   • FAQ accordion
   • SIRET / Nom entreprise autocomplete (API Recherche Entreprises)
   • Password show/hide toggle
═══════════════════════════════════════════ */

// ── Navbar ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // Highlight active page
  const path = location.pathname;
  document.querySelectorAll('.nav-link').forEach(a => {
    const h = a.getAttribute('href') || '';
    if (path.endsWith(h) || (h === 'index.html' && (path === '/' || path.endsWith('/')))) {
      a.classList.add('active');
    }
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('[data-r]');
  if (reveals.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('open');
      btn.closest('.faqs')?.querySelectorAll('.faq-q').forEach(b => {
        b.classList.remove('open');
        b.closest('.faq-item')?.querySelector('.faq-a')?.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        btn.closest('.faq-item')?.querySelector('.faq-a')?.classList.add('open');
      }
    });
  });

  // Init password toggles
  document.querySelectorAll('.pw-wrap').forEach(initPwToggle);
});

// ── Mobile nav ────────────────────────────
function toggleNav() {
  document.getElementById('nav-mob')?.classList.toggle('open');
}

// ── Password show/hide ────────────────────
function initPwToggle(wrap) {
  const input = wrap.querySelector('input');
  const btn   = wrap.querySelector('.pw-eye');
  if (!input || !btn) return;
  btn.addEventListener('click', () => {
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    btn.innerHTML = isText
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  });
}

// ── Sync bidirectionnel champs .auto-nom ─────────────────
// Si l'utilisateur tape directement dans un champ .auto-nom
// → met à jour le champ siret-in du haut ET lance la recherche
document.addEventListener('DOMContentLoaded', () => {
  // Écouter tous les champs auto-nom pour sync vers le haut
  document.querySelectorAll('.auto-ent').forEach(input => {
    input.addEventListener('input', function() {
      const val = this.value.trim();
      const siretIn = document.getElementById('siret-in');
      if (siretIn && val.length >= 2) {
        siretIn.value = val;
        // Lancer la recherche depuis le champ du bas
        clearTimeout(acTimer);
        acTimer = setTimeout(() => searchEntreprises(val, ''), 400);
      }
    });
  });

  // Écouter les champs auto-siret pour sync vers le haut
  document.querySelectorAll('.auto-siret').forEach(input => {
    input.addEventListener('input', function() {
      const val = this.value.replace(/\s/g, '');
      const siretIn = document.getElementById('siret-in');
      if (siretIn && val.length >= 9) {
        siretIn.value = this.value;
        clearTimeout(acTimer);
        acTimer = setTimeout(() => searchEntreprises(val, val), 400);
      }
    });
  });
});

// ── SIRET / Nom entreprise autocomplete ───
let acTimer = null;
let acAbort = null;

async function onSiretInput(val) {
  const drop = document.getElementById('ac-drop');
  const res  = document.getElementById('siret-res');
  if (!drop) return;

  const clean = val.replace(/\D/g, '');
  const q = val.trim();

  if (q.length < 3) { closeDrop(); res.style.display='none'; return; }

  // Format SIRET display
  if (/^\d+$/.test(q)) {
    const formatted = clean.replace(/(\d{3})(\d{1,3})?(\d{1,3})?(\d{1,5})?/, (_, a, b, c, d) =>
      [a, b, c, d].filter(Boolean).join(' ')
    );
    document.getElementById('siret-in').value = formatted;
  }

  clearTimeout(acTimer);
  acTimer = setTimeout(() => searchEntreprises(q, clean), 300);
}

async function searchEntreprises(q, cleanDigits) {
  const drop = document.getElementById('ac-drop');
  const res  = document.getElementById('siret-res');

  // Cancel previous
  if (acAbort) acAbort.abort();
  acAbort = new AbortController();

  drop.innerHTML = '<div class="ac-loading">🔍 Recherche en cours...</div>';
  drop.classList.add('open');

  try {
    let url;
    // Si c'est un SIRET/SIREN complet → appel direct
    if (cleanDigits.length === 14) {
      url = `https://recherche-entreprises.api.gouv.fr/search?q=${cleanDigits}&limite=1`;
    } else if (cleanDigits.length === 9) {
      url = `https://recherche-entreprises.api.gouv.fr/search?q=${cleanDigits}&limite=1`;
    } else {
      // Recherche par nom
      url = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(q)}&limite=8`;
    }

    const r = await fetch(url, { signal: acAbort.signal });
    if (!r.ok) throw new Error('API error');
    const data = await r.json();
    const results = data.results || [];

    if (results.length === 0) {
      drop.innerHTML = '<div class="ac-loading">Aucun résultat trouvé</div>';
      return;
    }

    drop.innerHTML = '';
    results.forEach(item => {
      const nom = item.nom_complet || item.nom_raison_sociale || item.nom || '—';
      const siret = item.siege?.siret || item.siren || '—';
      const naf = item.activite_principale || '—';
      const ville = item.siege?.libelle_commune || '';
      const div = document.createElement('div');
      div.className = 'ac-item';
      div.innerHTML = `<div class="ac-name">${nom}</div><div class="ac-meta">SIRET : ${siret} · NAF : ${naf}${ville ? ' · ' + ville : ''}</div>`;
      div.addEventListener('click', () => selectEntreprise(item));
      drop.appendChild(div);
    });

  } catch (e) {
    if (e.name === 'AbortError') return;
    drop.innerHTML = '<div class="ac-loading">❌ Erreur de recherche. Vérifiez votre connexion.</div>';
  }
}

function selectEntreprise(item) {
  const nom   = item.nom_complet || item.nom_raison_sociale || '';
  const siret = item.siege?.siret || '';
  const naf   = item.activite_principale || '';
  const forme = item.nature_juridique || '';
  const adresse = item.siege?.adresse || '';
  const cp    = item.siege?.code_postal || '';
  const ville = item.siege?.libelle_commune || '';

  // Fill input
  document.getElementById('siret-in').value = siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
  closeDrop();

  // Detect OPCO
  const opco = detectOpco(naf, forme);

  // Show result
  const res = document.getElementById('siret-res');
  const NAMES = { opcoep:'OPCO EP', agefice:'AGEFICE', atlas:'ATLAS', fifpl:'FIFPL', fafcea:'FAFCEA' };
  res.className = 'siret-res siret-ok';
  res.style.display = 'block';
  res.innerHTML = `✅ <strong>${nom}</strong> — SIRET : ${siret || '—'} · NAF : ${naf || '—'}<br>👉 Organisme détecté : <strong>${NAMES[opco] || 'OPCO EP'}</strong>`;

  // Pre-fill forms - UNIQUEMENT les champs entreprise, pas le nom/prénom de la personne
  document.querySelectorAll('.auto-siret').forEach(el => { el.value = siret; });
  document.querySelectorAll('.auto-ent').forEach(el => { el.value = nom; }); // champ "Nom de l'entreprise"
  document.querySelectorAll('.auto-naf').forEach(el => { el.value = naf; });
  document.querySelectorAll('.auto-adresse').forEach(el => { el.value = adresse; });
  document.querySelectorAll('.auto-cp').forEach(el => { el.value = cp; });
  document.querySelectorAll('.auto-ville').forEach(el => { el.value = ville; });

  // Switch to correct tab after short delay
  setTimeout(() => switchTab(opco), 700);
}

function closeDrop() {
  const drop = document.getElementById('ac-drop');
  if (drop) { drop.classList.remove('open'); drop.innerHTML = ''; }
}

// Close on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.siret-row')) closeDrop();
});

// ── OPCO detection ────────────────────────
const NAF_MAP = {
  '6831Z':'opcoep','6832A':'opcoep','6832B':'opcoep','6820A':'opcoep','6820B':'opcoep',
  '6619B':'fifpl','7112B':'fifpl','6910Z':'fifpl','6920Z':'fifpl',
  '6411Z':'atlas','6419Z':'atlas','6512Z':'atlas','6622Z':'atlas','6630Z':'atlas',
  '4321A':'fafcea','4322A':'fafcea','4399E':'fafcea','4391A':'fafcea',
};

function detectOpco(naf, forme) {
  const nafClean = (naf || '').replace('.','').trim();
  if (NAF_MAP[nafClean]) return NAF_MAP[nafClean];
  // forme juridique → AGEFICE si dirigeant indépendant
  const f = (forme || '');
  if (['5498','5499','5410','5415','5422','5453'].some(c => f.startsWith(c))) return 'agefice';
  return 'opcoep';
}

// ── Tab switching ─────────────────────────
function showTab(id, el) {
  document.querySelectorAll('.fin-tab').forEach(t => t.classList.remove('active'));
  el?.classList.add('active');
  document.querySelectorAll('.fin-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + id)?.classList.add('active');
}

function switchTab(id) {
  const tabs = ['opcoep','agefice','ageficebis','atlas','fifpl','fafcea'];
  document.querySelectorAll('.fin-tab').forEach((t, i) => {
    t.classList.toggle('active', tabs[i] === id);
  });
  document.querySelectorAll('.fin-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('tab-' + id);
  if (panel) {
    panel.classList.add('active');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── Form submit ───────────────────────────
function submitForm(e, name) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = '⏳ Envoi...'; btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✅ Demande envoyée !';
    btn.style.background = '#16a34a';
    const ok = document.createElement('div');
    ok.className = 'success-msg';
    ok.innerHTML = `🎉 <strong>Demande ${name} bien reçue !</strong><br>Vous recevrez votre lien de signature <strong>YouSign sous 48h</strong>. Délai de signature : 7 jours.`;
    e.target.appendChild(ok);
  }, 1500);
}

// ── Contact form ──────────────────────────
function submitContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = '⏳ Envoi...'; btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✅ Message envoyé !';
    btn.style.background = '#16a34a';
    const ok = document.createElement('div');
    ok.className = 'success-msg';
    ok.style.marginTop = '14px';
    ok.innerHTML = '<strong>Merci !</strong> Nous vous répondrons sous 24h ouvrées.';
    e.target.appendChild(ok);
  }, 1400);
}

// ── Smooth anchor scroll ──────────────────
document.addEventListener('click', e => {
  const a = e.target.closest('a[href*="#"]');
  if (!a) return;
  const hash = a.href.split('#')[1];
  if (!hash) return;
  const target = document.getElementById(hash);
  if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
});

window.toggleNav = toggleNav;
