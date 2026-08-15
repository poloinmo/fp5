// ─── FUNCIONES DE PROPIEDADES ───
window.SeleccionarTab = function(tabId, vpId) {
  document.querySelectorAll('.ficha-multimedia-item').forEach(el => el.classList.remove('item-sel'));
  const tab = document.getElementById(tabId);
  if(tab) tab.classList.add('item-sel');
  
  document.querySelectorAll('.multimedia').forEach(el => {
    el.classList.remove('multimedia_visible');
    el.style.display = 'none';
  });
  const vp = document.getElementById(vpId);
  if(vp) {
    vp.classList.add('multimedia_visible');
    vp.style.display = 'block';
  }
};

(function initPropertyScripts() {
  const init = function() {
    // Slider properties logic
    let slideIndex = 1;
    const slides = document.querySelectorAll('.fp-slide');
    const counter = document.getElementById('fpCounter');
    
    function showSlides(n) {
      if(!slides.length) return;
      if (n > slides.length) {slideIndex = 1}
      if (n < 1) {slideIndex = slides.length}
      slides.forEach(slide => slide.classList.remove('active'));
      slides[slideIndex-1].classList.add('active');
      if(counter) counter.innerText = slideIndex + " / " + slides.length;
    }
    
    const prev = document.getElementById('fpPrev');
    const next = document.getElementById('fpNext');
    if(prev) prev.addEventListener('click', () => { slideIndex--; showSlides(slideIndex); });
    if(next) next.addEventListener('click', () => { slideIndex++; showSlides(slideIndex); });
    showSlides(slideIndex);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

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
            colEl.innerHTML = '<div class="fp-cat3-col-header"><h5 class="fp-cat3-col-title">'+esc3(col.name)+'</h5></div><div class="fp-cat3-col-body"><span class="fp5-footer-loading">Cargando...</span></div>';
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
                  +'<div class="fp-cat3-img-wrap"><img src="'+esc3(getImg3(featured,400,300))+'" alt="'+esc3(featured.title.$t)+'" class="fp-cat3-featured-img" /><div class="fp-cat3-featured-overlay"><h6 class="fp-cat3-featured-title">'+esc3(featured.title.$t)+'</h6></div></div>'
                  +'</a>';
                html+='<div class="fp-cat3-list">';
                entries.slice(1).forEach(function(e,i){
                  if(i>0)html+='<div class="fp-cat3-list-sep"></div>';
                  html+='<a href="'+esc3(getLink3(e))+'" class="fp-cat3-list-item"><h6 class="fp-cat3-list-title">'+esc3(e.title.$t)+'</h6></a>';
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

document.addEventListener('DOMContentLoaded', function() {
  if (typeof AOS !== 'undefined') AOS.init({ duration: 700, once: true, offset: 80 });

  // Mobile Scroll Hover Effect
    const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fp5-mobile-hover', 'is-scroll-active');
      } else {
        entry.target.classList.remove('fp5-mobile-hover', 'is-scroll-active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  
  document.querySelectorAll('.is-interactive').forEach(card => scrollObserver.observe(card));

  
  // Counter Up Logic
  const counters = document.querySelectorAll('.fp5-counter');
  if (counters.length > 0) {
    const speed = 60; // Make it faster
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = +counter.getAttribute('data-target');
          const increment = target / speed;
          
          const updateCount = () => {
            const count = +counter.innerText;
            if (count < target) {
              counter.innerText = Math.ceil(count + increment);
              setTimeout(updateCount, 25);
            } else {
              counter.innerText = target;
            }
          };
          updateCount();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.1 });
    
    counters.forEach(counter => counterObserver.observe(counter));
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
      loading.classList.remove('fp5-hidden');
      loading.classList.add('flex');
      ctaAfterResult.style.display = 'none';
      setTimeout(function() {
        const base = prices[barrio] * m2 * (1 + (amb - 1) * 0.05);
        const min = Math.round(base * 0.93 / 1000) * 1000;
        const max = Math.round(base * 1.07 / 1000) * 1000;
        const fmt = function(n){ return 'USD ' + n.toLocaleString('es-AR'); };
        resultValue.innerHTML = '<div class="fp5-price-label">' + fmt(min) + '</div><div class="fp5-price-value">' + fmt(max) + '</div>';
        loading.classList.remove('flex');
        loading.classList.add('fp5-hidden');
        placeholder.style.opacity = '1';
        setTimeout(() => { 
          ctaAfterResult.classList.remove('fp5-hidden');
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
      submitBtn.className = 'fp-btn is-outline fp5-dyn-submit';
      submitBtn.style.cssText = 'width: 100%; margin-top:0.5rem;';
    }
    var wspBtn = sidebar.querySelector('.fp5-dyn-wsp');
    if (wspBtn) {
      wspBtn.replaceWith(wspBtn.cloneNode(true));
            var newBtn = sidebar.querySelector('.fp5-dyn-wsp');
      if (newBtn) {
        newBtn.addEventListener('click', function(e) {
          // Obtener mensaje predeterminado buscando enlaces de WhatsApp en la pagina
          var defaultMsg = 'Hola Facundo, quiero hacerte una consulta.';
          var wspLinks = document.querySelectorAll('a[href*="wa.me"]');
          for (var i = 0; i < wspLinks.length; i++) {
            if (wspLinks[i].href.includes('text=')) {
              try {
                var urlObj = new URL(wspLinks[i].href);
                var textParam = urlObj.searchParams.get('text');
                if (textParam) {
                  defaultMsg = textParam;
                  break;
                }
              } catch (err) {}
            }
          }
          // Tambien buscar en botones con onclick
          if (defaultMsg === 'Hola Facundo, quiero hacerte una consulta.') {
             var wspBtns = document.querySelectorAll('button[onclick*="wa.me"]');
             if (wspBtns.length > 0) {
               var match = wspBtns[0].getAttribute('onclick').match(/text=([^&']+)/);
               if (match && match[1]) {
                 defaultMsg = decodeURIComponent(match[1]);
               }
             }
          }

          var nombreEl = sidebar.querySelector('input[name="NOMBRE"]');
          var emailEl = sidebar.querySelector('input[name="EMAIL"]');
          var telEl = sidebar.querySelector('input[name="TELEFONO"]');
          var msgEl = sidebar.querySelector('textarea[name="MENSAJE"]');

          var nombre = nombreEl ? nombreEl.value.trim() : '';
          var email = emailEl ? emailEl.value.trim() : '';
          var tel = telEl ? telEl.value.trim() : '';
          var userMsg = msgEl ? msgEl.value.trim() : '';

          var finalMsg = defaultMsg;
          if (nombre) {
            finalMsg = finalMsg.replace('Hola Facundo,', 'Hola Facundo, soy ' + nombre + ' y');
          }

          if (userMsg) {
             finalMsg += '\n\nTe escribo para dejarte este mensaje:\n"' + userMsg + '"';
          }

          if (tel || email) {
            finalMsg += '\n\nMis datos de contacto son:';
            if (tel) finalMsg += '\nTel: ' + tel;
            if (email) finalMsg += '\nEmail: ' + email;
          }

          var base = 'https://wa.me/5493416761176';
          this.href = base + '?text=' + encodeURIComponent(finalMsg);
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


