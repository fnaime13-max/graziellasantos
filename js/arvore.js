/* Pé de laranja fofo atrás da Graziella.
   A copa balança, o mouse faz vento, passar o mouse numa laranja derruba ela (que quica e depois brota de novo),
   e o clique sacode a árvore. Cresce de 0 a 100% quando o loader termina. */
(function () {
  var cv = document.getElementById('arvore');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 0, H = 0, dpr = 1, copa = [], laranjas = [], flores = [], galhos = [];
  var vento = 0, ventoAlvo = 0, mouse = { x: -999, y: -999, vx: 0 }, cresce = reduz ? 1 : 0, rodando = true;

  // números "aleatórios" fixos, para a árvore sair igual sempre
  var semente = 7;
  function rnd() { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; }

  var C = {
    sombra: '#7FA562', copa: '#9DC27C', luz: '#B9D69A', brilho: 'rgba(255,255,255,.28)',
    tronco: '#9A6B47', troncoEsc: '#7E5536', laranja: '#F5AE62', laranjaEsc: '#E8954A', folha: '#7FAE5C',
    bochecha: 'rgba(240,120,110,.55)', olho: '#4A3A2A', flor: '#FFFDF6', miolo: '#F5C46E'
  };

  function monta() {
    var r = cv.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    semente = 7; copa = []; laranjas = []; flores = []; galhos = [];
    var cx = W / 2, cy = H * .31, rx = W * .38, ry = H * .25;
    // bolinhas que formam a copa
    for (var i = 0; i < 44; i++) {
      var a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * .78;
      copa.push({ x: cx + Math.cos(a) * rx * d, y: cy + Math.sin(a) * ry * d, r: Math.min(W, H) * (.09 + rnd() * .06), f: rnd() * 6 });
    }
    for (i = 0; i < 22; i++) { // contorno mais cheio
      var b = i / 22 * Math.PI * 2;
      copa.push({ x: cx + Math.cos(b) * rx * .86, y: cy + Math.sin(b) * ry * .86, r: Math.min(W, H) * (.075 + rnd() * .04), f: rnd() * 6 });
    }
    // galhos que aparecem dos lados
    galhos = [[-.62, .18], [.6, .14], [-.35, -.2], [.32, -.24]];
    // laranjas: só onde não ficam escondidas atrás dela
    var tent = 0;
    while (laranjas.length < 16 && tent++ < 600) {
      var a2 = rnd() * Math.PI * 2, d2 = .35 + Math.sqrt(rnd()) * .62;
      var x = cx + Math.cos(a2) * rx * d2, y = cy + Math.sin(a2) * ry * d2;
      if (Math.abs(x - cx) < W * .17 && y > H * .2) continue;      // cabeça e corpo
      if (laranjas.some(function (o) { return Math.hypot(o.x0 - x, o.y0 - y) < W * .07; })) continue;
      var rr = Math.min(W, H) * (.03 + rnd() * .01);
      laranjas.push({ x0: x, y0: y, x: x, y: y, r: rr, ang: 0, va: 0, fase: rnd() * 6, cara: laranjas.length % 4 === 0, estado: 'pendurada', vx: 0, vy: 0, t: 0, s: 1, giro: 0 });
    }
    // florzinhas de laranjeira
    tent = 0;
    while (flores.length < 12 && tent++ < 400) {
      var a3 = rnd() * Math.PI * 2, d3 = .3 + rnd() * .65;
      var fx = cx + Math.cos(a3) * rx * d3, fy = cy + Math.sin(a3) * ry * d3;
      if (Math.abs(fx - cx) < W * .16 && fy > H * .2) continue;
      flores.push({ x: fx, y: fy, r: Math.min(W, H) * .011, f: rnd() * 6 });
    }
  }

  function laranja(o, ox, oy) {
    var x = o.x + ox, y = o.y + oy, r = o.r * o.s;
    if (r < .5) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.ang + o.giro);
    if (o.estado === 'pendurada') { // cabinho
      ctx.strokeStyle = C.troncoEsc; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, -r - r * .45); ctx.stroke();
    }
    ctx.fillStyle = C.laranja; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.laranjaEsc; ctx.beginPath(); ctx.arc(0, r * .12, r * .92, .15 * Math.PI, .85 * Math.PI); ctx.fill();
    ctx.fillStyle = C.laranja; ctx.beginPath(); ctx.arc(0, -r * .02, r * .9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(-r * .38, -r * .4, r * .22, r * .14, -.6, 0, Math.PI * 2); ctx.fill();
    // folhinha
    ctx.fillStyle = C.folha; ctx.beginPath(); ctx.ellipse(r * .32, -r * 1.02, r * .42, r * .18, -.5, 0, Math.PI * 2); ctx.fill();
    if (o.cara) { // carinha fofa
      ctx.fillStyle = C.olho;
      ctx.beginPath(); ctx.arc(-r * .3, r * .02, r * .09, 0, Math.PI * 2); ctx.arc(r * .3, r * .02, r * .09, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = C.olho; ctx.lineWidth = Math.max(1, r * .07); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, r * .16, r * .14, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
      ctx.fillStyle = C.bochecha;
      ctx.beginPath(); ctx.ellipse(-r * .52, r * .26, r * .14, r * .08, 0, 0, Math.PI * 2); ctx.ellipse(r * .52, r * .26, r * .14, r * .08, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function desenha(t) {
    ctx.clearRect(0, 0, W, H);
    var g = cresce < 1 ? 1 - Math.pow(1 - cresce, 3) : 1;
    var balanco = reduz ? 0 : Math.sin(t / 1400) * 3 + vento;
    var cx = W / 2, base = H;

    // sombra no chão
    ctx.fillStyle = 'rgba(126,165,98,.18)';
    ctx.beginPath(); ctx.ellipse(cx, H * .985, W * .36 * g, H * .03, 0, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.translate(cx, base); ctx.scale(g, g); ctx.translate(-cx, -base);

    // tronco e galhos
    ctx.strokeStyle = C.tronco; ctx.lineCap = 'round';
    ctx.lineWidth = W * .07;
    ctx.beginPath(); ctx.moveTo(cx, base); ctx.quadraticCurveTo(cx - W * .02, H * .6, cx + balanco * .5, H * .36); ctx.stroke();
    ctx.lineWidth = W * .025;
    galhos.forEach(function (gl) {
      ctx.beginPath(); ctx.moveTo(cx + balanco * .3, H * .5);
      ctx.quadraticCurveTo(cx + gl[0] * W * .25, H * (.42 + gl[1] * .2), cx + gl[0] * W * .5 + balanco, H * (.33 + gl[1] * .3)); ctx.stroke();
    });

    // copa em 3 camadas
    var camadas = [[C.sombra, 0, H * .018, 1], [C.copa, 0, 0, .94], [C.luz, -W * .012, -H * .014, .6]];
    camadas.forEach(function (cm) {
      ctx.fillStyle = cm[0]; ctx.beginPath();
      copa.forEach(function (b) {
        var bx = b.x + cm[1] + balanco * (1 - (b.y - H * .06) / H) + Math.sin(t / 1100 + b.f) * (reduz ? 0 : 1.2);
        var by = b.y + cm[2];
        ctx.moveTo(bx + b.r * cm[3], by); ctx.arc(bx, by, b.r * cm[3], 0, Math.PI * 2);
      });
      ctx.fill();
    });
    // brilhinhos
    ctx.fillStyle = C.brilho;
    copa.forEach(function (b, i) { if (i % 5) return; ctx.beginPath(); ctx.arc(b.x - b.r * .3 + balanco, b.y - b.r * .35, b.r * .16, 0, Math.PI * 2); ctx.fill(); });

    // flores
    flores.forEach(function (f) {
      var fx = f.x + balanco, fy = f.y;
      ctx.fillStyle = C.flor;
      for (var p = 0; p < 5; p++) { var a = p / 5 * Math.PI * 2 + f.f; ctx.beginPath(); ctx.arc(fx + Math.cos(a) * f.r, fy + Math.sin(a) * f.r, f.r * .75, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = C.miolo; ctx.beginPath(); ctx.arc(fx, fy, f.r * .55, 0, Math.PI * 2); ctx.fill();
    });

    // laranjas penduradas
    laranjas.forEach(function (o) { if (o.estado !== 'caindo' && o.estado !== 'chao') laranja(o, balanco, 0); });
    ctx.restore();
    // laranjas no chão ou caindo (fora da escala do crescimento)
    laranjas.forEach(function (o) { if (o.estado === 'caindo' || o.estado === 'chao') { ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; laranja(o, 0, 0); ctx.globalAlpha = 1; } });
  }

  function cai(o, forca) {
    if (o.estado !== 'pendurada') return;
    o.estado = 'caindo'; o.x = o.x0 + vento; o.vx = (forca || 0) + (rnd() - .5) * 1.5; o.vy = -1.5; o.alpha = 1; o.t = 0;
  }

  function passo(t) {
    vento += (ventoAlvo - vento) * .04; ventoAlvo *= .96; mouse.vx *= .9;
    if (cresce < 1 && document.body.classList.contains('pronto')) cresce = Math.min(1, cresce + .012);
    var chao = H * .985;
    laranjas.forEach(function (o) {
      if (o.estado === 'pendurada') {
        // balança como pêndulo e reage ao mouse
        o.va += -o.ang * .02 - o.va * .04; o.ang += o.va;
        o.ang += Math.sin(t / 900 + o.fase) * .0015;
        var d = Math.hypot(mouse.x - (o.x0 + vento), mouse.y - o.y0);
        if (d < o.r * 1.5 && cresce >= 1) cai(o, mouse.vx * .4);
        else if (d < o.r * 4) o.va += mouse.vx * .002;
      } else if (o.estado === 'caindo') {
        o.vy += .45; o.x += o.vx; o.y += o.vy; o.giro += o.vx * .05;
        if (o.y > chao - o.r) {
          o.y = chao - o.r; o.vy *= -.42; o.vx *= .8;
          if (Math.abs(o.vy) < 1.2) { o.estado = 'chao'; o.vy = 0; o.t = t; }
        }
      } else if (o.estado === 'chao') {
        o.x += o.vx; o.vx *= .96; o.giro += o.vx * .05;
        var dt = t - o.t;
        if (dt > 2200) o.alpha = Math.max(0, 1 - (dt - 2200) / 600);
        if (dt > 2800) { o.estado = 'brotando'; o.x = o.x0; o.y = o.y0; o.s = 0; o.giro = 0; o.alpha = 1; o.t = t; }
      } else if (o.estado === 'brotando') {
        o.s = Math.min(1, o.s + .03);
        if (o.s >= 1) o.estado = 'pendurada';
      }
    });
    desenha(t);
    if (rodando && !reduz) requestAnimationFrame(passo);
  }

  addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect();
    var x = e.clientX - r.left, y = e.clientY - r.top;
    if (mouse.x > -999) mouse.vx = x - mouse.x;
    mouse.x = x; mouse.y = y;
    if (x > 0 && x < W && y > 0 && y < H) ventoAlvo += mouse.vx * .05;
    ventoAlvo = Math.max(-14, Math.min(14, ventoAlvo));
  }, { passive: true });
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect(), x = e.clientX - r.left;
    ventoAlvo = x < W / 2 ? 14 : -14;
    laranjas.forEach(function (o) { o.va += (rnd() - .5) * .3; });
    var soltas = laranjas.filter(function (o) { return o.estado === 'pendurada'; });
    for (var k = 0; k < 2 && soltas.length; k++) cai(soltas.splice(Math.floor(rnd() * soltas.length), 1)[0], (rnd() - .5) * 4);
  });

  monta();
  var redim; addEventListener('resize', function () { clearTimeout(redim); redim = setTimeout(monta, 150); });
  if (reduz) { desenha(0); return; }
  new IntersectionObserver(function (e) {
    var antes = rodando; rodando = e[0].isIntersecting;
    if (rodando && !antes) requestAnimationFrame(passo);
  }).observe(cv);
  requestAnimationFrame(passo);
})();
