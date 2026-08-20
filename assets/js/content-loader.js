/* ===================================================================
   Kroma Vance — CMS content loader
   Fetches content/settings.json, content/portfolio.json, and
   content/pricing.json (all editable via Decap CMS at /admin) and
   hydrates the page with whatever they contain.

   This runs as progressive enhancement: every section already has
   real fallback content baked into index.html, so if this script
   fails to load (offline preview, JSON typo, etc.) the page still
   looks correct — it just won't reflect the latest CMS edits until
   this succeeds.
=================================================================== */
(function () {
  function setText(key, value) {
    if (value === undefined || value === null) return;
    document.querySelectorAll('[data-cms="' + key + '"]').forEach(function (el) {
      el.textContent = value;
    });
  }

  function applySettings(s) {
    setText('hero_eyebrow', s.hero_eyebrow);
    setText('hero_title', s.hero_title);
    setText('hero_lead', s.hero_lead);
    setText('hero_badge_stat', s.hero_badge_stat);
    setText('hero_badge_line1', s.hero_badge_line1);
    setText('hero_badge_line2', s.hero_badge_line2);
    setText('hero_cta_primary', s.hero_cta_primary);
    setText('hero_cta_secondary', s.hero_cta_secondary);

    setText('about_eyebrow', s.about_eyebrow);
    setText('about_title', s.about_title);
    setText('about_paragraph_1', s.about_paragraph_1);
    setText('about_paragraph_2', s.about_paragraph_2);

    setText('footer_tagline', s.footer_tagline);
    setText('payment_policy', s.payment_policy);

    // Bank + JazzCash details are assembled from separate fields so the
    // CMS form stays simple (plain text fields, not raw HTML).
    if (s.bank_name) setText('bank_label', 'Bank Transfer — ' + s.bank_name);
    var bankEl = document.querySelector('[data-cms="bank_details"]');
    if (bankEl && s.bank_account_title) {
      bankEl.innerHTML =
        'Account Title: ' + s.bank_account_title + '<br>' +
        'Account No: ' + s.bank_account_number + '<br>' +
        'IBAN: ' + s.bank_iban + '<br>' +
        'Branch: ' + s.bank_branch;
    }
    var jazzEl = document.querySelector('[data-cms="jazzcash_details"]');
    if (jazzEl && s.jazzcash_number) {
      jazzEl.textContent = s.jazzcash_number + ' (' + s.jazzcash_name + ')';
    }

    // Contact quick-links (WhatsApp / email / phone)
    var wa = document.getElementById('qlWhatsapp');
    if (wa && s.whatsapp_number) {
      wa.href = 'https://wa.me/' + s.whatsapp_number;
    }
    var em = document.getElementById('qlEmail');
    if (em && s.contact_email) {
      em.href = 'mailto:' + s.contact_email;
      em.firstChild.textContent = s.contact_email + ' ';
    }
    var ph = document.getElementById('qlPhone');
    if (ph && s.contact_phone) {
      ph.href = 'tel:' + s.contact_phone.replace(/\s+/g, '');
      ph.firstChild.textContent = s.contact_phone + ' ';
    }

    var footPhone = document.getElementById('footPhone');
    if (footPhone && s.contact_phone) {
      footPhone.href = 'tel:' + s.contact_phone.replace(/\s+/g, '');
      footPhone.textContent = s.contact_phone;
    }
    var footEmail = document.getElementById('footBottomEmail');
    if (footEmail && s.contact_email) {
      footEmail.href = 'mailto:' + s.contact_email;
      footEmail.textContent = s.contact_email;
    }
    var waFloat = document.getElementById('whatsappFloat');
    if (waFloat && s.whatsapp_number) {
      waFloat.href = 'https://wa.me/' + s.whatsapp_number;
    }

    // Social icons
    var socialMap = {
      socialInstagram: s.social_instagram,
      socialFacebook: s.social_facebook,
      socialTiktok: s.social_tiktok,
      socialYoutube: s.social_youtube,
      socialEmail: s.contact_email ? 'mailto:' + s.contact_email : null
    };
    Object.keys(socialMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (el && socialMap[id]) el.href = socialMap[id];
    });
  }

  function renderPortfolio(data) {
    var grid = document.getElementById('portfolioGrid');
    if (!grid || !data || !Array.isArray(data.items)) return;
    var html = '';
    data.items.forEach(function (item, i) {
      var delay = ((i % 6) * 0.06).toFixed(2);
      html += '<div class="case-card reveal" style="transition-delay:' + delay + 's">' +
        '<div class="thumb"><img src="' + item.image + '" alt="' + (item.alt || item.name) + '" loading="lazy"></div>' +
        '<div class="meta"><div class="tag">' + item.category + '</div><h4>' + item.name + '</h4></div>' +
        '</div>';
    });
    // Always keep 3 honest "open slot" cards at the end — see chat history
    // for why these aren't filled with stock photos.
    for (var j = 0; j < 3; j++) {
      var d2 = (((data.items.length + j) % 6) * 0.06).toFixed(2);
      html += '<div class="case-card add-card reveal" style="transition-delay:' + d2 + 's">' +
        '<div class="thumb add-thumb"><span class="add-plus">+</span></div>' +
        '<div class="meta"><div class="tag">Open Slot</div><h4>Add Your Next Project</h4></div>' +
        '</div>';
    }
    grid.innerHTML = html;
    // re-observe the freshly-created cards for the scroll-reveal animation
    if (window.__kvObserveReveal) window.__kvObserveReveal();
  }

  function renderPricing(data) {
    setText('pricing_eyebrow', data.section_eyebrow);
    setText('pricing_title', data.section_title);
    setText('pricing_intro', data.section_intro);

    var grid = document.getElementById('pricingGrid');
    if (!grid || !Array.isArray(data.tiers)) return;
    var html = '';
    data.tiers.forEach(function (t) {
      var cardClass = t.featured ? 'price-card featured' : 'price-card';
      var amountStyle = t.featured ? ' style="color:#fff;"' : '';
      var btnClass = t.featured ? 'btn' : 'btn ghost';
      var features = (t.features || []).map(function (f) {
        return '<li><span class="dot">&bull;</span>' + f + '</li>';
      }).join('');
      html += '<div class="' + cardClass + '">' +
        '<div class="badge">' + t.badge + '</div>' +
        '<div class="amount"' + amountStyle + '>' + t.amount + '</div>' +
        '<span class="cadence">' + t.cadence + '</span>' +
        '<ul>' + features + '</ul>' +
        '<a href="#contact" class="' + btnClass + '" onclick="var s=document.getElementById(\'scope\'); if(s) s.value=\'' + t.scope_value + '\';">' + t.cta_text + '</a>' +
        '</div>';
    });
    grid.innerHTML = html;
  }

  function loadJSON(path) {
    return fetch(path, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('Failed to load ' + path);
      return r.json();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadJSON('content/settings.json').then(applySettings).catch(function (e) {
      console.warn('CMS settings not loaded, showing fallback content:', e);
    });
    loadJSON('content/portfolio.json').then(renderPortfolio).catch(function (e) {
      console.warn('CMS portfolio not loaded, showing fallback content:', e);
    });
    loadJSON('content/pricing.json').then(renderPricing).catch(function (e) {
      console.warn('CMS pricing not loaded, showing fallback content:', e);
    });
  });
})();
