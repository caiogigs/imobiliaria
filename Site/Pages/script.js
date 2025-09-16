const carrossel = document.getElementById('carrossel');

let speed = 0;           // pixels por frame
const maxSpeed = 12;     // velocidade máxima
const zonePct = 0.20;    // 20% da largura é a zona ativa


// loop contínuo com requestAnimationFrame
function rafLoop() {
  if (speed !== 0) {
    carrossel.scrollLeft += speed;
  }
  requestAnimationFrame(rafLoop);
}
requestAnimationFrame(rafLoop);

// calcula velocidade conforme a posição do mouse
carrossel.addEventListener('mousemove', (e) => {
  const rect = carrossel.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const zone = rect.width * zonePct;

  if (x < zone) {
    const pct = (zone - x) / zone; // 0..1
    speed = -Math.max(1, Math.round(pct * maxSpeed));
  } else if (x > rect.width - zone) {
    const pct = (x - (rect.width - zone)) / zone;
    speed = Math.max(1, Math.round(pct * maxSpeed));
  } else {
    speed = 0;
  }
});

carrossel.addEventListener('mouseleave', () => { speed = 0; });

// em dispositivos de toque, não brigar com o swipe do usuário
carrossel.addEventListener('touchstart', () => { speed = 0; });
carrossel.addEventListener('touchmove', () => { speed = 0; });
carrossel.addEventListener('touchend', () => { speed = 0; });

// opcional: navegação com teclado
carrossel.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') carrossel.scrollBy({left: 150});
  if (e.key === 'ArrowLeft') carrossel.scrollBy({left: -150});
});
