/* Navigation state and the screenshot viewer. The pages work without this file:
   the menu falls back to a wrapped row and every image link opens the full file. */
(function () {
  'use strict';

  var nav = document.querySelector('.site-nav');
  if (nav) {
    var toggle = nav.querySelector('.nav-toggle');
    var setScrolled = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    var closeMenu = function () {
      nav.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });

    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      Array.prototype.forEach.call(nav.querySelectorAll('.nav-links a'), function (link) {
        link.addEventListener('click', closeMenu);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          closeMenu();
          toggle.focus();
        }
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 920) closeMenu();
      });
    }
  }

  var links = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox]'));
  if (!links.length || typeof window.HTMLDialogElement !== 'function') return;

  var icon = function (d) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  };

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Image viewer');
  dialog.innerHTML =
    '<figure class="lb-figure">' +
      '<img class="lb-img" alt="">' +
      '<figcaption class="lb-caption">' +
        '<span class="lb-text"></span>' +
        '<span class="lb-count"></span>' +
        '<a class="lb-full" href="#">Full resolution</a>' +
      '</figcaption>' +
    '</figure>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Previous image">' + icon('M15 5l-7 7 7 7') + '</button>' +
    '<button class="lb-btn lb-next" type="button" aria-label="Next image">' + icon('M9 5l7 7-7 7') + '</button>' +
    '<button class="lb-btn lb-close" type="button" aria-label="Close">' + icon('M6 6l12 12M18 6L6 18') + '</button>';
  document.body.appendChild(dialog);

  var img = dialog.querySelector('.lb-img');
  var text = dialog.querySelector('.lb-text');
  var count = dialog.querySelector('.lb-count');
  var full = dialog.querySelector('.lb-full');
  var prev = dialog.querySelector('.lb-prev');
  var next = dialog.querySelector('.lb-next');
  var group = [];
  var index = 0;
  var opener = null;

  var show = function (i) {
    index = (i + group.length) % group.length;
    var link = group[index];
    var thumb = link.querySelector('img');
    img.src = link.getAttribute('data-src') || link.getAttribute('href');
    img.alt = thumb ? thumb.alt : '';
    text.textContent = link.getAttribute('data-caption') || (thumb ? thumb.alt : '');
    count.textContent = group.length > 1 ? (index + 1) + ' / ' + group.length : '';
    full.href = link.getAttribute('href');
    var single = group.length < 2;
    prev.hidden = single;
    next.hidden = single;
  };

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      var name = link.getAttribute('data-lightbox');
      group = links.filter(function (l) { return l.getAttribute('data-lightbox') === name; });
      opener = link;
      show(group.indexOf(link));
      dialog.showModal();
      dialog.querySelector('.lb-close').focus();
    });
  });

  prev.addEventListener('click', function () { show(index - 1); });
  next.addEventListener('click', function () { show(index + 1); });
  dialog.querySelector('.lb-close').addEventListener('click', function () { dialog.close(); });

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog || e.target.classList.contains('lb-figure')) dialog.close();
  });
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    else if (e.key === 'Escape') { e.preventDefault(); dialog.close(); }
  });
  dialog.addEventListener('close', function () {
    img.removeAttribute('src');
    if (opener) opener.focus();
  });

  var touchX = null;
  dialog.addEventListener('touchstart', function (e) {
    touchX = e.touches.length === 1 ? e.touches[0].clientX : null;
  }, { passive: true });
  dialog.addEventListener('touchend', function (e) {
    if (touchX === null || group.length < 2) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
    touchX = null;
  }, { passive: true });
})();
