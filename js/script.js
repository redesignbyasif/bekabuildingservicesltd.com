/* ==========================================================================
   BBS Ltd — homepage interactions
   Vanilla JS, no dependencies. Everything degrades gracefully.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;

  /* ---------------------------------------------------------------- header */
  var hdr = doc.getElementById('hdr');
  var lastY = window.scrollY;
  var onScroll = function () {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle('is-stuck', y > 12);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------ mobile nav */
  var burger = doc.getElementById('burger');
  var nav = doc.getElementById('nav');

  function setNav(open) {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', open);
    body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    /* keep background content out of the tab order + AT tree while open */
    doc.querySelectorAll('main, footer, .fabs').forEach(function (el) {
      if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });
  }
  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        burger.focus();
      }
    });
  }
  /* reset drawer state when resizing up to desktop */
  var mq = window.matchMedia('(min-width: 1024px)');
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function (e) {
    if (e.matches) setNav(false);
  });

  /* ------------------------------------------------------------------- FAQ */
  var acc = doc.getElementById('acc');
  if (acc) {
    var buttons = Array.prototype.slice.call(acc.querySelectorAll('.acc__btn'));
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        buttons.forEach(function (b) {
          var p = doc.getElementById(b.getAttribute('aria-controls'));
          b.setAttribute('aria-expanded', 'false');
          if (p) p.hidden = true;
        });
        if (!open) {
          var panel = doc.getElementById(btn.getAttribute('aria-controls'));
          btn.setAttribute('aria-expanded', 'true');
          if (panel) panel.hidden = false;
        }
      });
    });
  }

  /* ------------------------------------------------------------------ year */
  var yr = doc.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* --------------------------------------------------------------- reveals */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = [
    '.sec-head', '.intro__aside', '.intro__body', '.svc__lead', '.svc__card',
    '.work__item', '.why__media', '.why__body', '.steps__item', '.review',
    '.reviews__score', '.areas__grid > div', '.faq__head', '.acc__item',
    '.cta__copy', '.qform', '.ftr__top > div'
  ];
  var nodes = doc.querySelectorAll(revealTargets.join(','));
  if (!reduce && 'IntersectionObserver' in window) {
    nodes.forEach(function (el, i) {
      el.setAttribute('data-reveal', '');
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    nodes.forEach(function (el) { io.observe(el); });

    /* failsafe: anything already on screen (or if IO never fires) is shown */
    var show = function (el) { el.classList.add('is-in'); };
    requestAnimationFrame(function () {
      nodes.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { show(el); io.unobserve(el); }
      });
    });
    window.addEventListener('load', function () {
      nodes.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) { show(el); io.unobserve(el); }
      });
    });
    setTimeout(function () {
      nodes.forEach(function (el) { if (!el.classList.contains('is-in')) show(el); });
    }, 2600);
  }

  /* ------------------------------------------------------------ work rail */
  var rail = doc.querySelector('.work__rail');
  if (rail && window.matchMedia('(max-width: 1023px)').matches) {
    var isDown = false, startX = 0, startLeft = 0;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      isDown = true; startX = e.clientX; startLeft = rail.scrollLeft;
      rail.setPointerCapture(e.pointerId);
    });
    rail.addEventListener('pointermove', function (e) {
      if (!isDown) return;
      rail.scrollLeft = startLeft - (e.clientX - startX);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      rail.addEventListener(ev, function () { isDown = false; });
    });
  }

  /* --------------------------------------------------------- quote form
     No backend is connected. We compose a pre-filled email to the real
     company inbox and open the visitor's mail client — no fake success. */
  var form = doc.getElementById('quoteForm');
  if (form) {
    var status = doc.createElement('p');
    status.className = 'qform__status';
    status.hidden = true;
    status.setAttribute('role', 'status');
    form.appendChild(status);

    var showError = function (input, msg) {
      var field = input.closest('.field');
      var err = doc.querySelector('.field__err[data-for="' + input.id + '"]');
      field.classList.toggle('is-bad', !!msg);
      if (err) err.textContent = msg || '';
    };

    var validate = function () {
      var ok = true;
      var name = form.querySelector('#q-name');
      var phone = form.querySelector('#q-phone');
      var email = form.querySelector('#q-email');
      var service = form.querySelector('#q-service');

      if (name.value.trim().length < 2) { showError(name, 'Please enter your name.'); ok = false; } else showError(name, '');
      var digits = phone.value.replace(/[^\d]/g, '');
      if (digits.length < 9) { showError(phone, 'Please enter a phone number we can call.'); ok = false; } else showError(phone, '');
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        showError(email, 'That email address looks incomplete.'); ok = false;
      } else showError(email, '');
      if (!service.value) { showError(service, 'Please choose a service.'); ok = false; } else showError(service, '');

      if (!ok) {
        var firstBad = form.querySelector('.is-bad input, .is-bad select');
        if (firstBad) firstBad.focus();
      }
      return ok;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      var val = function (id) { var el = form.querySelector(id); return el ? el.value.trim() : ''; };
      var lines = [
        'Name: ' + val('#q-name'),
        'Phone: ' + val('#q-phone'),
        'Email: ' + (val('#q-email') || '—'),
        'Postcode: ' + (val('#q-postcode') || '—'),
        'Service: ' + val('#q-service'),
        '',
        'Details:',
        (val('#q-message') || '—'),
        '',
        '— Sent from the BBS Ltd homepage redesign demo'
      ];
      var subject = 'Quote request — ' + val('#q-service');
      var href = 'mailto:BBServicesLTD@hotmail.com?subject=' + encodeURIComponent(subject) +
                 '&body=' + encodeURIComponent(lines.join('\n'));

      status.hidden = false;
      status.innerHTML = 'Opening your email app with these details, addressed to <strong>BBServicesLTD@hotmail.com</strong>. ' +
        'If nothing opens, call <a href="tel:+447868361125">07868 361125</a> or ' +
        '<a href="' + href + '">send the email manually</a>.';
      window.location.href = href;
    });

    /* clear an error as soon as the visitor fixes the field */
    form.addEventListener('input', function (e) {
      var t = e.target;
      if (t === form.querySelector('#q-name') || t === form.querySelector('#q-phone') ||
          t === form.querySelector('#q-email') || t === form.querySelector('#q-service')) {
        showError(t, '');
      }
    });
    form.addEventListener('change', function (e) {
      if (e.target.id === 'q-service') showError(e.target, '');
    });
  }

  /* --------------------------------------------------- smooth anchor offset */
  doc.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = doc.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerH = hdr ? hdr.offsetHeight : 70;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });
})();
