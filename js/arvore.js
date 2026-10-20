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
    semente = 11; copa = []; laranjas = []; flores = []; galhos = [];
    // pezinho fino à esquerda da foto; a copa espia por trás do canto do quadro
    var cx = W * .2, cy = H * .17, rx = W * .15, ry = H * .12, u = Math.min(W, H);
    for (var i = 0; i < 11; i++) {
      var a = i / 11 * Math.PI * 2 + rnd() * .4, d = i === 0 ? 0 : .55 + rnd() * .3;
      copa.push({ x: cx + Math.cos(a) * rx * d, y: cy + Math.sin(a) * ry * d, r: u * (.065 + rnd() * .03), f: rnd() * 6 });
    }
    var pos = [[-.62, -.15], [-.2, -.55], [.35, -.42], [-.55, .4], [.05, .2]];
    pos.forEach(function (p, k) {
      laranjas.push({ x0: cx + p[0] * rx, y0: cy + p[1] * ry, x: 0, y: 0, r: u * .028, ang: 0, va: 0, fase: k, cara: k === 0 || k === 2, estado: 'pendurada', vx: 0, vy: 0, t: 0, s: 1, giro: 0 });
    });
    // galhinho lateral com uma laranja pendurada
    galhos = [{ x0: W * .155, y0: H * .56, x1: W * .05, y1: H * .47 }];
    laranjas.push({ x0: W * .06, y0: H * .51, x: 0, y: 0, r: u * .026, ang: 0, va: 0, fase: 9, cara: false, estado: 'pendurada', vx: 0, vy: 0, t: 0, s: 1, giro: 0 });
    flores = [{ x: cx - rx * .1, y: cy - ry * .2, r: u * .009, f: 1 }, { x: cx + rx * .6, y: cy + ry * .1, r: u * .009, f: 2 }, { x: cx - rx * .8, y: cy + ry * .1, r: u * .008, f: 3 }];
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
    var balanco = reduz ? 0 : Math.sin(t / 1500) * 2.5 + vento;
    var bx = W * .13, base = H * .985, u = Math.min(W, H);

    ctx.fillStyle = 'rgba(126,165,98,.2)';
    ctx.beginPath(); ctx.ellipse(bx, base, W * .09 * g, H * .014, 0, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.translate(bx, base); ctx.scale(g, g); ctx.translate(-bx, -base);

    // tronco fino e levemente curvo
    ctx.strokeStyle = C.tronco; ctx.lineCap = 'round';
    ctx.lineWidth = u * .016;
    ctx.beginPath(); ctx.moveTo(bx, base); ctx.bezierCurveTo(bx + W * .03, H * .7, bx - W * .01, H * .45, W * .2 + balanco * .6, H * .2); ctx.stroke();
    ctx.lineWidth = u * .008;
    galhos.forEach(function (gl) {
      ctx.beginPath(); ctx.moveTo(gl.x0, gl.y0); ctx.quadraticCurveTo(gl.x0 - W * .04, gl.y0 - H * .02, gl.x1 + balanco * .4, gl.y1); ctx.stroke();
      ctx.fillStyle = C.copa;
      ctx.beginPath(); ctx.ellipse(gl.x1 + balanco * .4 - u * .012, gl.y1 - u * .012, u * .03, u * .014, -.6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(gl.x1 + balanco * .4 + u * .03, gl.y1 - u * .02, u * .026, u * .012, .5, 0, Math.PI * 2); ctx.fill();
    });

    // copa redondinha em 2 tons
    [[C.sombra, u * .012, 1], [C.copa, 0, .9]].forEach(function (cm) {
      ctx.fillStyle = cm[0]; ctx.beginPath();
      copa.forEach(function (b) {
        var x = b.x + balanco + Math.sin(t / 1100 + b.f) * (reduz ? 0 : .8), y = b.y + cm[1];
        ctx.moveTo(x + b.r * cm[2], y); ctx.arc(x, y, b.r * cm[2], 0, Math.PI * 2);
      });
      ctx.fill();
    });
    ctx.fillStyle = C.brilho;
    copa.forEach(function (b, i) { if (i % 3) return; ctx.beginPath(); ctx.arc(b.x - b.r * .3 + balanco, b.y - b.r * .35, b.r * .18, 0, Math.PI * 2); ctx.fill(); });

    flores.forEach(function (f) {
      var fx = f.x + balanco, fy = f.y;
      ctx.fillStyle = C.flor;
      for (var p = 0; p < 5; p++) { var a = p / 5 * Math.PI * 2 + f.f; ctx.beginPath(); ctx.arc(fx + Math.cos(a) * f.r, fy + Math.sin(a) * f.r, f.r * .75, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = C.miolo; ctx.beginPath(); ctx.arc(fx, fy, f.r * .55, 0, Math.PI * 2); ctx.fill();
    });

    laranjas.forEach(function (o) { if (o.estado === 'pendurada' || o.estado === 'brotando') { o.x = o.x0; o.y = o.y0; laranja(o, balanco, 0); } });
    ctx.restore();
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
    for (var k = 0; k < 1 && soltas.length; k++) cai(soltas.splice(Math.floor(rnd() * soltas.length), 1)[0], (rnd() - .5) * 4);
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
