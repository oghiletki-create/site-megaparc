const topbar = document.getElementById('topbar');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const cursor = document.getElementById('cursor');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const intro = document.getElementById('intro');

if (intro) {
  document.body.classList.add('intro-lock');
  const finishIntro = () => {
    intro.remove();
    document.body.classList.remove('intro-lock');
  };
  intro.addEventListener('animationend', e => {
    if (e.animationName === 'introFade') finishIntro();
  });
  intro.addEventListener('click', finishIntro);
  setTimeout(finishIntro, 6500);

  if (reduceMotion) {
    finishIntro();
  } else if (document.fonts && document.fonts.load) {
    document.fonts.load('900 152px "League Spartan"');
    document.fonts.load('700 30px "League Spartan"');
  }
}

const onScrollTopbar = () => topbar.classList.toggle('solid', window.scrollY > 40);
onScrollTopbar();
window.addEventListener('scroll', onScrollTopbar, { passive: true });

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

const revealElements = document.querySelectorAll('.reveal');

const revealInView = () => {
  revealElements.forEach(el => {
    if (el.offsetParent === null) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
      el.classList.add('visible');
    }
  });
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => observer.observe(el));
  window.addEventListener('scroll', revealInView, { passive: true });
  setTimeout(revealInView, 700);
} else {
  revealElements.forEach(el => el.classList.add('visible'));
}

const counters = document.querySelectorAll('[data-count]');

const animateCount = el => {
  const target = Number(el.dataset.count);
  const duration = 1600;
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const startCounters = () => {
  counters.forEach(el => {
    if (el.dataset.done) return;
    if (el.offsetParent === null) return;
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.dataset.done = '1';
      if (reduceMotion) {
        el.textContent = el.dataset.count;
      } else {
        animateCount(el);
      }
    }
  });
};

startCounters();
window.addEventListener('scroll', startCounters, { passive: true });

const parallaxItems = document.querySelectorAll('[data-parallax]');

if (!reduceMotion && parallaxItems.length) {
  let raf = 0;
  const applyParallax = () => {
    raf = 0;
    parallaxItems.forEach(el => {
      const speed = Number(el.dataset.parallax);
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
    });
  };
  window.addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(applyParallax);
  }, { passive: true });
  applyParallax();
}

if (finePointer && !reduceMotion) {
  document.querySelectorAll('.tilt').forEach(card => {
    let raf = 0;
    let rx = 0;
    let ry = 0;
    const render = () => {
      raf = 0;
      card.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateZ(0)';
    };
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx = -py * 7;
      ry = px * 9;
      if (!raf) raf = requestAnimationFrame(render);
    });
    card.addEventListener('mouseleave', () => {
      rx = 0;
      ry = 0;
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });

  document.querySelectorAll('[data-magnet]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = 'translate(' + dx * 0.18 + 'px, ' + dy * 0.3 + 'px)';
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  window.addEventListener('mousemove', e => {
    cursor.classList.add('on');
    cursor.style.transform = 'translate(' + (e.clientX - 7) + 'px, ' + (e.clientY - 7) + 'px)';
  }, { passive: true });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });
}

document.getElementById('year').textContent = new Date().getFullYear();

/* ---- Rent & guarantee calculator ---- */
(() => {
  const area = document.getElementById('calc-area');
  if (!area) return;
  const tariff = document.getElementById('calc-tariff');
  const areaOut = document.getElementById('calc-area-out');
  const tariffOut = document.getElementById('calc-tariff-out');
  const schemeBtns = document.querySelectorAll('.calc-scheme');
  const bldBtns = document.querySelectorAll('.calc-bld');
  const bldType = document.getElementById('calc-bld-type');
  const notes = document.querySelectorAll('.calc-note');
  const result = document.querySelector('.calc-result');
  const out = {
    month: document.getElementById('calc-month'),
    year: document.getElementById('calc-year'),
    discount: document.getElementById('calc-discount'),
    deposit: document.getElementById('calc-deposit'),
    signing: document.getElementById('calc-signing')
  };
  let scheme = 'standard';

  // Tarife de chirie orientative pe imobil (€/m² pe lună). De înlocuit cu
  // valorile reale Megaparc — un singur loc de editat. rate = valoarea
  // implicită, min/max = intervalul (ex. parter vs. demisol, vitrină vs.
  // interior). `type` referă cheia i18n a tipului de spațiu.
  const BUILDINGS = {
    dacia31:      { rate: 15, min: 12, max: 22, type: 'proj.1t' },
    moscova9:     { rate: 14, min: 11, max: 20, type: 'proj.2t' },
    moscova20:    { rate: 9,  min: 6,  max: 13, type: 'proj.3t' },
    vasilelupu48: { rate: 11, min: 9,  max: 15, type: 'proj.4t' }
  };

  const eur = n => '€ ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const setType = key => {
    if (!bldType) return;
    bldType.dataset.i18n = key;
    try {
      const lang = localStorage.getItem('megaparc-lang') || 'ro';
      const dict = typeof I18N !== 'undefined' ? (I18N[lang] || I18N.ro) : null;
      if (dict && dict[key]) bldType.innerHTML = dict[key];
    } catch (e) {}
  };

  const applyBuilding = id => {
    const b = BUILDINGS[id];
    if (!b) return;
    tariff.min = b.min;
    tariff.max = b.max;
    tariff.step = 0.5;
    tariff.value = b.rate;
    setType(b.type);
  };

  const render = () => {
    const a = Number(area.value);
    const t = Number(tariff.value);
    const month = a * t;
    const annual = month * 12;
    areaOut.textContent = a + ' m²';
    tariffOut.textContent = '€' + t;

    let discount = 0;
    let deposit = 0;
    let signing = 0;
    if (scheme === 'standard') {
      deposit = month * 3;          // chirie + utilități + reparații
      signing = month + deposit;    // prima lună + fond de garanție
    } else if (scheme === 'avans') {
      discount = annual * 0.10;     // reducere pentru plata anuală în avans
      signing = annual - discount;  // tot anul în avans, fără fond de garanție
    } else {                        // garanție bancară
      signing = month;             // prima lună; garanția bancară înlocuiește numerarul
    }

    out.month.textContent = eur(month);
    out.year.textContent = eur(annual);
    out.discount.textContent = discount ? '− ' + eur(discount) : '—';
    out.deposit.textContent = deposit ? eur(deposit) : '—';
    out.signing.textContent = eur(signing);

    notes.forEach(n => n.classList.toggle('show', n.dataset.scheme === scheme));
    if (result) result.dataset.scheme = scheme;
  };

  area.addEventListener('input', render);
  tariff.addEventListener('input', render);
  schemeBtns.forEach(btn => btn.addEventListener('click', () => {
    scheme = btn.dataset.scheme;
    schemeBtns.forEach(b => b.classList.toggle('active', b === btn));
    render();
  }));
  bldBtns.forEach(btn => btn.addEventListener('click', () => {
    bldBtns.forEach(b => b.classList.toggle('active', b === btn));
    applyBuilding(btn.dataset.bld);
    render();
  }));

  applyBuilding('dacia31');
  render();
})();

const pages = document.querySelectorAll('.page');
const pageNames = new Set(Array.from(pages, p => p.dataset.page));
const navLinks = nav.querySelectorAll('a[href^="#"]');

const showPage = (name, animate) => {
  const target = document.querySelector('.page[data-page="' + name + '"]');
  if (!target) return;
  pages.forEach(p => p.classList.remove('active', 'enter'));
  target.classList.add('active');
  if (animate && !reduceMotion) target.classList.add('enter');
  window.scrollTo(0, 0);
  navLinks.forEach(a => a.classList.toggle('current', a.getAttribute('href') === '#' + name));
  requestAnimationFrame(() => {
    revealInView();
    startCounters();
  });
};

const routeFromHash = animate => {
  const name = location.hash.replace(/^#\/?/, '') || 'acasa';
  showPage(pageNames.has(name) ? name : 'acasa', animate);
};

document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const raw = link.getAttribute('href').slice(1);
  const dest = raw === 'top' ? 'acasa' : raw;
  if (!pageNames.has(dest)) return;
  e.preventDefault();
  if (location.hash !== '#' + dest) history.pushState(null, '', '#' + dest);
  showPage(dest, true);
});

window.addEventListener('popstate', () => routeFromHash(true));
routeFromHash(false);
