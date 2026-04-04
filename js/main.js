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
// SOP PAGE — show/hide placeholder
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const frame       = document.getElementById('sopsFrame');
  const placeholder = document.getElementById('sopsPlaceholder');
  const openLink    = document.getElementById('sopsOpenLink');

  if (!frame) return;

  // If a src has been set, hide the placeholder and update the open link
  if (frame.src && frame.src !== window.location.href) {
    if (placeholder) placeholder.classList.add('hidden');
    // Sync the "Open in Docs" button href to match the embed src
    if (openLink) {
      // Convert embedded /pub URL back to a regular docs URL if needed
      openLink.href = frame.src.replace('/pub?embedded=true', '/pub');
    }
  }
});


// ========================================
// NEWS CAROUSEL
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const track     = document.getElementById('newsTrack');
  const prevBtn   = document.getElementById('newsPrev');
  const nextBtn   = document.getElementById('newsNext');
  const dotsWrap  = document.getElementById('newsDots');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.querySelectorAll('.news-card'));
  if (cards.length === 0) return;

  // Work out how many cards are visible at current breakpoint
  function getVisible() {
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  let current = 0; // index of the first visible card

  // Build dots
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    const maxIndex = Math.max(0, cards.length - getVisible());
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = 'news__dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.news__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    const visible   = getVisible();
    const maxIndex  = Math.max(0, cards.length - visible);
    current = Math.max(0, Math.min(index, maxIndex));

    // Calculate card width + gap
    const card     = cards[0];
    const style    = getComputedStyle(track);
    const gap      = parseFloat(style.gap) || 0;
    const offset   = current * (card.offsetWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex;

    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Re-init on resize (breakpoint may change visible count)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(current); // re-clamp and recalculate offset
    }, 120);
  });

  buildDots();
  goTo(0);
});


// ========================================
// MOBILE NAV TOGGLE + NAV DROPDOWN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const dropdownToggles = document.querySelectorAll('.nav__dropdown-toggle');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('active');
    links.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  dropdownToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth > 768) return;

      const item = btn.closest('.nav__item--has-dropdown');
      if (!item) return;

      const willOpen = !item.classList.contains('open');
      item.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      document.querySelectorAll('.nav__item--has-dropdown.open').forEach(item => item.classList.remove('open'));
      dropdownToggles.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    }
  });

  // Close menu when clicking a link
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
});

// ========================================
// CREW LOGIN (DEMO)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('crewLoginForm');
  const usernameInput = document.getElementById('crewEmail');
  const passwordInput = document.getElementById('crewPassword');
  const error = document.getElementById('crewLoginError');

  if (!form || !usernameInput || !passwordInput) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username === 'CJPilots' && password === '737') {
      window.location.href = 'crew-hub.html';
      return;
    }

    if (error) {
      error.textContent = 'Incorrect username or password.';
    }
  });
});
