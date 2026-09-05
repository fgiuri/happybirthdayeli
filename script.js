// ================= SKY / SUNSET SCROLL ANIMATION =================
const skyCanvas = document.getElementById('sky');
const ctx = skyCanvas.getContext('2d');
let W, H, DPR;
let stars = [];

function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  skyCanvas.width = W * DPR; skyCanvas.height = H * DPR;
  skyCanvas.style.width = W+'px'; skyCanvas.style.height = H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  if(stars.length === 0){
    for(let i=0;i<140;i++){
      stars.push({x:Math.random()*W, y:Math.random()*H*0.75, r:Math.random()*1.4+.2, tw:Math.random()*Math.PI*2});
    }
  }
}
window.addEventListener('resize', resize);
resize();

function lerpColor(c1, c2, t){
  const a = c1.match(/\d+/g).map(Number);
  const b = c2.match(/\d+/g).map(Number);
  const r = a.map((v,i)=> Math.round(v + (b[i]-v)*t));
  return `rgb(${r[0]},${r[1]},${r[2]})`;
}

let scrollProgress = 0;
function updateScroll(){
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  scrollProgress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
}
window.addEventListener('scroll', updateScroll, {passive:true});
updateScroll();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function drawSky(t){
  const p = scrollProgress;

  let topColor, midColor, botColor;
  if(p < 0.5){
    const tt = p/0.5;
    topColor = lerpColor('rgb(27,32,56)','rgb(58,47,92)', tt);
    midColor = lerpColor('rgb(58,47,92)','rgb(232,90,66)', tt);
    botColor = lerpColor('rgb(74,59,107)','rgb(244,184,96)', tt);
  } else {
    const tt = (p-0.5)/0.5;
    topColor = lerpColor('rgb(58,47,92)','rgb(6,8,18)', tt);
    midColor = lerpColor('rgb(232,90,66)','rgb(14,16,32)', tt);
    botColor = lerpColor('rgb(244,184,96)','rgb(30,24,48)', tt);
  }

  const grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0, topColor);
  grad.addColorStop(0.55, midColor);
  grad.addColorStop(1, botColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);

  const starAlpha = Math.max(0, (p-0.35))*1.2;
  if(starAlpha > 0){
    ctx.save();
    for(const s of stars){
      const flick = reduceMotion ? 1 : (0.6 + Math.sin(t*0.001 + s.tw)*0.4);
      ctx.globalAlpha = Math.min(1, starAlpha) * flick;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = '#fff3e6';
      ctx.fill();
    }
    ctx.restore();
  }

  const sunVisible = Math.max(0, 1 - p/0.75);
  if(sunVisible > 0){
    const sunX = W*0.5;
    const sunY = H*(0.15 + p*0.75);
    const r = 46 + p*30;
    ctx.save();
    ctx.globalAlpha = sunVisible;
    const glow = ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,r*4);
    glow.addColorStop(0,'rgba(255,214,153,0.55)');
    glow.addColorStop(1,'rgba(255,214,153,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(sunX,sunY,r*4,0,Math.PI*2); ctx.fill();

    const sunGrad = ctx.createLinearGradient(0,sunY-r,0,sunY+r);
    sunGrad.addColorStop(0,'#fff7d6');
    sunGrad.addColorStop(1,'#ff9a5c');
    ctx.fillStyle = sunGrad;
    ctx.beginPath(); ctx.arc(sunX,sunY,r,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = 0.5 * (1-Math.min(1,p/0.8));
  const hgrad = ctx.createLinearGradient(0,H*0.62,0,H*0.72);
  hgrad.addColorStop(0,'rgba(255,154,92,0)');
  hgrad.addColorStop(1,'rgba(255,154,92,0.25)');
  ctx.fillStyle = hgrad;
  ctx.fillRect(0,H*0.6,W,H*0.15);
  ctx.restore();
}

function loop(t){
  drawSky(t);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ================= LIVE COUNTER =================
const START_DATE = new Date('2021-01-12T18:00:00');

function updateCounter(){
  const now = new Date();
  let diff = Math.max(0, now - START_DATE);
  const days = Math.floor(diff/86400000);
  const hours = Math.floor((diff%86400000)/3600000);
  const mins = Math.floor((diff%3600000)/60000);
  const secs = Math.floor((diff%60000)/1000);
  document.getElementById('c-days').textContent = days.toLocaleString('it-IT');
  document.getElementById('c-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('c-mins').textContent = String(mins).padStart(2,'0');
  document.getElementById('c-secs').textContent = String(secs).padStart(2,'0');
}
updateCounter();
setInterval(updateCounter, 1000);

// ================= SCROLL REVEAL (photos) =================
const items = document.querySelectorAll('[data-item]');

function revealItem(entry){
  const frame = entry.querySelector('.frame');
  const caption = entry.querySelector('.caption');
  frame.classList.add('revealed');
  caption.classList.add('revealed');
}

if('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        revealItem(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -10% 0px'});
  items.forEach(i=>io.observe(i));

  // safety net: if for any reason an item never intersects (e.g. very short
  // page, unusual viewport), reveal everything after a few seconds anyway.
  setTimeout(()=>{
    items.forEach(i=>revealItem(i));
  }, 4000);
} else {
  // no IntersectionObserver support: just show everything immediately
  items.forEach(i=>revealItem(i));
}

// ================= 21 CANDLES =================
const candlesRow = document.getElementById('candlesRow');
const CANDLE_COUNT = 21;
const candleEls = [];

for(let i=0;i<CANDLE_COUNT;i++){
  const c = document.createElement('div');
  c.className = 'candle-mini';
  c.style.setProperty('--d', (Math.random()*1.6).toFixed(2)+'s');
  c.innerHTML = '<div class="smoke"></div><div class="flame"></div><div class="wick"></div><div class="stick"></div>';
  candlesRow.appendChild(c);
  candleEls.push(c);
}

// ================= PARTICLES (confetti burst) =================
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];

function resizeParticleCanvas(){
  pCanvas.width = window.innerWidth * DPR;
  pCanvas.height = window.innerHeight * DPR;
  pCanvas.style.width = window.innerWidth+'px';
  pCanvas.style.height = window.innerHeight+'px';
  pCtx.setTransform(DPR,0,0,DPR,0,0);
}
resizeParticleCanvas();
window.addEventListener('resize', resizeParticleCanvas);

function burst(x,y){
  const colors = ['#f4b860','#ff7a5c','#fff3e6'];
  for(let i=0;i<90;i++){
    const angle = Math.random()*Math.PI*2;
    const speed = Math.random()*5+1.5;
    particles.push({
      x, y,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed - 3,
      life: 1,
      size: Math.random()*3+2,
      color: colors[Math.floor(Math.random()*colors.length)]
    });
  }
}

function animateParticles(){
  pCtx.clearRect(0,0,window.innerWidth, window.innerHeight);
  particles.forEach(p=>{
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06;
    p.life -= 0.011;
  });
  particles = particles.filter(p=>p.life>0);
  particles.forEach(p=>{
    pCtx.globalAlpha = Math.max(0,p.life);
    pCtx.fillStyle = p.color;
    pCtx.beginPath();
    pCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
    pCtx.fill();
  });
  pCtx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ================= BLOW OUT LOGIC =================
const blowBtn = document.getElementById('blowBtn');
const micBtn = document.getElementById('micBtn');
const micStatus = document.getElementById('micStatus');
const secretMsg = document.getElementById('secretMsg');
const blowControls = document.querySelector('.blow-controls');
let blownOut = false;

function blowOutCandles(){
  if(blownOut) return;
  blownOut = true;
  blowControls.classList.add('done');

  candleEls.forEach((c, i)=>{
    setTimeout(()=> c.classList.add('out'), i*35);
  });

  const rect = candlesRow.getBoundingClientRect();
  setTimeout(()=>{
    burst(rect.left+rect.width/2, rect.top+rect.height/2);
    secretMsg.classList.add('shown');
  }, CANDLE_COUNT*35 + 300);
}

blowBtn.addEventListener('click', blowOutCandles);

// optional: real microphone blow detection
let audioCtx, analyser, micStream, micActive = false;

micBtn.addEventListener('click', async ()=>{
  if(micActive || blownOut) return;
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    micStatus.textContent = 'il microfono non è supportato qui — usa il bottone sopra.';
    return;
  }
  try{
    micStatus.textContent = 'in ascolto... soffia! 🎤';
    micActive = true;
    micStream = await navigator.mediaDevices.getUserMedia({audio:true});
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(micStream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let loudFrames = 0;

    function checkVolume(){
      if(blownOut){
        micStream.getTracks().forEach(t=>t.stop());
        return;
      }
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for(let i=0;i<data.length;i++){
        const v = (data[i]-128)/128;
        sum += v*v;
      }
      const rms = Math.sqrt(sum/data.length);
      if(rms > 0.18){
        loudFrames++;
      } else {
        loudFrames = Math.max(0, loudFrames-1);
      }
      if(loudFrames > 6){
        blowOutCandles();
        micStream.getTracks().forEach(t=>t.stop());
        return;
      }
      requestAnimationFrame(checkVolume);
    }
    checkVolume();
  } catch(err){
    micActive = false;
    micStatus.textContent = 'permesso negato — nessun problema, usa il bottone sopra.';
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
