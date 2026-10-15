/* Derick Mathew & Christina Cherian — Engagement Invitation */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var opening = document.getElementById('opening');
  var openBtn = document.getElementById('openBtn');
  var main = document.getElementById('invitation');
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Scroll reveals ------------------------------------------------
     Started only once the invitation is visible, so the animations are
     seen rather than played behind the opening screen. */
  var revealsStarted = false;
  function startReveals() {
    if (revealsStarted) return;
    revealsStarted = true;

    var targets = Array.prototype.slice.call(
      document.querySelectorAll('.reveal, .names, .panel--reception, .panel--closing')
    );
    function show(el) { el.classList.add('is-visible'); }

    if (!('IntersectionObserver' in window)) {
      targets.forEach(show);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---- Opening screen ------------------------------------------------ */
  if (!opening || !openBtn || !main) {
    startReveals();
    return;
  }

  root.classList.add('is-locked');
  if ('inert' in main) main.inert = true;

  /* ---- Background music --------------------------------------------- */
  var bgMusic = document.getElementById('bgMusic');
  var musicToggle = document.getElementById('musicToggle');
  var iconSound = musicToggle && musicToggle.querySelector('.icon-sound');
  var iconMute  = musicToggle && musicToggle.querySelector('.icon-mute');
  var musicStarted = false;

  function startMusic() {
    if (!bgMusic || musicStarted) return;
    musicStarted = true;
    bgMusic.volume = 0.5;
    var promise = bgMusic.play();
    if (promise !== undefined) {
      promise.catch(function () { /* autoplay blocked — user can unmute manually */ });
    }
    if (musicToggle) musicToggle.style.display = 'flex';
  }

  if (musicToggle) {
    musicToggle.style.display = 'none'; // hidden until music starts
    musicToggle.addEventListener('click', function () {
      if (!bgMusic) return;
      if (bgMusic.paused) {
        bgMusic.play();
        iconSound.style.display = '';
        iconMute.style.display  = 'none';
        musicToggle.setAttribute('aria-label', 'Mute music');
        musicToggle.title = 'Mute music';
      } else {
        bgMusic.pause();
        iconSound.style.display = 'none';
        iconMute.style.display  = '';
        musicToggle.setAttribute('aria-label', 'Unmute music');
        musicToggle.title = 'Unmute music';
      }
    });
  }

  var opened = false;
  function openInvitation(e) {
    if (e) e.preventDefault();
    if (opened) return;
    opened = true;

    startMusic();

    window.scrollTo(0, 0);
    if ('inert' in main) main.inert = false;

    opening.classList.add('is-opening');     // golden glow
    opening.classList.add('is-leaving');     // 1.1s fade into the invitation

    setTimeout(startReveals, reduceMotion ? 0 : 450);
    setTimeout(function () {
      opening.hidden = true;
      root.classList.remove('is-locked');
      main.focus({ preventScroll: true });
    }, reduceMotion ? 30 : 1350);
  }

  openBtn.addEventListener('click', openInvitation);
})();
