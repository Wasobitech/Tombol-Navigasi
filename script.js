(() => {
  const machine = document.querySelector('.ccm-11__machine');
  const wheel = machine.querySelector('.ccm-11__wheel');
  const stops = [...machine.querySelectorAll('.ccm-11__stop')];
  const current = machine.querySelector('.ccm-11__current');
  const live = machine.querySelector('.ccm-11__live');
  const n = stops.length, step = 360 / n;
  let rot = 0, active = 0;
  let isNavigating = false; // Mencegah klik ganda saat animasi berjalan

  const setStopRot = () => stops.forEach((s) => s.style.rotate = (-rot) + 'deg');
  
  const goTo = (idx, triggerRedirect = false) => {
    if (isNavigating) return;
    
    idx = ((idx % n) + n) % n;
    const target = -idx * step;
    let delta = target - (((rot % 360) + 360) % 360 === 0 ? 0 : rot % 360);
    delta = ((delta % 360) + 540) % 360 - 180;
    rot += delta;
    
    wheel.style.setProperty('--rot', rot + 'deg');
    setStopRot();
    
    stops.forEach((s, k) => { 
      s.classList.toggle('is-active', k === idx); 
      s.setAttribute('aria-pressed', String(k === idx)); 
    });
    
    active = idx;
    current.textContent = stops[idx].textContent;
    live.textContent = stops[idx].textContent + ' selected';

    // Jika dipicu oleh klik tombol menu, tunggu animasi selesai lalu pindah URL
    if (triggerRedirect) {
      const link = stops[idx].querySelector('a');
      if (link && link.getAttribute('href')) {
        isNavigating = true;
        setTimeout(() => {
          window.location.href = link.getAttribute('href');
        }, 700); // 700ms disamakan dengan durasi transition CSS .ccm-11__wheel
      }
    }
  };

  // Klik langsung pada tombol menu lingkaran
  stops.forEach((s, k) => s.addEventListener('click', (e) => {
    e.preventDefault(); // Matikan navigasi instan bawaan tag <a> agar animasi roda jalan dulu
    goTo(k, true);
  }));

  // Klik tombol panah kontrol di tengah (hanya berputar, klik lagi untuk masuk jika diinginkan)
  machine.querySelector('.ccm-11__prev').addEventListener('click', () => goTo(active - 1));
  machine.querySelector('.ccm-11__next').addEventListener('click', () => goTo(active + 1));
})();
