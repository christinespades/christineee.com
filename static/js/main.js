document.querySelectorAll('.link-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${e.offsetX}px`;
    ripple.style.top = `${e.offsetY}px`;
    btn.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Click effect on avatar + audio play
const avatar = document.querySelector('.avatar');
const audio = document.getElementById('bg-audio');

avatar.addEventListener('click', () => {
  // play/pause toggle
  if (audio.paused) {
    audio.volume = 0.35; // soft ambient
    audio.play().catch(() => {
      console.log("Autoplay blocked, user must click again.");
    });
  } else {
    audio.pause();
  }

  // small opacity click feedback
  avatar.style.opacity = '0.8';
  setTimeout(() => avatar.style.opacity = '1', 150);
});

document.querySelectorAll('.link-btn, .container').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    el.style.transform =
      `perspective(800px)
       rotateX(${y * -6}deg)
       rotateY(${x * 6}deg)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

<script>
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
</script>
