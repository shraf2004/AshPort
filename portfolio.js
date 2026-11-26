const toggle = document.querySelector('.menu-toggle');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  document.querySelector('.nav-links').classList.toggle('open', open);
});
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), {threshold: .08});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
  button.classList.add('active'); button.setAttribute('aria-pressed', 'true');
  document.querySelectorAll('[data-category]').forEach(card => card.hidden = button.dataset.filter !== 'all' && !card.dataset.category.split(' ').includes(button.dataset.filter));
}));
// A small native canvas scene keeps the orbital visual dependency-free.
const canvas = document.querySelector('#orbit');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, rotation = 0, pointer = 0, frame;
  const resize = () => { const box = canvas.getBoundingClientRect(); width = box.width; height = box.height; const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = width*dpr; canvas.height = height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); draw(); };
  const draw = () => {
    ctx.clearRect(0,0,width,height);
    const radius = Math.min(width,height)*.32, cx=width/2, cy=height/2;
    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,radius*1.55); glow.addColorStop(0,'rgba(190,237,106,.09)'); glow.addColorStop(1,'rgba(190,237,106,0)'); ctx.fillStyle=glow; ctx.fillRect(0,0,width,height);
    const project=(x,y,z)=> { const a=rotation+pointer, xx=x*Math.cos(a)+z*Math.sin(a), zz=-x*Math.sin(a)+z*Math.cos(a); return [cx+xx*radius,cy+(y*.91-zz*.3)*radius,zz]; };
    for(let ring=0;ring<13;ring++) {ctx.beginPath(); for(let i=0;i<=120;i++){const t=i/120*Math.PI*2, phi=ring/12*Math.PI, p=project(Math.sin(phi)*Math.cos(t),Math.cos(phi),Math.sin(phi)*Math.sin(t)); i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.strokeStyle='rgba(190,237,106,.22)';ctx.lineWidth=.7;ctx.stroke();}
    for(let ring=0;ring<16;ring++){ctx.beginPath();for(let i=0;i<=120;i++){const t=i/120*Math.PI*2,a=ring/16*Math.PI,p=project(Math.cos(t)*Math.cos(a),Math.sin(t),Math.cos(t)*Math.sin(a));i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.strokeStyle='rgba(190,237,106,.17)';ctx.stroke();}
    for(let ring=0;ring<3;ring++){ctx.save();ctx.translate(cx,cy);ctx.rotate(-.4+ring*.8);ctx.beginPath();ctx.ellipse(0,0,radius*(1.35+ring*.1),radius*.35,0,0,Math.PI*2);ctx.strokeStyle='rgba(224,231,216,.22)';ctx.stroke();const t=rotation*(ring+1)+ring*2;ctx.beginPath();ctx.arc(Math.cos(t)*radius*(1.35+ring*.1),Math.sin(t)*radius*.35,3,0,Math.PI*2);ctx.fillStyle='#c1f17b';ctx.fill();ctx.restore();}
  };
  canvas.addEventListener('pointermove',e=> {pointer=(e.offsetX/width-.5)*.5;if(reduced)draw();});
  new ResizeObserver(resize).observe(canvas);
  const animate=()=>{rotation+=.0025;draw();frame=requestAnimationFrame(animate);};
  const visibility = new IntersectionObserver(entries=>{cancelAnimationFrame(frame);if(entries[0].isIntersecting&&!reduced)animate();}); visibility.observe(canvas);
}
