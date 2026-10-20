/* A laranja das especialidades (4 gomos clicáveis) e o balanço da folha da logo. */
(function () {
  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  var ESPECIALIDADES = [
    {
      id: 'clinica', nome: 'Clínica', cor: 'var(--verde)', angulo: -90,
      titulo: 'Nutrição clínica',
      texto: 'Para cuidar da saúde com um plano que cabe na sua rotina, sem cortar tudo de uma vez.',
      itens: ['Colesterol, glicemia, pressão e exames alterados', 'Intestino, refluxo e doenças inflamatórias intestinais', 'Acompanhamento de quem usa canetas para emagrecer (análogos de GLP-1)', 'Reeducação alimentar e relação com a comida'],
      msg: 'Olá, Graziella! Queria saber mais sobre a nutrição clínica.'
    },
    {
      id: 'esportiva', nome: 'Esportiva', cor: 'var(--laranja)', angulo: 0,
      titulo: 'Nutrição esportiva',
      texto: 'Para quem treina, corre ou está começando a se mexer. Eu também corro, então falo a língua do treino.',
      itens: ['O que comer antes, durante e depois do treino', 'Energia para a corrida, do iniciante ao amador', 'Massa muscular e recuperação', 'Suplementação só quando faz sentido para você'],
      msg: 'Olá, Graziella! Queria saber mais sobre a nutrição esportiva.'
    },
    {
      id: 'fito', nome: 'Fitoterapia', cor: 'var(--oliva)', angulo: 90,
      titulo: 'Fitoterapia',
      texto: 'Plantas medicinais e chás como apoio ao plano alimentar, indicados com critério e dentro do que é permitido ao nutricionista.',
      itens: ['Indicação individual, nunca uma receita pronta', 'Sempre em conjunto com a alimentação', 'Atenção a medicamentos que você já usa'],
      msg: 'Olá, Graziella! Queria saber mais sobre a fitoterapia.'
    },
    {
      id: 'idoso', nome: ['Saúde do', 'idoso'], cor: 'var(--terra)', angulo: 180,
      titulo: 'Saúde do idoso',
      texto: 'Chegou a hora de cuidar de quem cuidou de você. Alimentação para envelhecer com força, apetite e autonomia.',
      itens: ['Prevenção e cuidado da sarcopenia (perda de massa muscular)', 'Apetite, mastigação e hidratação', 'Doenças crônicas e uso de vários medicamentos', 'Atendimento em casa (home care), com a família por perto'],
      msg: 'Olá, Graziella! Queria saber mais sobre a nutrição para a saúde do idoso.'
    }
  ];
  window.ESPECIALIDADES = ESPECIALIDADES;

  function el(nome, attrs, pai) {
    var e = document.createElementNS(NS, nome);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (pai) pai.appendChild(e);
    return e;
  }
  function pt(r, graus) { var a = graus * Math.PI / 180; return [r * Math.cos(a), r * Math.sin(a)]; }

  /* ---------- Laranja das especialidades ---------- */
  var alvo = document.getElementById('espLaranja');
  var painel = document.getElementById('espPainel');
  if (alvo && painel) {
    var svg = el('svg', { viewBox: '-140 -150 280 290', role: 'presentation' });
    var defs = el('defs', {}, svg);
    var g1 = el('radialGradient', { id: 'gGomo', cx: '0', cy: '0', r: '1.1' }, defs);
    el('stop', { offset: '0', 'stop-color': '#FFD25A' }, g1);
    el('stop', { offset: '1', 'stop-color': '#F49A1E' }, g1);
    var g2 = el('radialGradient', { id: 'gGomoOn', cx: '0', cy: '0', r: '1.1' }, defs);
    el('stop', { offset: '0', 'stop-color': '#FFE089' }, g2);
    el('stop', { offset: '1', 'stop-color': '#FFB43A' }, g2);

    // casca e parte branca
    el('circle', { r: 122, fill: '#F28A1A' }, svg);
    el('circle', { r: 116, fill: '#FBB13C' }, svg);
    el('circle', { r: 110, fill: '#FFF1D6' }, svg);

    var gomos = [];
    ESPECIALIDADES.forEach(function (esp, i) {
      var g = el('g', { class: 'gomo', tabindex: '0', role: 'tab', 'aria-label': esp.titulo, 'data-i': i }, svg);
      var a0 = esp.angulo - 41, a1 = esp.angulo + 41, r0 = 9, r1 = 101;
      var p0 = pt(r0, a0), p1 = pt(r1, a0), p2 = pt(r1, a1), p3 = pt(r0, a1);
      el('path', {
        d: 'M' + p0 + 'L' + p1 + 'A' + r1 + ' ' + r1 + ' 0 0 1 ' + p2 + 'L' + p3 + 'A' + r0 + ' ' + r0 + ' 0 0 0 ' + p0 + 'Z',
        fill: 'url(#gGomo)', stroke: 'url(#gGomo)', 'stroke-width': 12, 'stroke-linejoin': 'round', class: 'gomo__polpa'
      }, g);
      // gominhos de suco
      for (var k = 0; k < 9; k++) {
        var ang = esp.angulo - 28 + (k % 3) * 28 + (k > 2 ? 6 : 0), rr = 34 + Math.floor(k / 3) * 22;
        var c = pt(rr, ang);
        el('ellipse', { cx: c[0], cy: c[1], rx: 2.4, ry: 8, fill: '#FFF4CF', opacity: .45, transform: 'rotate(' + (ang + 90) + ' ' + c[0] + ' ' + c[1] + ')' }, g);
      }
      var tp = pt(62, esp.angulo);
      var t = el('text', { x: tp[0], y: tp[1], 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, g);
      var linhas = [].concat(esp.nome);
      linhas.forEach(function (l, j) {
        var ts = el('tspan', { x: tp[0], dy: j === 0 ? (linhas.length > 1 ? '-0.5em' : '0') : '1.1em' }, t);
        ts.textContent = l;
      });
      g.addEventListener('click', function (ev) { usuario(); escolhe(i); gotas(ev); });
      g.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); usuario(); escolhe(i); } });
      g.addEventListener('mouseenter', function () { if (!reduz) g.style.transform = g.classList.contains('is-on') ? g.style.transform : desloca(esp.angulo, 6); });
      g.addEventListener('mouseleave', function () { if (!g.classList.contains('is-on')) g.style.transform = ''; });
      gomos.push(g);
    });

    // folha da logo por cima da laranja
    var folha = el('image', { href: 'assets/logo-folha.png', x: -150, y: -168, width: 230, height: 199, class: 'gomo-folha' }, svg);
    folha.style.transformOrigin = '-5px -144px';
    var camadaGotas = el('g', { class: 'gota' }, svg);
    alvo.appendChild(svg);

    function desloca(angulo, d) { var p = pt(d, angulo); return 'translate(' + p[0] + 'px,' + p[1] + 'px)'; }

    var atual = -1;
    function escolhe(i) {
      if (i === atual) return;
      atual = i;
      var esp = ESPECIALIDADES[i];
      gomos.forEach(function (g, j) {
        var on = j === i;
        g.classList.toggle('is-on', on);
        g.setAttribute('aria-selected', on);
        g.querySelector('.gomo__polpa').setAttribute('fill', on ? 'url(#gGomoOn)' : 'url(#gGomo)');
        g.style.transform = on ? desloca(ESPECIALIDADES[j].angulo, 13) : '';
      });
      var wa = (window.linkWA ? window.linkWA(esp.msg) : '#');
      painel.style.setProperty('--c', esp.cor);
      painel.innerHTML =
        '<p class="rotulo">Gomo ' + (i + 1) + ' de 4</p>' +
        '<h3>' + esp.titulo + '</h3>' +
        '<p>' + esp.texto + '</p>' +
        '<ul>' + esp.itens.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
        '<a class="btn btn--verde" target="_blank" rel="noopener" href="' + wa + '">Perguntar sobre ' + esp.titulo.toLowerCase() + ' <i class="seta"></i></a>';
      painel.classList.remove('is-troca'); void painel.offsetWidth; painel.classList.add('is-troca');
    }
    escolhe(0);

    // troca sozinha até a pessoa interagir
    var mexeu = false, visivel = false;
    function usuario() { mexeu = true; }
    new IntersectionObserver(function (e) { visivel = e[0].isIntersecting; }, { threshold: .3 }).observe(alvo);
    if (!reduz) setInterval(function () { if (!mexeu && visivel && !document.hidden) escolhe((atual + 1) % 4); }, 4200);

    // inclina a laranja na direção do mouse
    var palco = alvo.parentElement;
    if (!reduz) {
      palco.addEventListener('pointermove', function (e) {
        var r = alvo.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        alvo.style.transform = 'rotateY(' + (x * 18) + 'deg) rotateX(' + (-y * 18) + 'deg)';
        folhaAlvo = x * 14;
      });
      palco.addEventListener('pointerleave', function () { alvo.style.transform = ''; folhaAlvo = 0; });
    }

    // gotas de suco no clique
    function gotas(ev) {
      if (reduz) return;
      var r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
      var ox = vb.x + (ev.clientX - r.left) / r.width * vb.width, oy = vb.y + (ev.clientY - r.top) / r.height * vb.height;
      if (!ev.clientX) { ox = 0; oy = 0; }
      var lista = [];
      for (var k = 0; k < 14; k++) {
        var a = Math.random() * Math.PI * 2, v = 1.6 + Math.random() * 3.2;
        lista.push({ x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, r: 2 + Math.random() * 4.5, vida: 1,
          n: el('circle', { r: 3, fill: k % 3 ? '#F6B128' : '#F28A1A' }, camadaGotas) });
      }
      (function passo() {
        var vivas = 0;
        lista.forEach(function (d) {
          if (d.vida <= 0) return;
          d.vy += .22; d.x += d.vx; d.y += d.vy; d.vida -= .025; vivas++;
          d.n.setAttribute('cx', d.x); d.n.setAttribute('cy', d.y); d.n.setAttribute('r', d.r * d.vida); d.n.setAttribute('opacity', d.vida);
          if (d.vida <= 0) d.n.remove();
        });
        if (vivas) requestAnimationFrame(passo);
      })();
    }

    // balanço da folha
    var folhaAlvo = 0, folhaAng = 0;
    if (!reduz) (function anima(t) {
      folhaAng += (folhaAlvo - folhaAng) * .06;
      folha.style.transform = 'rotate(' + (folhaAng + Math.sin(t / 900) * 3) + 'deg)';
      requestAnimationFrame(anima);
    })(0);
  }

  /* ---------- Folha da logo do topo: balança e reage ao mouse ---------- */
  var heroLogo = document.getElementById('heroLogo');
  if (heroLogo && !reduz) {
    var f = heroLogo.querySelector('.logo-anim__folha'), lar = heroLogo.querySelector('.logo-anim__laranja');
    var alvoA = 0, ang = 0, mx = 0, my = 0, px = 0, py = 0;
    addEventListener('pointermove', function (e) {
      var r = heroLogo.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      var dist = Math.hypot(dx, dy);
      alvoA = dist < 260 ? Math.max(-22, Math.min(22, -dx / 10)) : 0; // a folha "foge" do mouse
      mx = Math.max(-1, Math.min(1, dx / 600)); my = Math.max(-1, Math.min(1, dy / 600));
    });
    heroLogo.style.pointerEvents = 'auto';
    heroLogo.addEventListener('click', function () { alvoA = 30; setTimeout(function () { alvoA = 0; }, 260); });
    (function anima(t) {
      ang += (alvoA - ang) * .08; px += (mx - px) * .05; py += (my - py) * .05;
      f.style.transform = 'rotate(' + (ang + Math.sin(t / 700) * 4) + 'deg)';
      lar.style.transform = 'translate(' + px * 6 + 'px,' + py * 6 + 'px) rotate(' + Math.sin(t / 1600) * 2 + 'deg)';
      requestAnimationFrame(anima);
    })(0);
  }
})();
