let zeonBuffer = '';
const zeonTarget = 'zeon';

window.addEventListener('keydown', function(e) {
  // Ignore if typing in input/textarea
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  zeonBuffer += e.key.toLowerCase();
  if (zeonBuffer.length > zeonTarget.length) {
    zeonBuffer = zeonBuffer.slice(-zeonTarget.length);
  }
  if (zeonBuffer === zeonTarget) {
    window.location.href = 'https://www.youtube.com/@zeonplaych'; // Ganti dengan channel kamu jika perlu
  }
});

// Easter Egg: Shake to play "Hey, Stop!"
(function() {
  if (!('DeviceMotionEvent' in window)) return;

  let lastX = null, lastY = null, lastZ = null, lastTime = 0;
  let shakeThreshold = 15; // Adjust for sensitivity
  let cooldown = false;
  const cooldownTime = 1500; // ms

  const audio = document.getElementById('heyStopAudio');

  function playHeyStop() {
    // Play audio
    audio.currentTime = 0;
    audio.play();

    // Haptic feedback (if supported)
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);

    // Visual feedback (subtle flash)
    document.body.classList.add('shake-flash');
    setTimeout(() => document.body.classList.remove('shake-flash'), 350);
  }

  window.addEventListener('devicemotion', function(e) {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;

    const now = Date.now();
    if (lastX !== null && lastY !== null && lastZ !== null) {
      const deltaX = Math.abs(acc.x - lastX);
      const deltaY = Math.abs(acc.y - lastY);
      const deltaZ = Math.abs(acc.z - lastZ);

      if ((deltaX + deltaY + deltaZ) > shakeThreshold && !cooldown) {
        cooldown = true;
        playHeyStop();
        setTimeout(() => { cooldown = false; }, cooldownTime);
      }
    }
    lastX = acc.x;
    lastY = acc.y;
    lastZ = acc.z;
    lastTime = now;
  }, { passive: true });
})();