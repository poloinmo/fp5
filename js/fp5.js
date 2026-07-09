(function() {
        function initSelect() {
          var sel = document.getElementById('calc-barrio');
          if(sel) {
            sel.addEventListener('focus', function(){ this.classList.add('is-focused'); });
            sel.addEventListener('blur', function(){ this.classList.remove('is-focused'); this.classList.add('touched'); });
            sel.addEventListener('change', function(){ 
              if(this.selectedIndex > 0) this.classList.add('has-value'); 
              else this.classList.remove('has-value');
            });
            if(sel.selectedIndex > 0) sel.classList.add('has-value');
          }
        }
        
        function runBlock() {
          initSelect();
          var grid = document.querySelector('.editorial-grid-container');
          if(!grid) {
            setTimeout(runBlock, 500);
            return;
          }
          if(grid.querySelector('.fp-cat3-outer.fp2-custom')) return;
          
          var outer = document.createElement('div');
          outer.className = 'fp-cat3-outer fp2-custom';
          var inner = document.createElement('div');
          inner.className = 'fp-cat3-grid';
          outer.appendChild(inner);
          grid.appendChild(outer);

          function esc3(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
          function getLink3(e){var l='#';(e.link||[]).forEach(function(lk){if(lk.rel==='alternate')l=lk.href;});return l;}
          function getImg3(e,w,h){
            if(e.media$thumbnail&&e.media$thumbnail.url) return e.media$thumbnail.url.replace('/s72-c/','/w'+w+'-h'+h+'-c/');
            var c=e.content?e.content.$t:'';
            var m=c?c.match(/src="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/):null;
            return m?m[1]:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w='+w+'&h='+h+'&q=80';
          }

          var cols = [
            { name: 'Propietarios', label: '.Propietarios' },
            { name: 'Inversores', label: '.Inversores' },
            { name: 'Mercado', label: '.Mercado' }
          ];

          cols.forEach(function(col){
            var colEl = document.createElement('div');
            colEl.className = 'fp-cat3-col';
            colEl.innerHTML = '<div class="fp-cat3-col-header"><h4 class="fp-cat3-col-title">'+esc3(col.name)+'</h4></div><div class="fp-cat3-col-body"><span class="fp5-footer-loading">Cargando...</span></div>';
            inner.appendChild(colEl);
            var body = colEl.querySelector('.fp-cat3-col-body');
            fetch('/feeds/posts/default/-/'+encodeURIComponent(col.label)+'?alt=json&max-results=10&orderby=published')
              .then(function(r){return r.json();})
              .then(function(data){
                var entries=(data.feed&&data.feed.entry)||[];
                if(!entries.length){body.innerHTML='<span class="fp5-footer-loading">Sin publicaciones.</span>';return;}
                entries=entries.filter(function(e){return e.title&&e.title.$t&&e.title.$t.trim();}).slice(0,5);
                if(!entries.length){body.innerHTML='<span class="fp5-footer-loading">Sin publicaciones.</span>';return;}
                var featured=entries[0];
                var html='<a href="'+esc3(getLink3(featured))+'" class="fp-cat3-featured">'
                  +'<div class="fp-cat3-img-wrap"><img src="'+esc3(getImg3(featured,400,300))+'" alt="'+esc3(featured.title.$t)+'" class="fp-cat3-featured-img" /><div class="fp-cat3-featured-overlay"><h5 class="fp-cat3-featured-title">'+esc3(featured.title.$t)+'</h5></div></div>'
                  +'</a>';
                html+='<div class="fp-cat3-list">';
                entries.slice(1).forEach(function(e,i){
                  if(i>0)html+='<div class="fp-cat3-list-sep"></div>';
                  html+='<a href="'+esc3(getLink3(e))+'" class="fp-cat3-list-item"><h5 class="fp-cat3-list-title">'+esc3(e.title.$t)+'</h5></a>';
                });
                html+='</div>';
                html+='<div class="fp-cat3-list-sep"></div>';
                body.innerHTML=html;
              })
              .catch(function(){body.innerHTML='';});
          });
        }
        
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', runBlock);
        } else {
          runBlock();
        }
      })();

// ── DOM RELOCATION INMEDIATA PARA BLOGGER ──
(function relocate() {
  var page = document.querySelector('.fp2-page');
  if (!page) return;
  // Ocultar solo los contenedores intermedios entre fp2-page y body
  var el = page.parentElement;
  while (el && el !== document.body) {
    el.style.setProperty('display', 'none', 'important');
    el = el.parentElement;
  }
  // Insertar DESPUÉS del navbar para no taparlo
  var navbar = document.getElementById('navbar');
  if (navbar && navbar.nextSibling) {
    document.body.insertBefore(page, navbar.nextSibling);
  } else {
    document.body.appendChild(page);
  }
  page.style.setProperty('width', '100%', 'important');
  page.style.setProperty('margin-top', '88px', 'important');
})();

document.addEventListener('DOMContentLoaded', function() {
  // Ocultar residuales de Blogger
  ['h1.entry-title','nav#breadcrumb','.post-header','.post-meta','.entry-labels','.breadcrumbs','.post-footer'].forEach(function(s) {
    document.querySelectorAll(s).forEach(function(el){ el.style.setProperty('display', 'none', 'important'); });
  });

  if (typeof AOS !== 'undefined') AOS.init({ duration: 700, once: true, offset: 80 });

  // Mobile Scroll Hover Effect
  if (window.matchMedia('(hover: none)').matches || window.matchMedia('(max-width: 768px)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fp5-mobile-hover');
        } else {
          entry.target.classList.remove('fp5-mobile-hover');
        }
      });
    }, { rootMargin: '-30% 0px -30% 0px' });
    document.querySelectorAll('.fp5-card-interactive').forEach(card => observer.observe(card));
  }

  // Calculadora - Escala no lineal para M²
  const m2Slider = document.getElementById('calc-m2');
  const m2Number = document.getElementById('val-m2-input');
  function posToVal(pos) { return pos <= 70 ? Math.round(20 + (pos / 70) * (150 - 20)) : Math.round(150 + ((pos - 70) / 30) * (500 - 150)); }
  function valToPos(val) { return val <= 150 ? ((val - 20) / (150 - 20)) * 70 : 70 + ((val - 150) / (500 - 150)) * 30; }
  if (m2Slider && m2Number) {
    m2Slider.addEventListener('input', function(e) { m2Number.value = posToVal(parseFloat(e.target.value)); });
    m2Number.addEventListener('input', function(e) { m2Slider.value = valToPos(parseFloat(e.target.value) || 20); });
    window.changeM2 = function(delta) {
      let val = (parseFloat(m2Number.value) || 70) + delta;
      if (val < 20) val = 20;
      if (val > 1000) val = 1000;
      m2Number.value = val;
      m2Number.dispatchEvent(new Event('input'));
    };
  }
  const ambInput = document.getElementById('calc-amb');
  const ambVal = document.getElementById('val-amb');
  if (ambInput && ambVal) { ambInput.addEventListener('input', function(e) { ambVal.textContent = e.target.value; }); }

  // Calculadora - Select interactivo
  var sel = document.getElementById('calc-barrio');
  if(sel) {
    sel.addEventListener('focus', function(){ this.classList.add('is-focused'); });
    sel.addEventListener('blur', function(){ this.classList.remove('is-focused'); });
    sel.addEventListener('change', function(){ 
      if(this.selectedIndex > 0) this.classList.add('has-value'); 
      else this.classList.remove('has-value');
    });
  }

  // Calculadora - Lógica de precios
  const prices = {
    'Alberto Olmedo':1437,'Centro':1310,'Del Abasto':1273,'Echesortu':1122,
    'España y Hospitales':849,'Jorge Cura':870,'Lourdes':1357,
    'Luis Agote':1127,'Parque':1428
  };
  const form = document.getElementById('valuationForm');
  const resultValue = document.getElementById('result-value');
  const loading = document.getElementById('result-loading');
  const placeholder = document.getElementById('result-placeholder');
  const ctaAfterResult = document.getElementById('cta-after-result');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const barrio = document.getElementById('calc-barrio').value;
      const m2 = parseFloat(document.getElementById('val-m2-input').value) || 70;
      const amb = parseFloat(document.getElementById('calc-amb').value) || 3;
      if (!barrio) { alert('Por favor seleccioná un barrio.'); return; }
      placeholder.style.opacity = '0.1';
      loading.classList.remove('hidden');
      loading.classList.add('flex');
      ctaAfterResult.style.display = 'none';
      setTimeout(function() {
        const base = prices[barrio] * m2 * (1 + (amb - 1) * 0.05);
        const min = Math.round(base * 0.93 / 1000) * 1000;
        const max = Math.round(base * 1.07 / 1000) * 1000;
        const fmt = function(n){ return 'USD ' + n.toLocaleString('es-AR'); };
        resultValue.innerHTML = '<div class="fp5-price-secondary">' + fmt(min) + '</div><div class="fp5-price-primary">' + fmt(max) + '</div>';
        loading.classList.remove('flex');
        loading.classList.add('hidden');
        placeholder.style.opacity = '1';
        setTimeout(() => { 
          ctaAfterResult.classList.remove('hidden');
          ctaAfterResult.style.display = 'inline-flex'; 
        }, 300);
        if (window.innerWidth < 768) { resultValue.scrollIntoView({behavior:'smooth', block:'center'}); }
      }, 1500);
    });
  }
});

// ── PATCH FORMULARIO SIDEBAR (solo para Tasaciones) ──
(function patchSidebarForm() {
  var sidebar = document.querySelector('.editorial-column-sidebar');
  if (!sidebar) { document.addEventListener('DOMContentLoaded', patchSidebarForm); return; }

  function applyPatch() {
    var textarea = sidebar.querySelector('textarea[name="MENSAJE"]');
    if (textarea) {
      textarea.value = '';
      textarea.defaultValue = '';
      var label = textarea.nextElementSibling;
      if (label && label.classList.contains('fp2-floating-label')) {
        label.textContent = 'Mensaje *';
      }
    }
    var submitBtn = sidebar.querySelector('.fp5-dyn-submit');
    if (submitBtn) {
      submitBtn.className = 'fp-btn fp5-btn-outline fp5-dyn-submit';
      submitBtn.style.cssText = 'width: 100%; margin-top:0.5rem;';
    }
    var wspBtn = sidebar.querySelector('.fp5-dyn-wsp');
    if (wspBtn) {
      wspBtn.replaceWith(wspBtn.cloneNode(true));
      var newBtn = sidebar.querySelector('.fp5-dyn-wsp');
      if (newBtn) {
        newBtn.addEventListener('click', function(e) {
          var nombreEl = sidebar.querySelector('input[name="NOMBRE"]');
          var nombre = nombreEl ? nombreEl.value.trim() : '';
          var msg = 'Hola Facundo, quiero consultar por una tasación de mi propiedad.';
          if (nombre) msg = 'Hola Facundo, soy ' + nombre + ' y quiero consultar por una tasación de mi propiedad.';
          var base = 'https://wa.me/5493416761176';
          this.href = base + '?text=' + encodeURIComponent(msg);
        });
      }
    }
  }

  var observer = new MutationObserver(function(mutations, obs) {
    if (sidebar.querySelector('textarea[name="MENSAJE"]')) {
      obs.disconnect();
      applyPatch();
    }
  });
  observer.observe(sidebar, { childList: true, subtree: true });
})();


