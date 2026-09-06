/* ============================================================================
   main.js
   Reproduz os comportamentos que no original eram fornecidos pelo Elementor:
     · sticky do header (classe .elementor-sticky--effects)
     · pop-up "Pop Menu" (id 229): abrir, fechar, overlay, trava de scroll
     · animacoes de entrada (entrance animations) via IntersectionObserver
     · dynamic tag "current-date-time" do copyright do rodape
   ============================================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  1. STICKY DO HEADER  ·  container #71680671 (sticky: top)          */
  /*     custom_css aplica o fundo quando a barra "gruda" no topo.       */
  /* ------------------------------------------------------------------ */
  var navbar = document.getElementById('siteNavbar');

  if (navbar) {
    var updateSticky = function () {
      var stuck = navbar.getBoundingClientRect().top <= 0;
      navbar.classList.toggle('elementor-sticky--effects', stuck);
    };
    window.addEventListener('scroll', updateSticky, { passive: true });
    window.addEventListener('resize', updateSticky);
    updateSticky();
  }

  /* ------------------------------------------------------------------ */
  /*  2. POP-UP  ·  elementor-229 "Pop Menu"                             */
  /*     page_settings: prevent_scroll = yes                             */
  /*                    prevent_close_on_esc_key = yes (ESC nao fecha)   */
  /*                    entrance/exit animation = slideInRight, 0.9s     */
  /* ------------------------------------------------------------------ */
  var EXIT_DURATION = 900;   /* entrance_animation_duration: 0.9s */

  function openPopup(popup) {
    if (!popup || popup.classList.contains('is-open')) return;
    popup.hidden = false;
    popup.classList.remove('is-closing');
    popup.classList.add('is-open');
    document.body.style.overflow = 'hidden';          /* prevent_scroll */
    var closeBtn = popup.querySelector('[data-popup-close]');
    if (closeBtn) closeBtn.focus();
  }

  function closePopup(popup) {
    if (!popup || !popup.classList.contains('is-open')) return;
    popup.classList.add('is-closing');
    window.setTimeout(function () {
      popup.classList.remove('is-open', 'is-closing');
      popup.hidden = true;
      document.body.style.overflow = '';
    }, EXIT_DURATION);
  }

  /* gatilhos: icones hamburguer do header (dynamic tag popup id 229) */
  document.querySelectorAll('[data-popup-open]').forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      openPopup(document.getElementById(trigger.getAttribute('data-popup-open')));
    });
  });

  /* botao de fechar */
  document.querySelectorAll('[data-popup-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closePopup(btn.closest('.e-popup'));
    });
  });

  /* clique no overlay fecha (prevent_close_on_background nao definido) */
  document.querySelectorAll('.e-popup').forEach(function (popup) {
    popup.addEventListener('click', function (event) {
      if (event.target === popup) closePopup(popup);
    });
    /* links internos do menu fecham o popup e navegam ate a ancora */
    popup.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () { closePopup(popup); });
    });
  });

  /* ESC nao fecha: prevent_close_on_esc_key = "yes" */

  /* ------------------------------------------------------------------ */
  /*  3. ANIMACOES DE ENTRADA                                            */
  /*     O Elementor mantem o elemento invisivel ate ele entrar na tela  */
  /*     e entao adiciona as classes "animated <nome-da-animacao>".      */
  /* ------------------------------------------------------------------ */
  var animated = document.querySelectorAll('.e-anim[data-anim]');

  function play(el) {
    el.classList.add('animated', el.getAttribute('data-anim'));
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          play(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    animated.forEach(function (el) { observer.observe(el); });
  } else {
    animated.forEach(play);
  }

  /* ------------------------------------------------------------------ */
  /*  4. COPYRIGHT  ·  text-editor #7b28da2f                             */
  /*     dynamic tag "current-date-time", custom_format "Y"              */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('[data-current-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

}());
