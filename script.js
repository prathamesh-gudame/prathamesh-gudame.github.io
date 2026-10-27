// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Scroll progress bar =====
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = scrolled + '%';
}
document.addEventListener('scroll', updateProgress, { passive:true });
updateProgress();

// ===== Navbar scrolled state =====
const navbar = document.getElementById('navbar');
function updateNavbar(){
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}
document.addEventListener('scroll', updateNavbar, { passive:true });
updateNavbar();

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('main section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => sectionObserver.observe(s));

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting){
      setTimeout(() => entry.target.classList.add('in'), i * 40 % 200);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== Cursor glow (desktop only) =====
const glow = document.getElementById('cursorGlow');
if (window.matchMedia('(pointer: fine)').matches){
  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
  });
}

// ===== Animated stat counters =====
const statEls = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      const timer = setInterval(() => {
        cur += step;
        if (cur >= target){ cur = target; clearInterval(timer); }
        el.textContent = cur;
      }, 40);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statEls.forEach(el => statObserver.observe(el));

// ===== Project card tilt (subtle) =====
document.querySelectorAll('.project-card, .project-flagship').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ===== Carousels =====
document.querySelectorAll('[data-carousel]').forEach(root => {
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const dotsEl = root.querySelector('.carousel-dots');
  const prevBtn = root.querySelector('.carousel-btn.prev');
  const nextBtn = root.querySelector('.carousel-btn.next');
  const smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  let index = 0;

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
    return dot;
  });

  function update(){
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
  }

  function goTo(i){
    index = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: index * track.clientWidth, behavior: smooth });
    update();
  }

  track.addEventListener('scroll', () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== index){ index = i; update(); }
  }, { passive: true });

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });
  window.addEventListener('resize', () => {
    track.scrollTo({ left: index * track.clientWidth, behavior: 'auto' });
  });

  update();
});
