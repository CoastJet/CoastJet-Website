(function () {
  const KEY_STORAGE = 'coastjet_nsky_key';
  const DEFAULT_STYLE = 'dark';

  const embeddedApiKey = 'CSJ_3IusJcUtbO45VT9nRGJiiuGp0qdEqB';

  const nSkyMap = document.getElementById('nSkyMap');
  const mapWrap = document.getElementById('mapWrap');
  const clearKeyBtn = document.getElementById('clearKeyBtn');

  let currentStyle = DEFAULT_STYLE;

  function buildUrl(key, style) {
    return 'https://newsky.app/airline/public/map?style=' + style + '&token=' + encodeURIComponent(key);
  }

  function showMap(key) {
    if (nSkyMap) {
      nSkyMap.src = buildUrl(key, currentStyle);
      if (mapWrap) mapWrap.style.display = 'block';
      if (clearKeyBtn) clearKeyBtn.style.display = '';
    }
  }

  function clearMap() {
    if (nSkyMap) {
      nSkyMap.src = '';
      if (mapWrap) mapWrap.style.display = 'none';
    }
    localStorage.removeItem(KEY_STORAGE);
  }

  const savedKey = localStorage.getItem(KEY_STORAGE);
  if (savedKey) {
    showMap(savedKey);
  } else if (embeddedApiKey) {
    localStorage.setItem(KEY_STORAGE, embeddedApiKey);
    showMap(embeddedApiKey);
  }

  const loadBtn = document.getElementById('loadMapBtn');
  if (loadBtn) loadBtn.style.display = 'none';

  if (clearKeyBtn) {
    clearKeyBtn.addEventListener('click', clearMap);
  }

  // ✅ SAFE STYLE TOGGLE (fix)
  const styleDark = document.getElementById('styleDark');
  const styleLight = document.getElementById('styleLight');

  [styleDark, styleLight].forEach(function (btn) {
    if (!btn) return; // 🔥 critical fix
    btn.addEventListener('click', function () {
      currentStyle = btn.dataset.style;

      if (styleDark) styleDark.classList.toggle('active', currentStyle === 'dark');
      if (styleLight) styleLight.classList.toggle('active', currentStyle === 'light');

      const key = localStorage.getItem(KEY_STORAGE);
      if (key && nSkyMap) {
        nSkyMap.src = buildUrl(key, currentStyle);
      }
    });
  });

})();


// ========================================
// NAV SCROLL EFFECT (NEW)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  updateNav();
  window.addEventListener('scroll', updateNav);
});


// ========================================
// ROLES SEARCH (FIXED + HARDENED)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('rolesSearch');
  const rolesGrid = document.getElementById('rolesGrid');
  const rolesEmpty = document.getElementById('rolesEmpty');

  if (!searchInput || !rolesGrid) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const cards = rolesGrid.querySelectorAll('.role-card');

    let visibleCount = 0;

    cards.forEach(card => {
      const keywords = (card.dataset.role || '').toLowerCase();
      const title = card.querySelector('.role-card__title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.role-card__desc')?.textContent.toLowerCase() || '';

      const matches =
        keywords.includes(query) ||
        title.includes(query) ||
        desc.includes(query);

      if (matches || query === '') {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (rolesEmpty) {
      rolesEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
});



// ========================================
// MOBILE NAV TOGGLE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close menu when clicking a link
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
});
