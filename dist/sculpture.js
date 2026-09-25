// Classic script supports direct file opening; isolate state from app.js.
(() => {
// Layered, accessible code interface. No WebGL dependency.
const scene = document.querySelector('.tech-scene');
const surface = document.querySelector('.tech-wrap');
if (!scene || !surface) return;
let paused = document.body.classList.contains('no-motion');
let movement;
function resetScene() {
  if (movement) { movement.revert(); movement = null; }
  if (!window.gsap || paused) { scene.style.transform=''; return; }
  movement = gsap.context(() => {
    gsap.to('.code-window', {y:-9, duration:3.6, repeat:-1, yoyo:true, ease:'sine.inOut'});
    gsap.to('.build-chip', {y:7, duration:3, repeat:-1, yoyo:true, ease:'sine.inOut'});
    gsap.to('.mobile-preview',{y:-8,duration:4,repeat:-1,yoyo:true,ease:'sine.inOut'});
    gsap.to('.design-cursor',{x:28,y:15,duration:4.5,repeat:-1,yoyo:true,ease:'sine.inOut'});
    gsap.to('.code-caret', {opacity:.15, duration:.8, repeat:-1, yoyo:true, ease:'steps(1)'});
  }, surface);
}
surface.addEventListener('pointermove', e => {
  if(paused || !window.gsap || e.pointerType==='touch') return;
  const r=surface.getBoundingClientRect();
  gsap.to(scene,{rotationX:10-(e.clientY-r.top-r.height/2)/r.height*8,rotationY:-16+(e.clientX-r.left-r.width/2)/r.width*12,rotationZ:5,duration:.65,ease:'power2.out',overwrite:'auto'});
});
surface.addEventListener('pointerleave',()=>{if(window.gsap&&!paused)gsap.to(scene,{rotationX:10,rotationY:-16,rotationZ:5,duration:.8,ease:'power2.out',overwrite:'auto'});});
window.addEventListener('portfolio:motion',e=>{paused=e.detail.paused;if(window.gsap)gsap.killTweensOf(scene);resetScene();});
resetScene();

})();
