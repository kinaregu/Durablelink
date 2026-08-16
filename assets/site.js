/* ============================================================
   Durablelink Prints and Brands — static site behaviour
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Scroll reveal (matches original animations) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- 2. Mobile menu ---------- */
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    var openIcon = document.getElementById('menu-icon-open');
    var closeIcon = document.getElementById('menu-icon-close');
    toggle.addEventListener('click', function () {
      var isHidden = menu.classList.toggle('hidden');
      if (openIcon) openIcon.classList.toggle('hidden', !isHidden);
      if (closeIcon) closeIcon.classList.toggle('hidden', isHidden);
      toggle.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.add('hidden');
        if (openIcon) openIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
      });
    });
  }

  /* ---------- 3. Stat counters (count up on view) ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1200, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            animateCounter(en.target);
            cio.unobserve(en.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- 4. Static cart (localStorage) ---------- */
  var CART_KEY = 'dl-cart-v1';
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }
  function setCart(c) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {}
  }
  function cartCount() {
    return getCart().reduce(function (a, i) { return a + (i.qty || 0); }, 0);
  }
  function cartTotal() {
    return getCart().reduce(function (a, i) { return a + (i.price || 0) * (i.qty || 0); }, 0);
  }
  function updateBadge() {
    var b = document.getElementById('cart-badge');
    if (!b) return;
    var n = cartCount();
    b.textContent = n > 99 ? '99+' : String(n);
    b.classList.toggle('hidden', n === 0);
  }

  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  document.querySelectorAll('.add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-id');
      var name = btn.getAttribute('data-name');
      var price = parseFloat(btn.getAttribute('data-price') || '0');
      var image = btn.getAttribute('data-image') || '';
      var cart = getCart();
      var item = cart.find(function (x) { return x.id === id; });
      if (item) item.qty += 1;
      else cart.push({ id: id, name: name, price: price, qty: 1, image: image });
      setCart(cart);
      updateBadge();
      showToast('\u2713 ' + name + ' added to cart');
    });
  });
  updateBadge();

  /* ---------- 5. Shop filters + search ---------- */
  var filterBtns = document.querySelectorAll('[data-filter]');
  var searchInput = document.getElementById('shop-search');
  function applyShopFilters() {
    var activeBtn = document.querySelector('[data-filter].active');
    var active = activeBtn ? activeBtn.getAttribute('data-filter') : 'All';
    var q = searchInput ? searchInput.value.toLowerCase() : '';
    document.querySelectorAll('.product-card').forEach(function (card) {
      var okCat = active === 'All' || card.getAttribute('data-category') === active;
      var name = (card.getAttribute('data-name') || '').toLowerCase();
      var desc = (card.getAttribute('data-desc') || '').toLowerCase();
      var okQ = !q || name.indexOf(q) > -1 || desc.indexOf(q) > -1;
      card.classList.toggle('hidden', !(okCat && okQ));
    });
  }
  if (filterBtns.length) {
    filterBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        filterBtns.forEach(function (x) {
          x.classList.remove('bg-[#0A2472]', 'text-white', 'active');
          x.classList.add('bg-muted', 'text-muted-foreground');
        });
        b.classList.add('bg-[#0A2472]', 'text-white', 'active');
        b.classList.remove('bg-muted', 'text-muted-foreground');
        applyShopFilters();
      });
    });
  }
  if (searchInput) searchInput.addEventListener('input', applyShopFilters);

  /* ---------- 6. Portfolio filters ---------- */
  var portoBtns = document.querySelectorAll('[data-portfolio-filter]');
  if (portoBtns.length) {
    portoBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        portoBtns.forEach(function (x) {
          x.classList.remove('bg-[#0A2472]', 'text-white', 'active');
          x.classList.add('bg-muted', 'text-muted-foreground');
        });
        b.classList.add('bg-[#0A2472]', 'text-white', 'active');
        b.classList.remove('bg-muted', 'text-muted-foreground');
        var cat = b.getAttribute('data-portfolio-filter');
        document.querySelectorAll('.portfolio-item').forEach(function (it) {
          it.classList.toggle('hidden', cat !== 'All' && it.getAttribute('data-category') !== cat);
        });
      });
    });
  }

  /* ---------- 7. Quote form: dynamic Product Type options ---------- */
  var PRODUCT_TYPES = {
    'Commercial Printing': ['Business Cards', 'Letterheads', 'Envelopes', 'Flyers', 'Brochures', 'Posters', 'Catalogs', 'Calendars', 'Certificates', 'Menus', 'Booklets'],
    'Large Format & Signage': ['Vinyl Banners', 'Pull-up Banners', 'Teardrop Flags', 'Shop Signs', 'Window Decals', 'Directional Boards'],
    'Vehicle Branding': ['Full Car Wrap', 'Partial Car Wrap', 'Magnetic Door Signs', 'Fleet Branding'],
    'Apparel & Merchandise': ['T-shirts', 'Hoodies', 'Caps', 'Uniforms', 'Mugs', 'Water Bottles', 'Keychains', 'Tote Bags', 'Phone Cases'],
    'Finishing Services': ['Lamination', 'Foil Stamping', 'Embossing', 'Die-cutting', 'Binding'],
    'Design Services': ['Logo Design', 'Brand Guidelines', 'Layout Design', 'Company Profile']
  };
  var catSelect = document.querySelector('select[name="serviceCategory"]');
  var typeSelect = document.querySelector('select[name="productType"]');
  if (catSelect && typeSelect) {
    catSelect.addEventListener('change', function () {
      typeSelect.innerHTML = '';
      var empty = document.createElement('option');
      empty.value = '';
      empty.textContent = 'Select product';
      typeSelect.appendChild(empty);
      (PRODUCT_TYPES[catSelect.value] || []).forEach(function (t) {
        var o = document.createElement('option');
        o.value = t;
        o.textContent = t;
        typeSelect.appendChild(o);
      });
    });
  }

  /* ---------- 8. Forms → WhatsApp (static equivalent of the API) ---------- */
  var WA_NUMBER = '211922266621';
  function labelFor(el) {
    if (el.id) {
      var lab = document.querySelector('label[for="' + el.id + '"]');
      if (lab) return lab.textContent.replace(/\s*\*?\s*$/, '').trim();
    }
    return el.name.replace(/([A-Z])/g, ' $1').replace(/^./, function (c) { return c.toUpperCase(); });
  }
  document.querySelectorAll('form[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lines = [];
      var filesNote = '';
      form.querySelectorAll('input, select, textarea').forEach(function (el) {
        var t = (el.type || 'text').toLowerCase();
        if (t === 'submit' || t === 'button') return;
        if (t === 'file') {
          if (el.files && el.files.length) {
            filesNote = 'Attached file(s): ' + Array.prototype.map.call(el.files, function (f) { return f.name; }).join(', ');
          }
          return;
        }
        if (!el.name) return;
        var v = (el.value || '').trim();
        if (v) lines.push(labelFor(el) + ': ' + v);
      });
      var subject = form.getAttribute('data-wa-subject') || 'New message';
      var msg = subject + '\n\n' + lines.join('\n') + (filesNote ? '\n\n' + filesNote : '');
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
      var status = form.querySelector('.form-status');
      if (status) {
        status.className = 'form-status show success';
        status.innerHTML = 'Opening WhatsApp to send your request &hellip; ' +
          '<a href="' + url + '" target="_blank" rel="noopener noreferrer">Tap here if it did not open automatically</a>.';
      }
      window.open(url, '_blank');
    });
  });
  document.querySelectorAll('form[data-static-notice]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      if (status) {
        status.className = 'form-status show notice';
        status.innerHTML = 'Account sign-in is part of the hosted app and is not available in this static version. ' +
          'Please reach out via the <a href="contact.html">Contact page</a> or WhatsApp &mdash; we&rsquo;re happy to help!';
      }
    });
  });

  /* ---------- 9. Cart page ---------- */
  var cartItemsEl = document.getElementById('cart-items');
  if (cartItemsEl) {
    var emptyEl = document.getElementById('cart-empty');
    var summaryEl = document.getElementById('cart-summary');
    var totalEl = document.getElementById('cart-total');
    var checkoutBtn = document.getElementById('cart-checkout');

    function fmt(n) { return '$' + n.toFixed(2); }
    function renderCart() {
      var cart = getCart();
      cartItemsEl.innerHTML = '';
      if (!cart.length) {
        if (emptyEl) emptyEl.classList.remove('hidden');
        if (summaryEl) summaryEl.classList.add('hidden');
        return;
      }
      if (emptyEl) emptyEl.classList.add('hidden');
      if (summaryEl) summaryEl.classList.remove('hidden');
      cart.forEach(function (item) {
        var row = document.createElement('div');
        row.className = 'cart-row';
        var img = item.image
          ? '<img src="' + item.image + '" alt="' + item.name.replace(/"/g, '&quot;') + '"/>'
          : '<img src="assets/brand/logo.png" alt="Product"/>';
        row.innerHTML = img +
          '<div class="ci-info"><p class="ci-name">' + item.name.replace(/[<>&"]/g, function (c) {
            return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
          }) + '</p><p class="ci-price">' + fmt(item.price) + ' each</p></div>' +
          '<button class="qty-btn qty-minus" type="button">&minus;</button>' +
          '<span class="cart-qty">' + item.qty + '</span>' +
          '<button class="qty-btn qty-plus" type="button">+</button>' +
          '<p class="ci-total">' + fmt(item.price * item.qty) + '</p>' +
          '<button class="remove-item" type="button" title="Remove">&times;</button>';
        row.querySelector('.qty-minus').addEventListener('click', function () {
          var c = getCart();
          var it = c.find(function (x) { return x.id === item.id; });
          if (it) { it.qty -= 1; if (it.qty <= 0) c = c.filter(function (x) { return x.id !== item.id; }); }
          setCart(c); updateBadge(); renderCart();
        });
        row.querySelector('.qty-plus').addEventListener('click', function () {
          var c = getCart();
          var it = c.find(function (x) { return x.id === item.id; });
          if (it) it.qty += 1;
          setCart(c); updateBadge(); renderCart();
        });
        row.querySelector('.remove-item').addEventListener('click', function () {
          var c = getCart().filter(function (x) { return x.id !== item.id; });
          setCart(c); updateBadge(); renderCart();
        });
        cartItemsEl.appendChild(row);
      });
      if (totalEl) totalEl.textContent = fmt(cartTotal());
    }
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function () {
        var cart = getCart();
        if (!cart.length) { showToast('Your cart is empty'); return; }
        var lines = cart.map(function (i) {
          return i.qty + ' x ' + i.name + '  -  ' + fmt(i.price * i.qty);
        });
        var msg = 'NEW ORDER \u2013 DURABLELINK\n\n' + lines.join('\n') + '\n\nTOTAL: ' + fmt(cartTotal()) +
          '\n\nPlease confirm availability and delivery. Thank you!';
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
      });
    }
    renderCart();
  }
})();
