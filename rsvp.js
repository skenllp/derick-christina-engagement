/* RSVP form -> Google Sheet (via the Apps Script web app in google-sheet/Code.gs).
   Paste your deployed web-app URL below (see google-sheet/SETUP.md). */
(function () {
  'use strict';
  var RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwG4DDLzo4WH88SCxArIhF7b7notcIyTMovwCz61ebI1gCK-Hcy-H_GXUZtYuKUvtNBcg/exec';

  var form = document.getElementById('rsvpForm');
  if (!form) return;
  var nameEl = document.getElementById('rsvpName');
  var noteEl = document.getElementById('rsvpNote');
  var btn = document.getElementById('rsvpBtn');
  var statusEl = document.getElementById('rsvpStatus');
  var rows = Array.prototype.slice.call(form.querySelectorAll('.rsvp__ev'));

  rows.forEach(function (row) {
    var cb = row.querySelector('input[type=checkbox]');
    var box = row.querySelector('.rsvp__guests');
    var sel = row.querySelector('select');
    for (var i = 1; i <= 10; i++) { var o = document.createElement('option'); o.value = o.textContent = i; sel.appendChild(o); }
    cb.addEventListener('change', function () { box.hidden = !cb.checked; setStatus(''); });
  });

  function setStatus(msg, err) { statusEl.textContent = msg; statusEl.classList.toggle('is-error', !!err); }

  function collect() {
    var events = {};
    rows.forEach(function (row) {
      var cb = row.querySelector('input[type=checkbox]');
      if (cb.checked) events[cb.value] = parseInt(row.querySelector('select').value, 10) || 1;
    });
    return { name: nameEl.value.trim(), events: events, note: noteEl.value.trim(), website: form.elements.website.value };
  }

  function summary(d) {
    var lines = ['RSVP — Derick & Christina', 'Name: ' + d.name];
    Object.keys(d.events).forEach(function (k) { lines.push(k + ': ' + d.events[k] + (d.events[k] > 1 ? ' guests' : ' guest')); });
    if (d.note) lines.push('Note: ' + d.note);
    return lines.join('\n');
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return Promise.reject();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = collect();
    if (!d.name) { setStatus('Please enter your name.', true); nameEl.focus(); return; }
    if (!Object.keys(d.events).length) { setStatus('Please select at least one event.', true); return; }
    if (d.website) { setStatus('Thank you!'); return; } // honeypot: silently drop bots

    btn.disabled = true; setStatus('Sending…');

    if (!RSVP_ENDPOINT) { // not linked yet: fall back to copying the reply so it can be sent on WhatsApp
      copy(summary(d)).then(function () { setStatus('Copied — please send it to us on WhatsApp.'); },
                           function () { setStatus('RSVP is not connected yet.', true); })
        .then(function () { btn.disabled = false; });
      return;
    }

    // text/plain keeps this a "simple" request (no CORS preflight); Apps Script replies with JSON we can read
    fetch(RSVP_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(d) })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (!j || !j.ok) throw new Error((j && j.error) || 'rejected'); })
      .then(function () {
        setStatus('Thank you, ' + d.name.split(' ')[0] + '! Your RSVP has been received.');
        form.classList.add('is-sent');
        form.reset();
        rows.forEach(function (r) { r.querySelector('.rsvp__guests').hidden = true; });
      })
      .catch(function () { setStatus('Could not send. Please check your connection and try again.', true); })
      .then(function () { btn.disabled = false; });
  });
})();


/* Cocktail Party RSVP (inside the cocktail card) -> same Google Sheet endpoint */
(function () {
  'use strict';
  var RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwG4DDLzo4WH88SCxArIhF7b7notcIyTMovwCz61ebI1gCK-Hcy-H_GXUZtYuKUvtNBcg/exec';
  var form = document.getElementById('cokForm');
  if (!form) return;
  var nameEl = document.getElementById('cokName');
  var guestsEl = document.getElementById('cokGuests');
  var btn = document.getElementById('cokBtn');
  var statusEl = document.getElementById('cokStatus');
  for (var i = 1; i <= 10; i++) { var o = document.createElement('option'); o.value = o.textContent = i; guestsEl.appendChild(o); }

  function setStatus(msg, err) { statusEl.textContent = msg; statusEl.classList.toggle('is-error', !!err); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameEl.value.trim();
    if (!name) { setStatus('Please enter your name.', true); nameEl.focus(); return; }
    if (form.elements.website.value) { setStatus('Thank you!'); return; } // honeypot
    var events = {}; events['Cocktail Party'] = parseInt(guestsEl.value, 10) || 1;
    var d = { name: name, events: events, note: '', website: '' };
    btn.disabled = true; setStatus('Sending…');
    fetch(RSVP_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(d) })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (!j || !j.ok) throw new Error((j && j.error) || 'rejected'); })
      .then(function () { setStatus('Thank you, ' + name.split(' ')[0] + '! Your RSVP has been received.'); form.reset(); })
      .catch(function () { setStatus('Could not send. Please check your connection and try again.', true); })
      .then(function () { btn.disabled = false; });
  });
})();
