/* Derick & Christina — letter-opening invitation */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var scene = document.getElementById('scene');
  var doc = document.getElementById('doc');
  var peek = document.getElementById('peek');
  var sealBtn = document.getElementById('sealBtn');
  var skipBtn = document.getElementById('skipBtn');
  var RATIO = 1672 / 941;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- scroll reveals, started once the letter is showing ---- */
  var started = false;
  function startReveals() {
    if (started) return; started = true;
    var targets = Array.prototype.slice.call(document.querySelectorAll('.reveal, .names'));
    function show(el) { el.classList.add('is-visible'); }
    if (!('IntersectionObserver' in window)) { targets.forEach(show); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  if (!scene || !doc || !sealBtn) { startReveals(); return; }

  root.classList.add('is-locked');
  doc.setAttribute('aria-hidden', 'true');

  var opened = false;

  function finish() {
    scene.hidden = true;
    root.classList.remove('is-locked');
    doc.removeAttribute('aria-hidden');
    window.scrollTo(0, 0);
    doc.focus({ preventScroll: true });
    startReveals();
  }

  function showDoc() {
    doc.classList.add('is-open');
    window.scrollTo(0, 0);
  }

  function open(skip) {
    if (opened) return; opened = true;
    if (skip || reduce) { showDoc(); finish(); return; }

    scene.classList.add('is-opening');                       // seal fades, flap swings open
    setTimeout(function () { scene.classList.add('is-rising'); }, 850);   // letter slides up

    setTimeout(function () {                                  // letter grows to the full page
      var r = peek.getBoundingClientRect();
      var vw = root.clientWidth;
      var W = Math.min(vw, 480);
      var fly = document.createElement('div');
      fly.className = 'fly';
      fly.style.left = r.left + 'px'; fly.style.top = r.top + 'px';
      fly.style.width = r.width + 'px'; fly.style.height = r.height + 'px';
      document.body.appendChild(fly);
      scene.classList.add('is-flying');
      showDoc();
      doc.style.visibility = 'hidden';
      void fly.offsetWidth;                                   // commit start rect
      fly.style.left = ((vw - W) / 2) + 'px'; fly.style.top = '0px';
      fly.style.width = W + 'px'; fly.style.height = (W * RATIO) + 'px';

      setTimeout(function () {                                // swap in the real page
        doc.style.visibility = '';
        scene.classList.add('is-done');
        setTimeout(function () { fly.remove(); finish(); }, 250);
      }, 1100);
    }, 1950);
  }

  sealBtn.addEventListener('click', function () { open(false); });
  skipBtn.addEventListener('click', function () { open(true); });
})();
