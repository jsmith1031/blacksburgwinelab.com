/* Blacksburg Wine Lab: opening, navigation, open/closed status and reservation requests. */

(function () {
  'use strict';

  // Opening hours in minutes after midnight, indexed by day (0 = Sunday). null = closed.
  var HOURS = [
    null,
    [15 * 60, 22 * 60],
    [15 * 60, 22 * 60],
    [15 * 60, 22 * 60],
    [15 * 60, 22 * 60],
    [11 * 60 + 30, 22 * 60],
    [11 * 60 + 30, 22 * 60]
  ];
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MAX_PARTY = 8;
  var RESERVATION_EMAIL = 'info@winelab.com';

  function formatTime(minutes) {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    var suffix = h >= 12 ? 'pm' : 'am';
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + (m ? ':' + (m < 10 ? '0' + m : m) : '') + ' ' + suffix;
  }

  // Current day and time at the restaurant, whatever the visitor's own time zone.
  function blacksburgNow() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
    }).formatToParts(new Date());
    var out = {};
    parts.forEach(function (p) { out[p.type] = p.value; });
    return { day: DAY_NAMES.indexOf(out.weekday), minutes: parseInt(out.hour, 10) * 60 + parseInt(out.minute, 10) };
  }

  /* ----- Opening animation ----- */

  var intro = document.getElementById('intro');
  if (intro) {
    var skipIntro = function () {
      intro.classList.add('is-skipped');
      document.documentElement.classList.add('intro-skipped');
    };
    intro.addEventListener('click', skipIntro);
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skipIntro();
      document.removeEventListener('keydown', onKey);
    });
    intro.addEventListener('animationend', function (e) {
      if (e.target === intro) intro.remove();
    });
  }

  /* ----- Header ----- */

  var header = document.getElementById('header');
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  function onScroll() {
    header.classList.toggle('is-solid', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setNav(open) {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  }
  toggle.addEventListener('click', function () {
    setNav(!nav.classList.contains('is-open'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });

  /* ----- Food and wine showcase: a ring of photos that turns in 3D ----- */

  (function () {
    var hero = document.getElementById('top');
    var stage = document.getElementById('stage');
    var ring = document.getElementById('ring');
    var caption = document.getElementById('caption');
    if (!stage || !ring) return;

    var cards = Array.prototype.slice.call(ring.children);
    var STEP = 360 / cards.length;
    var IDLE_SPEED = 7;             // degrees per second while nobody is touching it
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var angle = 0;                  // current rotation of the ring, in degrees
    var target = null;              // angle to ease towards after a button, key or drag
    var velocity = 0;               // degrees per second carried over from a drag
    var dragging = false;
    var idle = !reduceMotion;
    var idleTimer = null;
    var front = -1;
    var last = performance.now();

    cards.forEach(function (card, i) { card.style.setProperty('--i', i); });

    function frontIndex() {
      var n = cards.length;
      return ((Math.round(-angle / STEP) % n) + n) % n;
    }

    function render() {
      ring.style.setProperty('--turn', angle + 'deg');
      cards.forEach(function (card, i) {
        // 1 when the card faces the visitor, -1 when it is at the back of the ring.
        var facing = Math.cos((i * STEP + angle) * Math.PI / 180);
        card.style.setProperty('--lit', (0.42 + 0.58 * Math.max(0, facing)).toFixed(3));
      });
      var index = frontIndex();
      if (index !== front) {
        front = index;
        caption.innerHTML = '';
        var name = document.createElement('strong');
        var note = document.createElement('span');
        name.textContent = cards[index].getAttribute('data-name');
        note.textContent = cards[index].getAttribute('data-note');
        caption.appendChild(name);
        caption.appendChild(note);
      }
    }

    function pauseIdle() {
      idle = false;
      clearTimeout(idleTimer);
      if (!reduceMotion) idleTimer = setTimeout(function () { idle = true; }, 6000);
    }

    function snap() { target = Math.round(angle / STEP) * STEP; }

    function turnBy(steps) {
      pauseIdle();
      velocity = 0;
      var base = target === null ? Math.round(angle / STEP) * STEP : target;
      target = base - steps * STEP;
      // Only announce the caption to screen readers when the visitor asked for the change.
      caption.setAttribute('aria-live', 'polite');
    }

    function tick(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging) {
        if (Math.abs(velocity) > 4) {
          angle += velocity * dt;
          velocity *= Math.pow(0.04, dt);
          if (Math.abs(velocity) <= 4) { velocity = 0; snap(); }
        } else if (target !== null) {
          var gap = target - angle;
          if (Math.abs(gap) < 0.05) { angle = target; target = null; }
          else angle += gap * Math.min(1, dt * 7);
        } else if (idle) {
          angle -= IDLE_SPEED * dt;
        }
      }
      render();
      requestAnimationFrame(tick);
    }

    // Drag or swipe to spin.
    var startX = 0, startAngle = 0, lastX = 0, lastT = 0;
    stage.addEventListener('pointerdown', function (e) {
      dragging = true;
      target = null;
      velocity = 0;
      startX = lastX = e.clientX;
      startAngle = angle;
      lastT = performance.now();
      caption.setAttribute('aria-live', 'off');
      pauseIdle();
      stage.classList.add('is-dragging');
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var now = performance.now();
      var perPixel = 0.32;
      angle = startAngle + (e.clientX - startX) * perPixel;
      if (now > lastT) velocity = (e.clientX - lastX) * perPixel / ((now - lastT) / 1000);
      lastX = e.clientX;
      lastT = now;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      if (performance.now() - lastT > 120) velocity = 0;
      velocity = Math.max(-500, Math.min(500, velocity));
      if (Math.abs(velocity) <= 4) snap();
      pauseIdle();
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    document.getElementById('prevCard').addEventListener('click', function () { turnBy(-1); });
    document.getElementById('nextCard').addEventListener('click', function () { turnBy(1); });
    document.getElementById('showcase').addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { turnBy(-1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { turnBy(1); e.preventDefault(); }
    });

    // The lights and the ring lean a little towards the pointer.
    if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
      hero.addEventListener('pointermove', function (e) {
        var box = hero.getBoundingClientRect();
        hero.style.setProperty('--px', ((e.clientX - box.left) / box.width * 2 - 1).toFixed(3));
        hero.style.setProperty('--py', ((e.clientY - box.top) / box.height * 2 - 1).toFixed(3));
      });
    }

    render();
    requestAnimationFrame(tick);
  })();

  /* ----- Open or closed right now ----- */

  function updateStatus() {
    var el = document.getElementById('status');
    var now;
    try { now = blacksburgNow(); } catch (e) { return; }
    if (now.day < 0) return;

    var today = HOURS[now.day];
    var text;
    var open = false;

    if (today && now.minutes >= today[0] && now.minutes < today[1]) {
      open = true;
      text = 'Open now until ' + formatTime(today[1]);
    } else if (today && now.minutes < today[0]) {
      text = 'Opens today at ' + formatTime(today[0]);
    } else {
      for (var i = 1; i <= 7; i++) {
        var d = (now.day + i) % 7;
        if (HOURS[d]) {
          text = 'Closed now. Opens ' + (i === 1 ? 'tomorrow' : DAY_NAMES[d]) + ' at ' + formatTime(HOURS[d][0]);
          break;
        }
      }
    }
    el.textContent = text;
    el.classList.toggle('is-open', open);

    document.querySelectorAll('.hours tr[data-days]').forEach(function (row) {
      var days = row.getAttribute('data-days').split(',');
      row.classList.toggle('is-today', days.indexOf(String(now.day)) !== -1);
    });
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ----- Reservation request ----- */

  var form = document.getElementById('reserveForm');
  var msg = document.getElementById('formMsg');
  var dateInput = document.getElementById('res_date');

  function isoDate(d) {
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
  }
  dateInput.min = isoDate(new Date());

  function showMessage(text, kind) {
    msg.textContent = text;
    msg.className = 'form-msg ' + (kind === 'ok' ? 'is-ok' : 'is-error');
    msg.hidden = false;
  }

  // Returns { field, message } for the first problem found, or null if the request is valid.
  function validate(v) {
    if (!v.name) return { field: 'name', message: 'Enter the name for the reservation.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return { field: 'email', message: 'Enter an email address so we can confirm, like name@example.com.' };
    if (v.phone.replace(/\D/g, '').length < 10) return { field: 'phone', message: 'Enter a phone number with area code.' };

    var size = parseInt(v.size, 10);
    if (!size || size < 1) return { field: 'size', message: 'Enter how many guests are coming.' };
    if (size > MAX_PARTY) return { field: 'size', message: 'For more than ' + MAX_PARTY + ' guests, email ' + RESERVATION_EMAIL + ' or call (540) 605-7291 and we will plan it with you.' };

    if (!v.date) return { field: 'date', message: 'Choose a date.' };
    var parts = v.date.split('-');
    var date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return { field: 'date', message: 'That date has passed. Choose today or later.' };

    var hours = HOURS[date.getDay()];
    if (!hours) return { field: 'date', message: 'We are closed on ' + DAY_NAMES[date.getDay()] + 's. Choose another day.' };

    if (!v.time) return { field: 'time', message: 'Choose a time.' };
    var t = v.time.split(':');
    var minutes = parseInt(t[0], 10) * 60 + parseInt(t[1], 10);
    if (minutes < hours[0] || minutes >= hours[1]) {
      return { field: 'time', message: 'On ' + DAY_NAMES[date.getDay()] + 's we are open ' + formatTime(hours[0]) + ' to ' + formatTime(hours[1]) + '. Choose a time in that window.' };
    }
    if (date.getTime() === today.getTime()) {
      var now = new Date();
      if (minutes <= now.getHours() * 60 + now.getMinutes()) return { field: 'time', message: 'That time has already passed today.' };
    }
    return null;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = {};
    ['name', 'email', 'phone', 'size', 'date', 'time'].forEach(function (key) {
      var input = form.elements[key];
      v[key] = input.value.trim();
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
    });

    var problem = validate(v);
    if (problem) {
      var bad = form.elements[problem.field];
      bad.classList.add('is-invalid');
      bad.setAttribute('aria-invalid', 'true');
      showMessage(problem.message, 'error');
      bad.focus();
      return;
    }

    var t = v.time.split(':');
    var when = new Date(v.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    var timeText = formatTime(parseInt(t[0], 10) * 60 + parseInt(t[1], 10));
    var subject = 'Reservation request: ' + v.name + ', ' + when + ' at ' + timeText;
    var body = [
      'Hello, I would like to reserve a table.',
      '',
      'Name: ' + v.name,
      'Guests: ' + v.size,
      'Date: ' + when,
      'Time: ' + timeText,
      'Phone: ' + v.phone,
      'Email: ' + v.email
    ].join('\n');

    window.location.href = 'mailto:' + RESERVATION_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    showMessage('Your email app should open with the request for ' + when + ' at ' + timeText + '. Send that email to finish. If nothing opened, call (540) 605-7291.', 'ok');
  });
})();
