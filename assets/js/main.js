// Progressive enhancement: submit via fetch so Netlify still captures the
  // POST (works exactly like a native submit), but shows an inline success
  // message instead of a full page reload. If fetch/JS fails for any reason,
  // the form still works as a plain native submission to action="/thank-you".
  (function(){
    const form = document.getElementById('kvForm');
    if(!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = new FormData(form);
      fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams(data).toString()
      })
      .then(() => {
        document.getElementById('formFields').style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
      })
      .catch(() => {
        // Fallback: let Netlify handle it as a normal form submission.
        form.removeEventListener('submit', arguments.callee);
        form.submit();
      });
    });
  })();

/* ---- */

function toggleFaq(btn){
    const item = btn.parentElement;
    const ans = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el=>{
      el.classList.remove('open');
      el.querySelector('.faq-a').style.maxHeight = null;
    });
    if(!isOpen){
      item.classList.add('open');
      ans.style.maxHeight = ans.scrollHeight + 'px';
    }
  }

  // Scroll-reveal for portfolio cards + stars band
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Exposed so content-loader.js can re-observe cards it injects after
  // fetching CMS content (e.g. the portfolio grid gets rebuilt from JSON).
  window.__kvObserveReveal = function(){
    document.querySelectorAll('.reveal:not(.in)').forEach(el => revealObserver.observe(el));
  };

