(function () {
  var C = window.CONFIG, reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Dados do CONFIG */
  document.querySelectorAll('[data-crn]').forEach(function (e) { e.textContent = C.crn || 'CRN-3 a preencher'; });
  document.querySelectorAll('[data-crtp]').forEach(function (e) { e.textContent = C.crtp; });
  document.querySelectorAll('[data-gnota]').forEach(function (e) { e.textContent = C.google.nota; });
  document.querySelectorAll('[data-gtotal]').forEach(function (e) { e.textContent = C.google.total; });
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = linkWA(a.getAttribute('data-msg'));
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* Loader: a laranja enche de suco de 0 a 100% e a folha brota */
  var loader = document.getElementById('loader'), num = document.getElementById('loaderNum');
  var suco = loader && loader.querySelector('.logo-anim__suco');
  function fecha() { loader.classList.add('is-fim'); document.body.classList.add('pronto'); setTimeout(function () { loader.remove(); }, 700); }
  if (loader) {
    if (reduz) { fecha(); }
    else {
      var dur = 2400, t0 = performance.now();
      (function passo(t) {
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 2.2);
        num.textContent = Math.round(e * 100);
        suco.style.clipPath = 'inset(' + (100 - e * 100) + '% 0 0 0)';
        if (e > .82) loader.classList.add('is-folha');
        if (p < 1) requestAnimationFrame(passo); else setTimeout(fecha, 650);
      })(t0);
    }
  }

  /* Navegação */
  var nav = document.getElementById('nav'), btn = document.getElementById('menuBtn'), links = document.querySelector('.nav__links');
  var wa = document.querySelector('.wa-flutua');
  addEventListener('scroll', function () {
    nav.classList.toggle('is-rolou', scrollY > 10);
    wa.classList.toggle('is-on', scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', function () {
    var aberto = links.classList.toggle('is-aberto');
    btn.setAttribute('aria-expanded', aberto);
  });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') { links.classList.remove('is-aberto'); btn.setAttribute('aria-expanded', false); } });

  /* Cantinho dos estudos */
  var CORES = { clinica: 'var(--verde)', esportiva: 'var(--laranja-esc)', fito: 'var(--oliva)', mente: 'var(--terra)' };
  var NOMES = { clinica: 'Clínica', esportiva: 'Esportiva', fito: 'Fitoterapia', mente: 'Mente' };
  var ESTUDOS = [
    ['2024', 'fito', 'Fitoterapia Avançada: Ciência, Tradicionalidade e Clínica', '1º Simpósio da Especialização · USP/FMUSP'],
    ['2024', 'clinica', 'Nutriday Vitafor Science', 'Evento para nutricionistas · Campinas/SP · 11h'],
    ['2024', 'esportiva', 'Hormonização, Nutrição e Treinamento Feminino', '20ª Clínica Prática · Uniguaçu · São Paulo/SP · 8h'],
    ['2024', 'clinica', '1º Congresso Multidisciplinar em Saúde', 'Escola Mineira de Humanidades · 12h'],
    ['2023', 'mente', 'Semana da Saúde e Performance Cerebral', 'Central Nutrition · 3h'],
    ['2023', 'clinica', 'Obesidade e Doença Hepática Gordurosa Metabólica', 'Atualização · março de 2023'],
    ['2022', 'clinica', 'Nutrição Estética: uma visão integrativa', '2ª Certificação Lantana · Instituto Lantana · 8h'],
    ['2021', 'clinica', 'Pós-graduação em Cirurgia Bariátrica (lançamento)', 'Congressista · IPEMED · 2h'],
    ['2020', 'esportiva', 'Suplementação esportiva', 'Creatina, ergogênicos, carboidratos e BCAA · ABED · 40h'],
    ['2020', 'esportiva', 'Nutrição para o Sistema Imune do Atleta', 'Workshop para atletas e praticantes de atividade física'],
    ['2020', 'esportiva', '1º Simpósio de Medicina do Esporte (SIMEDE)', 'Humanitas / IFMSA Brazil · São José dos Campos · 12h'],
    ['2019', 'mente', 'Transtornos de Ansiedade e Depressão', 'Curso de extensão · São José dos Campos · 8h']
  ];
  var lista = document.getElementById('estudosLista');
  if (lista) {
    lista.innerHTML = ESTUDOS.map(function (e) {
      return '<li class="estudo revela" data-a="' + e[1] + '" style="--c:' + CORES[e[1]] + '">' +
        '<span class="estudo__ano">' + e[0] + '</span>' +
        '<span class="estudo__tag">' + NOMES[e[1]] + '</span>' +
        '<h3>' + e[2] + '</h3><p>' + e[3] + '</p></li>';
    }).join('');
    document.getElementById('estudosConta').textContent = ESTUDOS.length;
    document.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        document.querySelectorAll('.chip').forEach(function (o) { o.classList.toggle('is-on', o === c); });
        var f = c.getAttribute('data-f');
        lista.querySelectorAll('.estudo').forEach(function (li) { li.classList.toggle('is-fora', f !== 'todos' && li.getAttribute('data-a') !== f); });
      });
    });
  }

  /* Formulário → WhatsApp */
  var form = document.getElementById('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var msg = 'Olá, Graziella! Meu nome é ' + d.get('nome') + '. Vi seu site e gostaria de agendar uma consulta. Objetivo: ' + d.get('obj') + '.';
    window.open(linkWA(msg), '_blank', 'noopener');
  });

  /* Revelar ao rolar */
  document.querySelectorAll('.sec__cab, .mitos li, .dores__lista li, .passos__lista li, .formato, .diaadia__foto, .sobre__texto, .sobre__foto, .faq details, .nota, .contato__info').forEach(function (e) { e.classList.add('revela'); });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-on'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('.revela').forEach(function (e, i) { e.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(e); });
})();
