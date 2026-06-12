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
