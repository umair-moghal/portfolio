const preference = matchMedia('(prefers-reduced-motion: reduce)');
const gsapReady = Boolean(window.gsap && window.ScrollTrigger);
const motion = document.getElementById('motion');
const cinema = document.querySelector('.work-cinema');
const cinemaCount = document.querySelector('.cinema-count');
let paused = preference.matches, choreography, smoother, cinemaTween, entrancePlayed = false;
function configureMotion() {
  const scrollPosition = smoother ? smoother.scrollTop() : window.scrollY;
  const anchor = Array.from(document.querySelectorAll('section, .archive, .archive-row')).filter(el => {
    const r = el.getBoundingClientRect();
    return r.top <= window.innerHeight * .35 && r.bottom > window.innerHeight * .35;
  }).sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];
  const anchorTop = anchor?.getBoundingClientRect().top;
  const restorePosition = () => {
    if (!anchor || scrollPosition < 10) return scrollPosition;
    return Math.max(0, window.scrollY + anchor.getBoundingClientRect().top - anchorTop);
  };
  if (choreography) { choreography.revert(); choreography = null; }
  if (smoother) { smoother.kill(); smoother = null; }
  cinemaTween = null;
  cinema.classList.remove('cinema-active');
  cinemaCount.textContent = '01 / 03';
  document.body.classList.toggle('no-motion', paused);
  motion.innerHTML = paused ? 'Motion off <span>▷</span>' : 'Motion on <span>Ⅱ</span>';
  motion.setAttribute('aria-pressed', String(paused));
  motion.setAttribute('aria-label', paused ? 'Enable animations and smooth scrolling' : 'Pause animations and smooth scrolling');
  window.dispatchEvent(new CustomEvent('portfolio:motion', { detail: { paused } }));
  if (paused || !gsapReady) { window.scrollTo(0, restorePosition()); return; }
  gsap.registerPlugin(ScrollTrigger);
  if (window.ScrollSmoother) {
    gsap.registerPlugin(ScrollSmoother);
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.15,
      smoothTouch: false, effects: false, normalizeScroll: false,
      onFocusIn: self => {
        if (cinemaTween && self.target.closest('.feature')) return false;
      }
    });
  }
  choreography = gsap.matchMedia();
  choreography.add({ desktop: '(min-width: 1100px) and (hover: hover)', mobile: '(max-width: 1099px), (hover: none)' }, context => {
    const desktop = context.conditions.desktop;
    if (!entrancePlayed) {
      gsap.from('.title-line>span', { y: 60, rotationX: 12, transformPerspective: 1000, duration: 1.4, stagger: .18, ease: 'power3.out' });
      gsap.from('.hero-bottom', { y: 20, duration: 1, delay: .25, ease: 'power3.out' });
      entrancePlayed = true;
    }
    gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: self => window.dispatchEvent(new CustomEvent('portfolio:sculpture', { detail: { progress: self.progress } })) });
    gsap.to('.ribbon-track', { xPercent: -22, ease: 'none', scrollTrigger: { trigger: '.craft-ribbon', start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    if (desktop) {
      gsap.to('.hero .title-line:first-child', { x: -65, y: -35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.hero .serif', { x: 55, y: -25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.3 } });
      gsap.to('.sculpture-wrap', { y: 85, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.3 } });
      cinema.classList.add('cinema-active');
      const track = document.querySelector('.featured-work');
      const viewport = document.querySelector('.cinema-viewport');
      cinemaTween = gsap.to(track, {
        x: () => -(track.scrollWidth - viewport.clientWidth), ease: 'none',
        scrollTrigger: {
          trigger: cinema, start: 'top 24px', end: () => '+=' + Math.max(1800, window.innerWidth * 2.1),
          pin: true, scrub: 1.15, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: self => {
            cinemaCount.textContent = '0' + (Math.min(2, Math.round(self.progress * 2)) + 1) + ' / 03';
            gsap.set('.cinema-progress span', { scaleX: self.progress });
          }
        }
      });
    } else {
      gsap.utils.toArray('.feature').forEach(el => gsap.from(el, { y: 28, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } }));
    }
    gsap.utils.toArray('.work-heading h2, .expertise-heading h2, .experience-heading h2').forEach(el => gsap.from(el, { y: desktop ? 50 : 22, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } }));
    gsap.utils.toArray('.statement>span').forEach((el, i) => gsap.from(el, { color: '#92988c', y: desktop ? 20 : 10, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 50%', scrub: .6 } }));
    gsap.to('.asterisk', { rotation: 180, ease: 'none', scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
    gsap.utils.toArray('.archive-row').forEach(el => gsap.from(el, { y: 18, duration: .6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 98%', once: true } }));
    gsap.utils.toArray('.expertise-grid article').forEach((el, i) => gsap.from(el, { y: desktop ? 75 + i * 20 : 25, rotationX: desktop ? 7 : 0, transformPerspective: 1000, ease: 'none', scrollTrigger: { trigger: '.expertise-grid', start: 'top bottom', end: 'top 45%', scrub: 1 } }));
    gsap.utils.toArray('.timeline article').forEach(el => {
      gsap.from(el.querySelectorAll(':scope > div'), { y: 20, stagger: .1, duration: .7, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
      ScrollTrigger.create({ trigger: el, start: 'top 65%', end: 'bottom 35%', toggleClass: 'is-active' });
    });
    gsap.from('.contact-title i', { y: desktop ? 65 : 25, rotationX: desktop ? 18 : 0, transformPerspective: 1000, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'top 30%', scrub: 1.2 } });
    return () => { cinema.classList.remove('cinema-active'); cinemaTween = null; };
  });
  ScrollTrigger.refresh();
  if (smoother) {
    if (anchor && scrollPosition >= 10) smoother.scrollTop(Math.max(0, smoother.offset(anchor, 'top top') - anchorTop));
    else smoother.scrollTop(scrollPosition);
  } else window.scrollTo(0, restorePosition());
}
motion.addEventListener('click', () => { paused = !paused; configureMotion(); });
preference.addEventListener('change', e => { paused = e.matches; configureMotion(); });
configureMotion();
// Preserve URL hashes, keyboard focus, and the native anchor fallback.
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', e => {
  const hash = link.getAttribute('href'), target = document.querySelector(hash);
  if (!target) return;
  e.preventDefault();
  if (smoother && !paused) smoother.scrollTo(target, true, 'top 24px');
  else target.scrollIntoView({ behavior: paused ? 'instant' : 'smooth', block: 'start' });
  history.pushState(null, '', hash);
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}));
document.querySelectorAll('.feature-link').forEach((link, index) => link.addEventListener('focus', () => {
  if (!cinemaTween) return;
  const trigger = cinemaTween.scrollTrigger;
  const position = trigger.start + (trigger.end - trigger.start) * index / 2;
  if (smoother) smoother.scrollTo(position, false); else window.scrollTo(0, position);
  cinemaTween.progress(index / 2);
}));
const refresh = () => { if (gsapReady) ScrollTrigger.refresh(); };
window.addEventListener('load', refresh); document.fonts.ready.then(refresh);
const cursor = document.querySelector('.link-cursor');
if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
  document.querySelectorAll('.feature-link').forEach(el => {
    el.addEventListener('pointermove', e => { if (paused) return; cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; cursor.classList.add('active'); });
    el.addEventListener('pointerleave', () => cursor.classList.remove('active'));
  });
  document.querySelectorAll('.round-arrow, .visit>span').forEach(el => {
    el.addEventListener('pointermove', e => { if (paused || !gsapReady) return; const r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .18, duration: .3 }); });
    el.addEventListener('pointerleave', () => { if (gsapReady) gsap.to(el, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.4)' }); });
  });
}
document.getElementById('year').textContent = new Date().getFullYear();
