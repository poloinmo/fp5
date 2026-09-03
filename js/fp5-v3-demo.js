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
  
  document.querySelectorAll('.is-interactive, .fp5-faq-card').forEach(card => scrollObserver.observe(card));

  
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




/* ============================================================================ */


/* ============================================================================ */
/* MEJORAS CENTRALIZADAS (Agregadas desde la plantilla XML) */
/* ============================================================================ */

window.initDynamicForms = function() {
    var forms = document.querySelectorAll('.fp2-dynamic-form:not(.initialized)');
    forms.forEach(function(container) {
      container.classList.add('initialized');
      var type = container.getAttribute('data-type');
      
      if (type === 'informe-exclusivo') {
        container.innerHTML = 
          '<style>' +
          '  .fp-brevo-article { display: flex; flex-direction: row; gap: 10px; align-items: flex-start; max-width: 480px; margin: 0 auto; }' +
          '  @media (max-width: 600px) {' +
          '    .fp-brevo-article { flex-direction: column; gap: 12px; }' +
          '    .fp-brevo-article > button { width: 100%; box-sizing: border-box; justify-content: center; }' +
          '  }' +
          '</style>' +
          '<div class="sr-container" style="width: calc(100% - 1.875rem); max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 28px; box-shadow: 0px 1px 2px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15); border: 1px solid var(--fp2-color-outline);">' +
          '  <div class="sr-header" style="justify-content: center; padding: 0.875rem 0 0; height: auto;">' +
          '    <h4 class="sr-title" style="text-transform: uppercase;">RECIBÍ EL INFORME EXCLUSIVO</h4>' +
          '  </div>' +
          '  <div style="padding: 1.25rem 1.5rem 2rem;">' +
          '    <p style="text-align: center; font-style: normal; font-weight: 400; font-size: 16px; line-height: 24px; color: #555555; margin-top: 0; margin-bottom: 1.25rem; font-family: var(--fp-sans);">' +
          '      Newsletter estratégico sobre el mercado inmobiliario.' +
          '    </p>' +
          '    <form class="fp-dynamic-brevo-form" data-type="informe" style="margin:0;">' +
          '      <div class="fp-brevo-article">' +
          '        <div class="fp2-input-wrapper" style="flex: 1; min-width: 0; display: flex; flex-direction: column;">' +
          '          <input name="EMAIL" class="fp2-input-field fp-dyn-email" type="email" placeholder=" " required="required" style="width:100%; border: 1px solid #c0c0c0; padding: 0.5rem 1rem; outline: none; font-family: var(--fp-sans); font-size: 0.9375rem; transition: border-color 0.2s; box-sizing: border-box; background-color: #ffffff;" />' +
          '          <label class="fp2-floating-label" style="left: 1rem; padding: 0 4px;">Correo electrónico *</label>' +
          '        </div>' +
          '        <button type="submit" class="fp-dyn-submit" style="flex-shrink: 0; align-self: flex-start; display: inline-flex; align-items: center; justify-content: center; gap: 0.375rem; background-color: #ffffff; color: #1f1f1f; border: 1px solid #bebebe; border-radius: 9999px; padding: 0.4rem 1rem; font-family: var(--fp-sans); font-weight: 500; font-size: 0.875rem; cursor: pointer; white-space: nowrap; box-shadow: 0 1px 2px rgba(0,0,0,0.08); transition: box-shadow 0.2s, border-color 0.2s;" onmouseover="this.style.boxShadow=\'0 2px 6px rgba(0,0,0,0.15)\';this.style.borderColor=\'#9c9c9c\';" onmouseout="this.style.boxShadow=\'0 1px 2px rgba(0,0,0,0.08)\';this.style.borderColor=\'#bebebe\';">' +
          '          Suscribirse' +
          '        </button>' +
          '      </div>' +
          '      <div class="fp-dyn-err-msg" style="display: none; color: #ab0030; font-size: 0.8125rem; font-family: var(--fp-sans); font-weight: bold; text-align: center; margin-top: 0.75rem;">* Campo obligatorio. Ingresá un correo válido.</div>' +
          '    </form>' +
          '    <div class="fp-dyn-ok" style="display: none; color: #16a34a; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 1rem; margin-top: 1rem; text-align: center; font-family: var(--fp-sans); font-size: 0.875rem; font-weight: bold; max-width: 480px; margin-left: auto; margin-right: auto;">' +
          '      Listo. Vas a recibir solo lo que vale la pena.' +
          '    </div>' +
          '    <div class="fp-dyn-err-api" style="display: none; color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 1rem; margin-top: 1rem; text-align: center; font-family: var(--fp-sans); font-size: 0.875rem; font-weight: bold; max-width: 480px; margin-left: auto; margin-right: auto;">' +
          '      Hubo un error. Intentá de nuevo.' +
          '    </div>' +
          '  </div>' +
          '</div>';
      } else if (type === 'contacto-propiedad') {
        container.innerHTML = 
          '<div class="fp2-sidebar-header" style="margin-bottom: 0.75rem; padding-bottom: 0.5rem;">' +
          '  <h3 class="fp2-sidebar-title" style="text-align: center;">¿Más información?</h3>' +
          '</div>' +
          '<form class="fp2-form fp-dynamic-brevo-form" data-type="propiedad" style="gap: 1rem; margin-top: 0;">' +
          '  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">' +
          '    <div class="fp2-input-wrapper">' +
          '      <input type="text" name="NOMBRE" placeholder=" " required="required" class="fp2-input-field fp-dyn-input" pattern="^[^0-9]+$" />' +
          '      <label class="fp2-floating-label">Nombre *</label>' +
          '    </div>' +
          '    <div class="fp2-input-wrapper">' +
          '      <input type="tel" name="TELEFONO" placeholder=" " required="required" class="fp2-input-field fp-dyn-input" pattern="[0-9]+" />' +
          '      <label class="fp2-floating-label">Teléfono *</label>' +
          '    </div>' +
          '  </div>' +
          '  <div class="fp2-input-wrapper">' +
          '    <input type="email" name="EMAIL" placeholder=" " required="required" class="fp2-input-field fp-dyn-input" pattern="^[^@]+@[^@]+\\.[a-zA-Z]{2,}$" />' +
          '    <label class="fp2-floating-label">Correo electrónico *</label>' +
          '  </div>' +
          '  <div class="fp2-input-wrapper">' +
          '    <textarea name="MENSAJE" rows="2" placeholder=" " required="required" class="fp2-input-field fp2-textarea-field fp-dyn-input">Hola, quisiera consultar por esta propiedad.</textarea>' +
          '    <label class="fp2-floating-label">Mensaje *</label>' +
          '  </div>' +
          '  <div style="display: flex; align-items: flex-start; gap: 0.5rem; margin-top: -0.25rem;">' +
          '    <input type="checkbox" id="fp-dyn-terms" name="TERMINOS" required="required" checked="checked" class="fp-dyn-input" style="margin-top: 0.25rem; accent-color: var(--fp5-color-accent);" />' +
          '    <label for="fp-dyn-terms" style="font-size: 0.75rem; color: var(--fp2-color-text-muted); line-height: 1.4; user-select: none; cursor: pointer;">Acepto los <a href="https://foro-inmobiliario.blogspot.com/2025/01/terminos-y-condiciones-de-uso.html" target="_blank" style="color: inherit; text-decoration: underline;">Términos y Condiciones de Uso</a> y las <a href="https://www.facundopolo.com/2025/01/politicas-de-proteccion-de-datos.html" target="_blank" style="color: inherit; text-decoration: underline;">Polticas de Privacidad</a></label>' +
          '  </div>' +
          '  <div class="fp-dyn-err-msg fp2-error-msg" style="position:relative; text-align:left; margin-top:0.25rem;">* Verifica los campos obligatorios.</div>' +
          '  <button type="submit" class="fp5-btn is-outline is-block fp-dyn-submit fp5-mt-2">' +
          '    Enviar Consulta' +
          '  </button>' +
          '</form>' +
          '<div class="fp-dyn-ok fp2-alert-success" style="display:none; padding:1rem; border-radius:0.5rem; background-color:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0;">Consulta enviada con éxito. Nos contactaremos pronto.</div>' +
          '<div class="fp-dyn-err-api fp2-alert-error" style="display:none; padding:1rem; border-radius:0.5rem; background-color:#fef2f2; color:#dc2626; border:1px solid #fecaca;">Hubo un error al enviar. Intentá de nuevo.</div>' +
          '<a href="https://wa.me/5493416761176" target="_blank" class="fp5-btn is-whatsapp is-block fp-dyn-wsp fp5-mt-3">' +
          '  <i class="ph ph-whatsapp-logo fp5-icon-md"></i>' +
          '  Enviar por WhatsApp' +
          '</a>';
      }

      var form = container.querySelector('.fp-dynamic-brevo-form');
      
      var wspBtn = container.querySelector('.fp-dyn-wsp');
      if (wspBtn || type === 'contacto-propiedad') {
        var tEl = document.querySelector('.fp2-title, .fp5-title-xl, .fp5-title-custom-xl, h1');
        var cEl = document.getElementById('fp2-code-display') || document.getElementById('fp5-code-display');
        var t = tEl ? tEl.innerText.trim() : '';
        var c = cEl ? cEl.innerText.trim() : '';
        var msgText = c ? ('Hola Facundo, te consulto por la propiedad: ' + t + ' (' + c + ')') : 'Hola Facundo, tengo una consulta.';
          
          if (type === 'contacto-propiedad') {
            var ta = container.querySelector('textarea[name="MENSAJE"]');
            if (ta && c) {
              ta.value = msgText + '.';
              ta.classList.add('touched');
            } else if (ta && !c) {
              ta.value = '';
            }
          }

        if (wspBtn) {
          wspBtn.addEventListener('click', function(e) {
              if (form) {
                inputs.forEach(function(i) { i.classList.add('touched'); });
                if (!form.checkValidity()) {
                  e.preventDefault();
                  checkValidity();
                  return;
                }
              }
              var nombreEl = form ? form.querySelector('input[name="NOMBRE"]') : null;
            var emailEl = form ? form.querySelector('input[name="EMAIL"]') : null;
            var telEl = form ? form.querySelector('input[name="TELEFONO"]') : null;
            var msgEl = form ? form.querySelector('textarea[name="MENSAJE"]') : null;

            var nombre = nombreEl ? nombreEl.value.trim() : '';
            var email = emailEl ? emailEl.value.trim() : '';
            var tel = telEl ? telEl.value.trim() : '';
            var userMsg = msgEl ? msgEl.value.trim() : '';

            var finalMsg = msgText;
            if (nombre) {
              finalMsg = finalMsg.replace('Hola Facundo,', 'Hola Facundo, soy ' + nombre + ' y');
            }

            if (userMsg && userMsg !== (msgText + '.') && userMsg !== msgText && userMsg !== 'Hola Facundo, quiero hacerte una consulta.') {
               finalMsg += '\n\nTe escribo para dejarte este mensaje:\n"' + userMsg + '"';
            }

            if (tel || email) {
              finalMsg += '\n\nMis datos de contacto son:';
              if (tel) finalMsg += '\nTel: ' + tel;
              if (email) finalMsg += '\nEmail: ' + email;
            }

            var base = this.href.split('?')[0];
            this.href = base + '?text=' + encodeURIComponent(finalMsg);
          });
        }
      }

      if (!form) return;
        var nameInput = form.querySelector('input[name="NOMBRE"]');
        if (nameInput) {
          nameInput.addEventListener('input', function() {
            this.value = this.value.replace(/[0-9]/g, '');
          });
        }
        var telInput = form.querySelector('input[name="TELEFONO"]');
        if (telInput) {
          telInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9\+\s\-]/g, '');
          });
        }
        var inputs = form.querySelectorAll('input, textarea');
      var submitBtn = form.querySelector('.fp-dyn-submit');
      var errMsg = container.querySelector('.fp-dyn-err-msg');
      var okBox = container.querySelector('.fp-dyn-ok');
      var errApiBox = container.querySelector('.fp-dyn-err-api');
      
      function checkValidity() {
        var emptyFields = [];
        var invalidFields = [];
        
        inputs.forEach(function(f) {
          if (f.classList.contains('fp-dyn-email')) f.style.borderColor = '#c0c0c0';
          
          if (f.classList.contains('touched') && !f.validity.valid) {
            var name = f.name || 'Campo';
            if (name === 'NOMBRE') name = 'Nombre';
            else if (name === 'EMAIL') name = 'Correo';
            else if (name === 'TELEFONO') name = 'Teléfono';
            else if (name === 'MENSAJE') name = 'Mensaje';
            else if (name === 'TERMINOS') name = 'Términos';
            else name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            var isEmpty = f.type === 'checkbox' ? !f.checked : f.value.trim() === '';
            if (isEmpty) {
              emptyFields.push(name);
            } else {
              invalidFields.push(name);
            }
            
            if (f.classList.contains('fp-dyn-email')) {
              f.style.borderColor = '#ab0030';
            }
          }
        });
        
        function formatList(list) {
          if (list.length === 0) return '';
          if (list.length === 1) return list[0];
          return list.slice(0, -1).join(', ') + ' y ' + list[list.length - 1];
        }

        var msgParts = [];
        if (emptyFields.length === 1) {
          msgParts.push('El campo ' + formatList(emptyFields) + ' es requerido.');
        } else if (emptyFields.length > 1) {
          msgParts.push('Los campos ' + formatList(emptyFields) + ' son requeridos.');
        }

        if (invalidFields.length === 1) {
          msgParts.push('Ingrese un ' + formatList(invalidFields) + ' válido.');
        } else if (invalidFields.length > 1) {
          msgParts.push('Ingrese ' + formatList(invalidFields) + ' válidos.');
        }
        
        if (msgParts.length > 0) {
          errMsg.innerHTML = '* ' + msgParts.join(' ');
          errMsg.style.display = 'block';
        } else {
          errMsg.style.display = 'none';
        }
      }

      inputs.forEach(function(i) {
        i.addEventListener('blur', function() { i.classList.add('touched'); checkValidity(); });
        i.addEventListener('input', function() { i.classList.add('touched'); checkValidity(); });
      });

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        inputs.forEach(function(i) { i.classList.add('touched'); });
        if (!form.checkValidity()) {
          checkValidity();
          return;
        }
        errMsg.style.display = 'none';
        
        var data = new FormData(form);
        var origText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Enviando...';
        submitBtn.disabled = true;

        fetch('https://047b388b.sibforms.com/serve/MUIFAN_BGoVu8gemnRr5SMUAHGAjqQkHi8QGoqRqiq3fT0tky9bw5Z7zM7eXU2gBrJU29ZCTYK43g9qkDi0BHDs8MTu-A1EFlp8-U5ZqKad_NUVLezI5BM1iwWni-aloZac93838sRlVkfqi8mjK4pSsEcIZK69JOKn5CA7sUpW2iIfey5-kBZjdBDFCq_Z6FS3M0uUheskI2L6SWA==', {
          method: 'POST', body: data, mode: 'no-cors'
        }).then(function() {
          form.style.display = 'none';
          okBox.style.display = 'block';
        }).catch(function() {
          submitBtn.innerHTML = origText;
          submitBtn.disabled = false;
          errApiBox.style.display = 'block';
        });
      });
    });
  };

  /* ============================================================================ */
  /* LÓGICA DE PROPIEDADES (Pestañas, Acordeones, Slider) */
  /* ============================================================================ */
  // 1. Lógica de Pestañas (exponer globalmente)
  window.SeleccionarTab = function(tabId, contentId) {
    document.querySelectorAll('.ficha-multimedia-item').forEach(function(el){ el.classList.remove('item-sel'); });
    document.querySelectorAll('.multimedia').forEach(function(el){ el.classList.remove('multimedia_visible'); });
    var t = document.getElementById(tabId);
    var c = document.getElementById(contentId);
    if(t) t.classList.add('item-sel');
    if(c) c.classList.add('multimedia_visible');
  };

  // 2. Lógica de Acordeones (exponer globalmente)
  window.AbrirCerrarBloque = function(id) {
    var bloque = document.getElementById(id);
    if(bloque) {
      if(bloque.classList.contains('ficha-bloque-sel')) {
        bloque.classList.remove('ficha-bloque-sel');
      } else {
        bloque.classList.add('ficha-bloque-sel');
      }
    }
  };

  window.initPropertyLogic = function() {
    var page = document.querySelector('.fp2-page');
    if (!page) return; // Sólo se ejecuta si hay una propiedad

    // 3. Inicialización de Lucide
    if(window.lucide) {
      try { lucide.createIcons(); } catch(e) {}
    }

    // 4. Lógica del Slider
    var slides = document.querySelectorAll('#fpSlider .fp-slide');
    var currentSlide = 0;
    var dotsContainer = document.getElementById('fpDots');
    var counter = document.getElementById('fpCounter');
    
    if(slides.length) {
      slides.forEach(function(_, i) {
        var dot = document.createElement('button');
        dot.className = 'fp-slider-dot' + (i === 0 ? ' active' : '');
        dot.onclick = function() { goToSlide(i); };
        if(dotsContainer) dotsContainer.appendChild(dot);
      });
      
      var dots = document.querySelectorAll('.fp-slider-dot');
      
      function updateSlider() {
        slides.forEach(function(s, i) {
          s.classList.toggle('active', i === currentSlide);
          if(dots[i]) dots[i].classList.toggle('active', i === currentSlide);
        });
        if(counter) counter.innerText = (currentSlide + 1) + ' / ' + slides.length;
      }
      
      function goToSlide(n) { currentSlide = n; updateSlider(); }
      
      var prev = document.getElementById('fpPrev');
      var next = document.getElementById('fpNext');
      if(prev) prev.onclick = function() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; updateSlider(); };
      if(next) next.onclick = function() { currentSlide = (currentSlide + 1) % slides.length; updateSlider(); };
    }

    // 5. Lógica de Favoritos (LocalStorage)
    var btnFav = document.getElementById('btn-favorito');
    if (btnFav) {
      var propUrl = window.location.href.split('?')[0];
      var titleEl = document.querySelector('.fp2-title');
      var propTitle = titleEl ? titleEl.innerText : document.title;
      var favs = [];
      try { favs = JSON.parse(localStorage.getItem('fp_favorites')) || []; } catch(e) {}
      var isFav = favs.some(function(f) { return f.url === propUrl; });
      var icon = btnFav.querySelector('svg') || btnFav.querySelector('i');
      if (isFav && icon) {
        icon.setAttribute('fill', 'currentColor');
        btnFav.style.color = '#ab0030';
      }
      btnFav.onclick = function() {
        var idx = favs.findIndex(function(f) { return f.url === propUrl; });
        icon = btnFav.querySelector('svg') || btnFav.querySelector('i');
        if (idx > -1) {
          favs.splice(idx, 1);
          if (icon) { icon.setAttribute('fill', 'none'); btnFav.style.color = ''; }
        } else {
          favs.push({ url: propUrl, title: propTitle });
          if (icon) { icon.setAttribute('fill', 'currentColor'); btnFav.style.color = '#ab0030'; }
        }
        try { localStorage.setItem('fp_favorites', JSON.stringify(favs)); } catch(e) {}
      };
    }

    // 6. Lógica de Alertas (Campana -> Popup)
    var btnAlerta = document.getElementById('btn-alerta');
    if (btnAlerta) {
      btnAlerta.onclick = function() {
        var modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.6)';
        modal.style.zIndex = '999999';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.padding = '1rem';
        
        var modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '2rem';
        modalContent.style.borderRadius = '12px';
        modalContent.style.width = '100%';
        modalContent.style.maxWidth = '450px';
        modalContent.style.position = 'relative';
        modalContent.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '0.5rem';
        closeBtn.style.right = '1rem';
        closeBtn.style.fontSize = '1.5rem';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = function() { document.body.removeChild(modal); };
        
        var formWrap = document.createElement('div');
        formWrap.className = 'fp2-dynamic-form';
        formWrap.setAttribute('data-type', 'contacto-propiedad');
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(formWrap);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        if (typeof window.initDynamicForms === 'function') {
          window.initDynamicForms();
          var textarea = formWrap.querySelector('textarea');
          var tEl = document.querySelector('.fp2-title');
          var pt = tEl ? tEl.innerText : '';
          if (textarea) {
            textarea.value = '¡Hola! Quiero suscribirme para recibir alertas y propiedades similares a esta: ' + pt;
            textarea.classList.add('touched');
          }
          // Remove whatsapp button from popup to keep it simple
          var wbtn = formWrap.querySelector('.fp-dyn-wsp');
          if (wbtn) wbtn.style.display = 'none';
        }
      };
    }
  };

  window.initFinancials = function() {
    var valOficialEl = document.getElementById('val-dolar-oficial');
    var valBlueEl = document.getElementById('val-dolar-blue');
    if (!valOficialEl && !valBlueEl) return;

    var parseMoney = function(str) {
      if (!str) return 0;
      var clean = str.replace(/[^0-9,.]/g, '');
      if (clean.indexOf(',') > -1 && clean.indexOf('.') > -1) {
        clean = clean.replace(/\./g, '').replace(',', '.');
      } else if (clean.indexOf(',') > -1) {
        clean = clean.replace(',', '.');
      }
      var stripped = str.replace(/[^0-9,-]/g, '');
      return parseFloat(stripped.replace(',', '.'));
    };

    var formatMoney = function(num) {
      return '$' + num.toLocaleString('es-AR', {minimumFractionDigits: 0, maximumFractionDigits: 2});
    };

    var updateVariation = function(varId, oldVal, newVal) {
      var varEl = document.getElementById(varId);
      if (!varEl) return;
      var diff = newVal - oldVal;
      var perc = oldVal > 0 ? Math.abs((diff / oldVal) * 100) : 0;
      var percStr = perc.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '%';
      
      if (diff > 0) {
        varEl.innerHTML = "<span class='text-green-500 text-[10px]'>&#9650;</span> <span class='font-[Roboto,sans-serif] font-bold text-[#1f1f1f] text-[12px] leading-[12px]'>" + percStr + "</span> <span class='font-[Roboto,sans-serif] font-light text-[#555555] text-[12px] leading-[12px]'>Últimas 24 hs</span>";
      } else if (diff < 0) {
        varEl.innerHTML = "<span class='text-red-500 text-[10px]'>&#9660;</span> <span class='font-[Roboto,sans-serif] font-bold text-[#1f1f1f] text-[12px] leading-[12px]'>" + percStr + "</span> <span class='font-[Roboto,sans-serif] font-light text-[#555555] text-[12px] leading-[12px]'>Últimas 24 hs</span>";
      } else {
        varEl.innerHTML = "<span class='font-[Roboto,sans-serif] font-bold text-[#1f1f1f] text-[12px] leading-[12px]'>= 0,00%</span> <span class='font-[Roboto,sans-serif] font-light text-[#555555] text-[12px] leading-[12px]'>Últimas 24 hs</span>";
      }
    };

    fetch('https://dolarapi.com/v1/dolares')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        var getPeriodId = function() {
          var now = new Date();
          var d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0);
          var day = d.getDay();
          if (now.getHours() < 10) {
             d.setDate(d.getDate() - 1);
             day = d.getDay();
          }
          if (day === 0) d.setDate(d.getDate() - 2);
          else if (day === 6) d.setDate(d.getDate() - 1);
          return d.toISOString();
        };
        var today = getPeriodId();
        var mem = { baseDate: today, baseOficial: 0, baseBlue: 0, lastOficial: 0, lastBlue: 0 };
        try { 
          var parsed = JSON.parse(localStorage.getItem('fp_dolar_mem'));
          if (parsed) mem = parsed;
        } catch(e) {}

        var htmlOficial = parseFloat(valOficialEl.innerText.replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, '')) || 0;
        var htmlBlue = parseFloat(valBlueEl.innerText.replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, '')) || 0;

        if (mem.baseOficial === 0) mem.baseOficial = htmlOficial;
        if (mem.baseBlue === 0) mem.baseBlue = htmlBlue;

        if (mem.baseDate !== today) {
           mem.baseDate = today;
           mem.baseOficial = mem.lastOficial > 0 ? mem.lastOficial : htmlOficial;
           mem.baseBlue = mem.lastBlue > 0 ? mem.lastBlue : htmlBlue;
        }

        data.forEach(function(d) {
          if (d.casa === 'oficial' && valOficialEl) {
            valOficialEl.innerText = formatMoney(d.venta);
            updateVariation('var-dolar-oficial', mem.baseOficial, d.venta);
            mem.lastOficial = d.venta;
          }
          if (d.casa === 'blue' && valBlueEl) {
            valBlueEl.innerText = formatMoney(d.venta);
            updateVariation('var-dolar-blue', mem.baseBlue, d.venta);
            mem.lastBlue = d.venta;
          }
          if (d.casa === 'tarjeta') {
            var el = document.getElementById('val-dolar-tarjeta');
            if (el) el.innerText = formatMoney(d.venta);
          }
          if (d.casa === 'bolsa') {
            var el = document.getElementById('val-dolar-mep');
            if (el) el.innerText = formatMoney(d.venta);
          }
          if (d.casa === 'contadoconliqui') {
            var el = document.getElementById('val-dolar-ccl');
            if (el) el.innerText = formatMoney(d.venta);
          }
        });
        
        try { localStorage.setItem('fp_dolar_mem', JSON.stringify(mem)); } catch(e) {}
      })
      .catch(function(e) { console.error('Error fetching dolar api:', e); });
  
};

document.addEventListener("DOMContentLoaded", function() {

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fp5-mobile-hover', 'is-scroll-active');
        } else {
          entry.target.classList.remove('fp5-mobile-hover', 'is-scroll-active');
        }
      });
    }, { rootMargin: '-50% 0px -49% 0px' });
    document.querySelectorAll('.fp5-card.is-interactive, .fp5-faq-card, .fp2-cell').forEach(el => {
      scrollObserver.observe(el);
    });

  if (typeof window.initDynamicForms === "function") window.initDynamicForms();
  if (typeof window.initPropertyLogic === "function") window.initPropertyLogic();
  if (typeof window.initFinancials === "function") window.initFinancials();
});


/* ============================================================================ */
/* ANTIGRAVITY DESIGN EXPERT EXTENSION (v3)                                     */
/* ============================================================================ */

// 🚀🚀 ANTIGRAVITY PARALLAX ENGINE 🚀🚀
(function initAntigravityParallax() {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  function onScroll() {
    var scrolled = window.pageYOffset;
    document.querySelectorAll('.fp5-ag-parallax-inner').forEach(function(el) {
      var speed = el.getAttribute('data-parallax-speed') || 0.15;
      // Start slightly below 0 so it moves upward smoothly
      var yPos = -(scrolled * speed);
      el.style.transform = 'translate3d(0px, ' + yPos + 'px, 0px)';
    });
  }
  
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// 🚀🚀 ANTIGRAVITY STAGGERED OBSERVER 🚀🚀
(function initAntigravityStagger() {
  if (!('IntersectionObserver' in window)) return;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var container = entry.target;
        var items = container.querySelectorAll('.fp5-ag-stagger-item');
        items.forEach(function(item, index) {
          if (!prefersReducedMotion) {
            item.style.transitionDelay = (index * 0.15) + 's';
          }
          setTimeout(function() {
            item.classList.add('is-visible');
          }, 50);
        });
        observer.unobserve(container);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.fp5-ag-stagger-grid').forEach(function(grid) {
      observer.observe(grid);
    });
  });
  
  // If already loaded, run immediately
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    document.querySelectorAll('.fp5-ag-stagger-grid').forEach(function(grid) {
      observer.observe(grid);
    });
  }
})();
