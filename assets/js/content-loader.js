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

    var heroImg = document.getElementById('heroImage');
    if (heroImg && s.hero_image_alt) heroImg.alt = s.hero_image_alt;
    var aboutImg = document.getElementById('aboutImage');
    if (aboutImg && s.about_image_alt) aboutImg.alt = s.about_image_alt;

    setText('footer_tagline', s.footer_tagline);

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

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function starsHtml(n) {
    n = Math.max(0, Math.min(5, Math.round(Number(n) || 5)));
    return new Array(n + 1).join('\u2605') + (n < 5 ? '<span class="off">' + new Array(6 - n).join('\u2605') + '</span>' : '');
  }

  // Real client reviews only (content/reviews.json, edited in the admin panel).
  // Hidden entirely until at least one review exists. Everything is escaped,
  // so pasted text can never inject markup into the page.
  function renderReviews(data) {
    var sec = document.getElementById('reviews');
    var wall = document.getElementById('rvWall');
    if (!sec || !wall || !data) return;
    setText('reviews_eyebrow', data.section_eyebrow);
    setText('reviews_title', data.section_title);
    var items = (data.items || []).filter(function (r) { return r && r.name && r.text; });
    if (!items.length) { sec.hidden = true; return; }

    var total = items.reduce(function (a, r) { return a + (Math.max(1, Math.min(5, Number(r.rating) || 5))); }, 0);
    var avg = total / items.length;
    document.getElementById('ratingSummary').innerHTML =
      '<div class="score">' + avg.toFixed(1) + '</div>' +
      '<div class="rstars" aria-label="' + avg.toFixed(1) + ' out of 5">' + starsHtml(avg) + '</div>' +
      '<div class="count">Based on ' + items.length + (items.length === 1 ? ' client review' : ' client reviews') + '</div>';

    function card(r, dup) {
      return '<figure class="rv-card' + (dup ? ' rv-dup' : '') + '"' + (dup ? ' aria-hidden="true"' : '') + ' style="margin:0">' +
        '<div class="rstars" aria-label="' + (Number(r.rating) || 5) + ' out of 5 stars">' + starsHtml(r.rating) + '</div>' +
        '<blockquote>' + esc(r.text) + '</blockquote>' +
        '<figcaption class="who"><div class="rv-avatar">' + esc(String(r.name).trim().charAt(0).toUpperCase()) + '</div>' +
        '<div><div class="rv-name">' + esc(r.name) + '</div>' + (r.role ? '<div class="rv-role">' + esc(r.role) + '</div>' : '') + '</div></figcaption>' +
        '</figure>';
    }

    if (items.length < 4) {
      wall.classList.add('is-grid');
      wall.innerHTML = '<div class="rv-grid">' + items.map(function (r) { return card(r, false); }).join('') + '</div>';
    } else {
      wall.classList.remove('is-grid');
      var set = items.slice();
      while (set.length * 362 < 2200) set = set.concat(items); // wide enough that the loop never shows a gap
      var html = set.map(function (r) { return card(r, false); }).join('') + set.map(function (r) { return card(r, true); }).join('');
      wall.innerHTML = '<div class="rv-track scroll" style="--rv-dur:' + Math.max(40, set.length * 9) + 's">' + html + '</div>';
    }
    sec.hidden = false;
  }
  window.__kvRenderReviews = renderReviews;

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
    loadJSON('content/reviews.json').then(renderReviews).catch(function (e) {
      console.warn('CMS reviews not loaded:', e);
    });
    loadJSON('content/pricing.json').then(renderPricing).catch(function (e) {
      console.warn('CMS pricing not loaded, showing fallback content:', e);
    });
  });
})();
