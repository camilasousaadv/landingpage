/* ============================================================================
   carousel.js
   Carrossel "Nossos Servicos" — script extraido do widget html #38c09a94
   (elementor-1131). Logica preservada integralmente; apenas encapsulada em
   IIFE e com guarda para o caso de os elementos nao existirem na pagina.
   ============================================================================ */
(function () {
  'use strict';

  var track = document.getElementById('track');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');

  if (!track || !prevBtn || !nextBtn) return;

  var totalCards = track.children.length;

  /* =========================================
     QUANTIDADE DE CARDS VISIVEIS
  ========================================= */
  function getVisible() {
    var w = window.innerWidth;

    if (w <= 640) return 1;
    if (w <= 980) return 2;
    return 3;
  }

  var index = 0;

  /* =========================================
     ATUALIZAR CARROSSEL
  ========================================= */
  function update() {
    var visible = getVisible();

    var maxIndex = Math.max(0, totalCards - visible);

    index = Math.min(index, maxIndex);

    var card = track.children[0];

    var cardWidth = card.getBoundingClientRect().width;

    var gap = parseFloat(getComputedStyle(track).gap) || 0;

    var offset = index * (cardWidth + gap);

    track.style.transform = 'translateX(-' + offset + 'px)';

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= maxIndex;
  }

  /* =========================================
     BOTAO ANTERIOR
  ========================================= */
  prevBtn.addEventListener('click', function () {
    index = Math.max(0, index - 1);
    update();
  });

  /* =========================================
     BOTAO PROXIMO
  ========================================= */
  nextBtn.addEventListener('click', function () {
    var visible = getVisible();

    var maxIndex = Math.max(0, totalCards - visible);

    index = Math.min(maxIndex, index + 1);

    update();
  });

  /* =========================================
     RESPONSIVIDADE
  ========================================= */
  window.addEventListener('resize', update);
  window.addEventListener('load', update);

  update();

}());
