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

  var opened = false;
  function openInvitation(e) {
    if (e) e.preventDefault();
    if (opened) return;
    opened = true;

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
