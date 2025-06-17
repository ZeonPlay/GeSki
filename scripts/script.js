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

// Shake detection and audio playback
(function() {
  if (!('DeviceMotionEvent' in window)) return;

  let lastX = null, lastY = null, lastZ = null;
  let shakeThreshold = 15; // Adjust for sensitivity
  let cooldown = false;
  const cooldownTime = 1500; // ms

  const audio = document.getElementById('heyStopAudio');

  // iOS 13+ permission request
  function requestMotionPermission() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().catch(() => {});
    }
  }
  window.addEventListener('click', requestMotionPermission, { once: true });

  function playHeyStop() {
    audio.currentTime = 0;
    audio.play();
    // Visual feedback
    document.body.classList.add('shake-flash');
    setTimeout(() => document.body.classList.remove('shake-flash'), 350);
    // Haptic feedback (Android)
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
  }

  window.addEventListener('devicemotion', function(e) {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;

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
  }, { passive: true });
})();