// ===== Lógica do portfólio =====
let currentLang = 'pt';
let currentSlide = 1;
const totalSlides = 6;
let selPhase = 0;
let selMethod = 0;
let selTab = 0;

const $ = (id) => document.getElementById(id);
const T = () => window.CONTENT[currentLang];
function ACC() {
  return (window.TWEAKS && window.TWEAKS.accent) || '#c5a059';
}

/* ---------- Navegação ---------- */
function toggleMenu() {
  $('sidebar').classList.toggle('open');
  $('overlay').classList.toggle('open');
  const icon = document.querySelector('#hamburger i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
}

const NAV_ORDER = [1, 2, 5, 3, 4, 6];

function showSlide(index) {
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  $('slide' + index).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', +l.dataset.slide === index));
  currentSlide = index;
  const sc = $('slideCount');
  if (sc) { const pos = NAV_ORDER.indexOf(index) + 1; sc.textContent = '0' + pos + ' / 0' + totalSlides; }
  window.scrollTo(0, 0);
  if (index === 1 || index === 2) runCounters($('slide' + index));
  if (window.innerWidth <= 860) {
    $('sidebar').classList.remove('open');
    $('overlay').classList.remove('open');
    const icon = document.querySelector('#hamburger i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  }
}

function stepSlide(dir) {
  const pos = NAV_ORDER.indexOf(currentSlide);
  let next = pos + dir;
  if (next < 0) next = NAV_ORDER.length - 1;
  if (next >= NAV_ORDER.length) next = 0;
  showSlide(NAV_ORDER[next]);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') stepSlide(1);
  if (e.key === 'ArrowLeft') stepSlide(-1);
});

/* ---------- Contadores animados ---------- */
function runCounters(scope) {
  scope.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || '0');
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1200;
    const t0 = performance.now();
    function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ---------- Amostras de entrega ---------- */
function renderSamples() {
  const t = T();
  $('samplesTitle').textContent = t.samplesTitle;
  $('samplesIntro').textContent = t.samplesIntro;
  $('samplesRoot').innerHTML = t.samples.map((s, i) => {
    const hasMock = window.MOCKS && window.MOCKS[i];
    return '<div class="role-card"' + (hasMock ? ' onclick="openMock(' + i + ')" style="cursor:pointer;"' : '') + '>' +
    '<i class="fas ' + s[2] + '" style="color:var(--gold); font-size:1.1rem; margin-bottom:0.5rem; display:block;"></i>' +
    '<b style="font-size:0.78rem;">' + s[0] + '</b><span>' + s[1] + '</span>' +
    (hasMock ? '<span style="display:inline-block; margin-top:0.5rem; font-size:0.6rem; text-transform:uppercase; letter-spacing:1.5px; color:var(--gold); font-weight:700;">' + (currentLang === 'en' ? 'View sample' : 'Ver amostra') + ' →</span>' : '') +
    '</div>';
  }).join('');
}

/* ---------- Modal de mockups ---------- */
function openMock(i) {
  const m = window.MOCKS && window.MOCKS[i];
  if (!m) return;
  $('mockUrl').textContent = m.url;
  $('mockBody').innerHTML = m.html;
  $('mockCaption').textContent = m.cap[currentLang === 'en' ? 1 : 0];
  $('mockModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeMock() {
  $('mockModal').style.display = 'none';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMock(); });

/* ---------- Cases (acordeão) ---------- */
function renderCases() {
  const t = T();
  const root = $('casesRoot');
  root.innerHTML = '';
  const jumps = [];
  t.caseGroups.forEach(group => {
    const h = document.createElement('h3');
    h.className = 'case-group';
    h.textContent = group.label;
    root.appendChild(h);
    jumps.push([group.short || group.label.split(' — ')[0].split(' · ')[0], h]);
      group.cases.forEach(c => {
      if (c.sub) {
        const sh = document.createElement('div');
        sh.style.cssText = 'margin:1.7rem 0 0.3rem; font-size:0.66rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--gold); display:flex; align-items:center; gap:9px;';
        sh.innerHTML = '<span style="width:22px; height:1px; background:var(--gold);"></span>' + c.sub;
        root.appendChild(sh);
      }
      const card = document.createElement('div');
      card.className = 'case-card' + (c.top ? ' open' : '');
      const parts = (c.co || '').split(' · ');
      const company = parts[0] || '';
      const period = parts[1] || '';
      card.innerHTML =
        '<h4 class="case-title"><span>' + (c.top ? '<span style="color:var(--gold); font-size:1rem;">★</span> ' : '') + c.title + '</span>' +
        '<span style="display:flex; align-items:center; gap:0.7rem; flex-shrink:0;">' +
        (period ? '<span style="font-size:0.64rem; letter-spacing:1px; color:var(--slate); font-weight:600; white-space:nowrap;">' + period + '</span>' : '') +
        '<span class="chev">▼</span></span></h4>' +
        '<div class="case-body">' +
        '<span class="case-role" style="display:block; margin:0.2rem 0 0.4rem;">' + c.role + '</span>' +
        '<p class="case-desc">' + c.desc + '</p>' +
        '<div class="case-tags">' + c.tags.map(tag => '<span class="skill-tag">' + tag + '</span>').join('') + '</div>' +
        (company ? '<span style="display:block; margin-top:0.8rem; padding-top:0.6rem; border-top:1px solid var(--gold-soft); font-size:0.6rem; letter-spacing:2px; text-transform:uppercase; color:var(--slate); opacity:0.75;">' + company + '</span>' : '') +
        '</div>';
      card.addEventListener('click', () => card.classList.toggle('open'));
      root.appendChild(card);
    });
  });
  const cj = $('caseJumps');
  if (cj) {
    cj.innerHTML = '';
    jumps.forEach(j => {
      const b = document.createElement('button');
      b.className = 'pb-tab';
      b.textContent = j[0];
      b.addEventListener('click', () => {
        window.scrollTo({ top: j[1].getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' });
      });
      cj.appendChild(b);
    });
  }
}

/* ---------- Linha do tempo ---------- */
function renderTimeline() {
  const t = T();
  $('tlTitle').textContent = t.tlTitle;
  $('timelineRoot').innerHTML = '<div class="tl">' + t.timeline.map(e =>
    '<div class="tl-item"><span class="tl-dot"></span><span class="tl-years">' + e[0] + '</span><b>' + e[1] + '</b><span class="tl-desc">' + e[2] + '</span></div>').join('') + '</div>';
}

/* ---------- Playbook: metodologias (diagrama radial) ---------- */
function renderMethods() {
  const t = T();
  const cx = 280, cy = 205, R = 142;
  const angles = [-90, -18, 54, 126, 198];
  let lines = '', nodes = '';
  t.methods.forEach((m, i) => {
    const a = angles[i] * Math.PI / 180;
    const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    lines += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x + '" y2="' + y + '" stroke="rgba(197,160,89,0.45)" stroke-width="1.5"/>';
    const sel = i === selMethod;
    nodes += '<g class="mnode" data-i="' + i + '" style="cursor:pointer;">' +
      (sel ? '<circle cx="' + x + '" cy="' + y + '" r="60" fill="none" stroke="' + ACC() + '" stroke-width="2" stroke-opacity="0.5"/>' : '') +
      '<circle cx="' + x + '" cy="' + y + '" r="52" fill="' + (sel ? '' + ACC() + '' : '#0a192f') + '" stroke="' + ACC() + '" stroke-width="' + (sel ? 2.5 : 1) + '"/>' +
      '<text x="' + x + '" y="' + (y - 3) + '" text-anchor="middle" fill="' + (sel ? '#0a192f' : '#ffffff') + '" font-size="15.5" font-weight="700" font-family="Montserrat,sans-serif">' + m.name + '</text>' +
      '<text x="' + x + '" y="' + (y + 15) + '" text-anchor="middle" fill="' + (sel ? 'rgba(10,25,47,0.7)' : 'rgba(255,255,255,0.7)') + '" font-size="9" letter-spacing="1" font-family="Montserrat,sans-serif">' + m.area.toUpperCase() + '</text>' +
      '</g>';
  });
  const center = '<circle cx="' + cx + '" cy="' + cy + '" r="56" fill="#f8f5f0" stroke="' + ACC() + '" stroke-width="2"/>' +
    '<text x="' + cx + '" y="' + (cy + 5) + '" text-anchor="middle" fill="#0a192f" font-size="17" font-weight="600" font-style="italic" font-family="Cormorant Garamond,serif">' + t.centerLabel + '</text>';
  $('methodsRoot').innerHTML = '<svg viewBox="0 0 560 410" style="width:100%; max-width:560px; display:block; margin:0 auto;">' + lines + center + nodes + '</svg>';
  $('methodsRoot').querySelectorAll('.mnode').forEach(g => g.addEventListener('click', () => { selMethod = parseInt(g.dataset.i); renderMethods(); }));
  const det = $('methodDetail');
  det.innerHTML = t.methods[selMethod].desc;
  det.style.borderRightColor = '' + ACC() + '';
}

/* ---------- Playbook: fases ---------- */
function renderFlow() {
  const t = T();
  const root = $('flowRoot');
  root.innerHTML = '';
  t.phases.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'pb-step' + (i === selPhase ? ' sel' : '');
    el.innerHTML = '<div class="pb-dot">' + p.num + '</div>' +
      '<p class="ph">' + p.name + '</p><p class="sub">' + p.sub + '</p>';
    el.addEventListener('click', () => { selPhase = i; renderFlow(); });
    root.appendChild(el);
  });
  renderPhasePanel();
}

function renderPhasePanel() {
  const t = T();
  const p = t.phases[selPhase];
  $('phasePanel').innerHTML =
    '<h4><span style="color:var(--gold);">' + p.num + ' ·</span> ' + p.name + ' <span style="font-size:0.9rem; color:var(--slate); font-style:italic;">— ' + p.sub + '</span></h4>' +
    '<p class="goal">' + p.goal + '</p>' +
    '<div class="pb-cols">' +
      '<div><h5>' + t.phaseCols[0] + '</h5><p>' + p.actions + '</p></div>' +
      '<div><h5>' + t.phaseCols[1] + '</h5><ul>' + p.methods.map(m => '<li>' + m + '</li>').join('') + '</ul></div>' +
      '<div><h5>' + t.phaseCols[2] + '</h5><ul>' + p.artifacts.map(a => '<li>' + a + '</li>').join('') + '</ul></div>' +
    '</div>';
}

/* ---------- Playbook: abas de governança ---------- */
function renderTabs() {
  const t = T();
  const root = $('tabsRoot');
  root.innerHTML = '';
  root.style.display = 'flex';
  root.style.flexWrap = 'wrap';
  root.style.gap = '0.75rem 2rem';
  t.tabGroups.forEach(g => {
    const wrap = document.createElement('div');
    const lbl = document.createElement('p');
    lbl.textContent = g.label;
    lbl.style.cssText = 'font-size:0.56rem; text-transform:uppercase; letter-spacing:2px; color:var(--slate); font-weight:700; margin:0 0 0.4rem; opacity:0.75;';
    wrap.appendChild(lbl);
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; flex-wrap:wrap; gap:0.5rem;';
    g.tabs.forEach(i => {
      const b = document.createElement('button');
      b.className = 'pb-tab' + (i === selTab ? ' sel' : '');
      b.textContent = t.tabs[i];
      b.addEventListener('click', () => { selTab = i; renderTabs(); });
      row.appendChild(b);
    });
    wrap.appendChild(row);
    root.appendChild(wrap);
  });
  renderTabPanel();
}

function renderTabPanel() {
  const t = T();
  const panel = $('tabPanel');
  let html = '';
  if (selTab === 0) {
    html = '<div class="role-grid">' + t.roles.map(r =>
      '<div class="role-card"><b>' + r[0] + '</b><span>' + r[1] + '</span></div>').join('') + '</div>';
  } else if (selTab === 1) {
    html = '<p style="font-size:0.8rem; color:var(--slate); max-width:44rem; margin:0 0 1rem;">' + t.rasciIntro + '</p>' +
      '<div style="overflow-x:auto;"><table class="rasci"><tr>' + t.rasciHead.map(h => '<th>' + h + '</th>').join('') + '</tr>' +
      t.rasciRows.map(row => '<tr><td>' + row[0] + '</td>' + row.slice(1).map(c => '<td class="' + c + '">' + c + '</td>').join('') + '</tr>').join('') +
      '</table></div>' +
      '<div class="rasci-legend">' + t.rasciLegend.map(l => '<span><b>' + l[0] + '</b> ' + l[1] + '</span>').join('') + '</div>';
  } else if (selTab === 2) {
    const scaleTable = (rows) =>
      '<table class="rasci" style="max-width:100%; margin-top:auto;"><tr>' + t.farolHead.slice(0, 2).map(h => '<th>' + h + '</th>').join('') + '</tr>' +
      rows.map(r => '<tr><td style="text-align:center; font-weight:700; width:64px;">' + r[0] + '</td><td style="text-align:left;">' + r[1] + '</td></tr>').join('') + '</table>';
    html = '<p style="font-size:0.8rem; color:var(--slate); max-width:44rem; margin:0 0 1rem;">' + t.evmIntro + '</p>' +
      '<div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; max-width:52rem; align-items:stretch;" class="kpi-grid">' +
      [[t.spi, t.spiRows], [t.cpi, t.cpiRows]].map(pair =>
        '<div class="kpi-card" style="display:flex; flex-direction:column;"><div><span class="f">' + pair[0].f + '</span><span class="eq">= ' + pair[0].eq + '</span>' +
        '<p style="font-weight:700; color:var(--navy); margin-top:0.4rem;">' + pair[0].name + '</p><p style="margin-bottom:0.9rem;">' + pair[0].desc + '</p></div>' +
        scaleTable(pair[1]) + '</div>').join('') +
      '</div>' +
      '<p class="note-navy" style="margin-top:1.1rem;">' + t.evmTools + '</p>' +
      (function() {
        const plan = [0, 8, 16, 26, 38, 52, 66, 80, 91, 100];
        const act = [0, 7, 14, 22, 33, 45, 60];
        const px = (i) => 40 + i * 56, py = (v) => 150 - v * 1.24;
        const path = (arr) => arr.map((v, i) => (i ? 'L' : 'M') + px(i) + ',' + py(v)).join(' ');
        return '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:1.5rem 0 0.4rem;">' + t.curvaTitle + '</h5>' +
          '<p style="font-size:0.75rem; color:var(--slate); max-width:44rem; margin:0 0 0.5rem;">' + t.curvaDesc + '</p>' +
          '<svg viewBox="0 0 600 175" style="width:100%; max-width:600px; display:block; background:white; border:1px solid var(--gold-soft);">' +
          [0, 25, 50, 75, 100].map(v => '<line x1="40" y1="' + py(v) + '" x2="560" y2="' + py(v) + '" stroke="rgba(10,25,47,0.06)" stroke-width="1"/><text x="32" y="' + (py(v) + 3) + '" text-anchor="end" font-size="8" fill="#8895a7" font-family="Montserrat,sans-serif">' + v + '%</text>').join('') +
          '<path d="' + path(plan) + '" fill="none" stroke="#8895a7" stroke-width="2" stroke-dasharray="6 4"/>' +
          '<path d="' + path(act) + '" fill="none" stroke="' + ACC() + '" stroke-width="2.5"/>' +
          '<circle cx="' + px(act.length - 1) + '" cy="' + py(act[act.length - 1]) + '" r="4" fill="' + ACC() + '"/>' +
          '<line x1="' + px(act.length - 1) + '" y1="' + py(act[act.length - 1]) + '" x2="' + px(act.length - 1) + '" y2="' + py(plan[act.length - 1]) + '" stroke="#b91c1c" stroke-width="1.2" stroke-dasharray="3 3"/>' +
          '<text x="' + (px(act.length - 1) + 8) + '" y="' + ((py(act[act.length - 1]) + py(plan[act.length - 1])) / 2 + 3) + '" font-size="8.5" fill="#b91c1c" font-weight="700" font-family="Montserrat,sans-serif">Δ SPI</text>' +
          '</svg>' +
          '<div class="rasci-legend" style="margin-top:0.5rem;"><span><b style="color:#8895a7;">▬ ▬</b> ' + t.curvaLegend[0] + '</span><span><b style="color:' + ACC() + ';">▬▬</b> ' + t.curvaLegend[1] + '</span></div>';
      })() +
      '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:1.5rem 0 0.6rem;">' + t.finalMetricsTitle + '</h5>' +
      '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.8rem; max-width:44rem;" class="grid4">' +
      t.finalMetrics.map(m => '<div class="kpi-card" style="padding:0.9rem 1rem;"><span class="f" style="font-size:1.3rem;">' + m[0] + '</span><p>' + m[1] + '</p></div>').join('') +
      '</div>';
  } else if (selTab === 3) {
    const donut = (pct) => {
      const r = 21, c = 2 * Math.PI * r;
      return '<svg viewBox="0 0 56 56" style="width:56px; height:56px; display:block; margin:0 auto;">' +
        '<circle cx="28" cy="28" r="' + r + '" fill="#ffffff" stroke="rgba(197,160,89,0.25)" stroke-width="5"/>' +
        '<circle cx="28" cy="28" r="' + r + '" fill="none" stroke="' + ACC() + '" stroke-width="5" stroke-linecap="round" ' +
        'stroke-dasharray="' + (c * pct / 100) + ' ' + c + '" transform="rotate(-90 28 28)"/>' +
        '<text x="28" y="32" text-anchor="middle" font-size="12" font-weight="700" fill="#0a192f" font-family="Montserrat,sans-serif">' + pct + '%</text></svg>';
    };
    const scaleViz = '<div style="display:grid; grid-template-columns:repeat(6,1fr); gap:0.5rem; max-width:52rem; position:relative; padding-top:0.5rem;">' +
      t.scale.map(s =>
        '<div style="text-align:center;">' + donut(parseInt(s[0])) +
        '<p style="font-size:0.62rem; color:var(--slate); line-height:1.4; margin:0.5rem 0 0;">' + s[1] + '</p></div>').join('') +
      '</div>';
    html = '<p style="font-size:0.8rem; color:var(--slate); margin:0 0 0.5rem;">' + t.ragIntro + '</p>' +
      '<div class="rag">' + t.rag.map(r =>
        '<div><b><span class="dot" style="background:' + r[0] + ';"></span>' + r[1] + '</b><br>' + r[2] + '</div>').join('') + '</div>' +
      '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:1.75rem 0 0.9rem;">' + t.scaleTitle + '</h5>' +
      scaleViz;
  } else if (selTab === 4) {
    const L = t.vLeft, R = t.vRight, bw = 176, bh = 46;
    const defs = '<defs>' +
      '<filter id="vshadow" x="-20%" y="-20%" width="140%" height="160%">' +
      '<feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0a192f" flood-opacity="0.18"/></filter>' +
      '<linearGradient id="vnavy" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#14304f"/><stop offset="1" stop-color="#0a192f"/></linearGradient>' +
      '<marker id="varr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0,0 L8,4 L0,8 z" fill="' + ACC() + '"/></marker>' +
      '</defs>';
    const boxL = (x, y, label) =>
      '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="8" fill="url(#vnavy)" stroke="' + ACC() + '" stroke-width="1" filter="url(#vshadow)"/>' +
      '<text x="' + (x + bw / 2) + '" y="' + (y + bh / 2 + 4) + '" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="600" font-family="Montserrat,sans-serif">' + label + '</text>';
    const boxR = (x, y, label) =>
      '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="8" fill="#ffffff" stroke="' + ACC() + '" stroke-width="1.5" filter="url(#vshadow)"/>' +
      '<text x="' + (x + bw / 2) + '" y="' + (y + bh / 2 + 4) + '" text-anchor="middle" fill="#0a192f" font-size="12" font-weight="700" font-family="Montserrat,sans-serif">' + label + '</text>';
    const dash = (x1, x2, y) => '<line x1="' + (x1 + 10) + '" y1="' + y + '" x2="' + (x2 - 10) + '" y2="' + y + '" stroke="' + ACC() + '" stroke-width="1.2" stroke-dasharray="6 5" marker-start="url(#varr)" marker-end="url(#varr)" opacity="0.85"/>';
    const oy = 58;
    const vpath = '<polyline points="108,' + (45 + oy) + ' 143,' + (120 + oy) + ' 178,' + (195 + oy) + ' 348,' + (285 + oy) + ' 518,' + (195 + oy) + ' 553,' + (120 + oy) + ' 588,' + (45 + oy) + '" fill="none" stroke="rgba(197,160,89,0.3)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>';
    const smoke =
      '<rect x="512" y="8" width="' + bw + '" height="' + bh + '" rx="8" fill="' + ACC() + '" filter="url(#vshadow)"/>' +
      '<text x="' + (512 + bw / 2) + '" y="' + (8 + bh / 2 + 4) + '" text-anchor="middle" fill="#0a192f" font-size="12.5" font-weight="700" font-family="Montserrat,sans-serif">' + t.vSmoke[0] + '</text>' +
      '<line x1="' + (500 + bw / 2 + 12) + '" y1="' + (22 + oy - 2) + '" x2="' + (512 + bw / 2) + '" y2="' + (8 + bh + 4) + '" stroke="' + ACC() + '" stroke-width="1.4" marker-end="url(#varr)"/>';
    const vsvg = '<svg viewBox="0 0 700 400" style="width:100%; max-width:700px; display:block; margin:0.75rem 0 1rem;">' + defs + vpath +
      boxL(20, 22 + oy, L[0]) + boxL(55, 97 + oy, L[1]) + boxL(90, 172 + oy, L[2]) +
      boxR(500, 22 + oy, R[0]) + boxR(465, 97 + oy, R[1]) + boxR(430, 172 + oy, R[2]) +
      smoke +
      '<rect x="260" y="' + (262 + oy) + '" width="' + bw + '" height="' + bh + '" rx="8" fill="' + ACC() + '" filter="url(#vshadow)"/>' +
      '<text x="348" y="' + (289 + oy) + '" text-anchor="middle" fill="#0a192f" font-size="12.5" font-weight="700" font-family="Montserrat,sans-serif">' + t.vBottom + '</text>' +
      dash(20 + bw, 500, 45 + oy) + dash(55 + bw, 465, 120 + oy) + dash(90 + bw, 430, 195 + oy) +
      '</svg>';
    const envColors = ['#2a6fdb', '#d9a406', '' + ACC() + '', '#1f8a5b'];
    html = '<p style="font-size:0.8rem; color:var(--slate); max-width:44rem; margin:0 0 0.25rem;">' + t.vmodelIntro + '</p>' +
      '<p style="font-size:0.68rem; color:var(--gold); font-weight:700; letter-spacing:1px; text-transform:uppercase; margin:0.75rem 0 0;">' + t.vTitle + '</p>' +
      vsvg +
      '<div class="vmodel">' + t.vmodel.map((v, i) =>
        '<div style="border-top-color:' + envColors[i] + ';"><span class="env" style="color:' + envColors[i] + ';">' + v[0] + '</span><b>' + v[1] + '</b><p>' + v[2] + '</p></div>').join('') + '</div>' +
      '<p class="note-navy" style="margin-top:1.1rem;">' + t.vmodelNote + '</p>';
  } else if (selTab === 5) {
    const mxColor = (s) => s === 1 ? '#1f8a5b' : s <= 4 ? '#a3b530' : s <= 9 ? '#d9a406' : s <= 15 ? '#d97706' : '#b91c1c';
    let cells = '';
    for (let p = 5; p >= 1; p--) {
      for (let i = 1; i <= 5; i++) {
        const s = p * i;
        cells += '<div style="display:flex; align-items:center; justify-content:center; background:' + mxColor(s) + '; color:#ffffff; font-weight:700; font-size:0.75rem; text-shadow:0 1px 2px rgba(0,0,0,0.25);">' + s + '</div>';
      }
    }
    const matrix = '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:1.5rem 0 0.6rem;">' + t.mxTitle + '</h5>' +
      '<div style="display:flex; gap:0.6rem; align-items:center;">' +
      '<span style="writing-mode:vertical-rl; transform:rotate(180deg); font-size:0.58rem; letter-spacing:2px; text-transform:uppercase; color:var(--slate); font-weight:700;">' + t.mxProb + ' →</span>' +
      '<div><div style="display:grid; grid-template-columns:repeat(5, 46px); grid-auto-rows:36px; gap:3px;">' + cells + '</div>' +
      '<p style="font-size:0.58rem; letter-spacing:2px; text-transform:uppercase; color:var(--slate); font-weight:700; margin:0.5rem 0 0; text-align:center;">' + t.mxImp + ' →</p></div>' +
      '</div>' +
      '<div class="rasci-legend" style="margin-top:0.8rem;">' + t.mxLegend.map(l => '<span><b style="color:' + l[0] + ';">■</b> ' + l[1] + '</span>').join('') + '</div>';
    html = '<div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; max-width:44rem;" class="kpi-grid">' +
      t.riskDefs.map(d => '<div class="kpi-card"><span class="f" style="font-size:1.4rem;">' + d[0] + '</span><p>' + d[1] + '</p></div>').join('') + '</div>' +
      matrix +
      '<p class="note-navy" style="margin-top:1.25rem;">' + t.riskNote + '</p>' +
      '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:1.5rem 0 0.75rem;">' + t.riskProcTitle + '</h5>' +
      '<div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap; margin-bottom:1.5rem;">' +
      t.riskProc.map((s, i) =>
        '<div style="background:var(--navy); color:#fff; border-top:3px solid var(--gold); padding:0.55rem 1.3rem; font-size:0.7rem; font-weight:600; letter-spacing:1px;"><span style="color:var(--gold); font-family:Cormorant Garamond,serif; font-size:1rem; margin-right:0.5rem;">' + (i + 1) + '</span>' + s + '</div>' +
        (i < t.riskProc.length - 1 ? '<span style="color:var(--gold); font-weight:700;">→</span>' : '')).join('') +
      '<span style="color:var(--gold); font-weight:700;">↺</span>' +
      '</div>' +
      '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:0 0 0.75rem;">' + t.crTitle + '</h5>' +
      '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.9rem; max-width:56rem; margin-bottom:1.2rem;" class="grid4">' +
      t.crBlocks.map((b, i) =>
        '<div class="kpi-card" style="position:relative;">' +
        '<span style="font-family:Cormorant Garamond,serif; font-size:1.6rem; font-weight:600; color:var(--gold); line-height:1;">0' + (i + 1) + '</span>' +
        '<b style="display:block; font-size:0.82rem; color:var(--navy); margin:0.3rem 0 0.5rem;">' + b[0] + '</b>' +
        '<ul class="check-list" style="margin:0;">' + b[1].map(x => '<li style="font-size:0.72rem;">' + x + '</li>').join('') + '</ul></div>').join('') +
      '</div>' +
      '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:0.5rem 0 0.6rem;">' + t.w5Title + '</h5>' +
      '<div style="display:flex; flex-wrap:wrap; gap:0.5rem;">' + t.w5.map(w =>
        '<span style="background:white; border:1px solid var(--gold-soft); padding:0.45rem 0.8rem; font-size:0.68rem;"><b style="color:var(--gold);">' + w[0] + '</b> — ' + w[1] + '</span>').join('') + '</div>';
  } else if (selTab === 6) {
    html = '<p style="font-size:0.8rem; color:var(--slate); max-width:44rem; margin:0 0 0.75rem;">' + t.lessonsIntro + '</p>' +
      '<p class="note-navy">' + t.lessonsTemplate + '</p>' +
      '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:1.5rem 0 0.75rem;">' + t.lessonsProcTitle + '</h5>' +
      '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.9rem; max-width:56rem; margin-bottom:1.25rem;" class="grid4">' +
      t.lessonsProc.map(p =>
        '<div class="kpi-card"><span class="f" style="font-size:1.5rem;">' + p[0] + '</span>' +
        '<b style="display:block; font-size:0.8rem; color:var(--navy); margin:0.25rem 0 0.4rem;">' + p[1] + '</b>' +
        '<p style="margin:0;">' + p[2] + '</p></div>').join('') + '</div>' +
      '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:0 0 0.25rem;">' + t.checklistTitle + '</h5>' +
      '<ul class="check-list">' + t.checklist.map(c => '<li>' + c + '</li>').join('') + '</ul>';
  } else if (selTab === 7) {
    const quadColors = ['#d9a406', '#b3541e', '#8895a7', '#2a6fdb'];
    const quadrant = '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:1.5rem 0 0.6rem;">' + t.quadTitle + '</h5>' +
      '<div style="display:flex; gap:0.6rem; align-items:center;">' +
      '<span style="writing-mode:vertical-rl; transform:rotate(180deg); font-size:0.58rem; letter-spacing:2px; text-transform:uppercase; color:var(--slate); font-weight:700;">' + t.quadAxes[0] + ' →</span>' +
      '<div><div style="display:grid; grid-template-columns:180px 180px; grid-auto-rows:84px; gap:3px;">' +
      t.quad.map((q, i) => '<div style="background:' + quadColors[i] + '18; border:1px solid ' + quadColors[i] + '55; padding:0.7rem 0.8rem;">' +
        '<b style="font-size:0.72rem; color:' + quadColors[i] + ';">' + q[0] + '</b>' +
        '<p style="font-size:0.6rem; color:var(--slate); margin:0.3rem 0 0;">' + q[1] + '</p></div>').join('') +
      '</div><p style="font-size:0.58rem; letter-spacing:2px; text-transform:uppercase; color:var(--slate); font-weight:700; margin:0.5rem 0 0; text-align:center;">' + t.quadAxes[1] + ' →</p></div></div>';
    html = '<p style="font-size:0.8rem; color:var(--slate); max-width:44rem; margin:0 0 1rem;">' + t.commIntro + '</p>' +
      '<div style="overflow-x:auto;"><table class="rasci" style="max-width:52rem;"><tr>' + t.commHead.map(h => '<th>' + h + '</th>').join('') + '</tr>' +
      t.commRows.map(r => '<tr>' + r.map((c, i) => '<td style="text-align:left;' + (i === 0 ? ' font-weight:600;' : '') + '">' + c + '</td>').join('') + '</tr>').join('') + '</table></div>' +
      '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:1.75rem 0 0.35rem;">' + t.srTitle + '</h5>' +
      '<p style="font-size:0.75rem; color:var(--slate); max-width:44rem; margin:0 0 0.9rem;">' + t.srIntro + '</p>' +
      '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.7rem; max-width:56rem;" class="grid4">' +
      t.srSections.map(s =>
        '<div class="kpi-card" style="padding:0.85rem 1rem;"><span style="font-family:Cormorant Garamond,serif; font-size:1.4rem; font-weight:600; color:var(--gold); line-height:1;">' + s[0] + '</span>' +
        '<b style="display:block; font-size:0.76rem; color:var(--navy); margin:0.25rem 0 0.3rem;">' + s[1] + '</b>' +
        '<p style="margin:0;">' + s[2] + '</p></div>').join('') + '</div>' +
      quadrant;
  } else if (selTab === 8) {
    html = '<p style="font-size:0.8rem; color:var(--slate); max-width:44rem; margin:0 0 1.25rem;">' + t.escIntro + '</p>' +
      '<div style="display:flex; flex-direction:column-reverse; gap:0.6rem; max-width:44rem;">' +
      t.escLevels.map((l, i) =>
        '<div class="role-card" style="display:flex; gap:1rem; align-items:center; border-left:4px solid ' + ['#1f8a5b', '#d9a406', '#b91c1c'][i] + '; margin-left:' + (2 - i) * 1.5 + 'rem;">' +
        '<span style="font-family:Cormorant Garamond,serif; font-size:1.8rem; font-weight:600; color:var(--gold); line-height:1;">' + (i + 1) + '</span>' +
        '<div><b style="margin-bottom:0.15rem;">' + l[0] + '</b><span>' + l[1] + '</span></div></div>').join('') +
      '</div>' +
      '<p class="note-navy" style="margin-top:1.25rem;">' + t.escRule + '</p>';
  } else if (selTab === 9) {
    html = '<p style="font-size:0.8rem; color:var(--slate); max-width:44rem; margin:0 0 0.5rem;">' + t.gngIntro + '</p>' +
      '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:1.25rem 0 0.25rem;">' + t.gngTitle + '</h5>' +
      '<ul class="check-list">' + t.gngList.map(c => '<li>' + c + '</li>').join('') + '</ul>' +
      '<p class="note-navy" style="margin-top:1.25rem;">' + t.gngNote + '</p>' +
      '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:1.75rem 0 0.35rem;">' + t.glTitle + '</h5>' +
      '<p style="font-size:0.78rem; color:var(--slate); max-width:44rem; margin:0 0 0.9rem;">' + t.glIntro + '</p>' +
      '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.7rem; max-width:52rem;" class="grid4">' +
      t.glStats.map(s => '<div class="kpi-card" style="padding:0.85rem 1rem;"><span class="f" style="font-size:1.5rem;">' + s[0] + '</span><p>' + s[1] + '</p></div>').join('') + '</div>' +
      '<p class="note-navy" style="margin-top:1rem;">' + t.glNote + '</p>' +
      '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:1.5rem 0 0.25rem;">' + t.gngExitTitle + '</h5>' +
      '<ul class="check-list">' + t.gngExit.map(c => '<li>' + c + '</li>').join('') + '</ul>' +
      '<h5 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:var(--gold); margin:1.5rem 0 0.35rem;">' + t.hcPanelTitle + '</h5>' +
      '<p style="font-size:0.78rem; color:var(--slate); max-width:44rem; margin:0 0 0.7rem;">' + t.hcPanelDesc + '</p>' +
      '<div style="display:flex; flex-wrap:wrap; gap:0.5rem;">' +
      t.hcStates.map(s => '<span style="background:white; border:1px solid var(--gold-soft); padding:0.45rem 0.9rem; font-size:0.68rem; font-weight:600;"><span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:' + s[1] + '; margin-right:6px;"></span>' + s[0] + '</span>').join('') +
      '</div>';
  } else if (selTab === 10) {
    html = '<p style="font-size:0.8rem; color:var(--slate); max-width:44rem; margin:0 0 1rem;">' + t.finIntro + '</p>' +
      '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.9rem; max-width:52rem;" class="grid4">' +
      t.finBlocks.map(b => '<div class="kpi-card"><b style="font-size:0.85rem; color:var(--navy);">' + b[0] + '</b><p>' + b[1] + '</p></div>').join('') + '</div>' +
      '<p class="note-navy" style="margin-top:1.25rem;">' + t.finNote + '</p>';
  } else if (selTab === 11) {
    html = '<p style="font-size:0.8rem; color:var(--slate); max-width:44rem; margin:0 0 1rem;">' + t.venIntro + '</p>' +
      '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.9rem; max-width:52rem;" class="grid4">' +
      t.venBlocks.map(b => '<div class="kpi-card"><b style="font-size:0.85rem; color:var(--navy);">' + b[0] + '</b><p>' + b[1] + '</p></div>').join('') + '</div>';
  } else {
    html = '<p style="font-size:0.8rem; color:var(--slate); max-width:44rem; margin:0 0 1.25rem;">' + t.ocmIntro + '</p>' +
      '<div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; max-width:48rem;" class="kpi-grid">' +
      [[t.ocmCols[0], t.ocmPM], [t.ocmCols[1], t.ocmCM]].map(col =>
        '<div class="kpi-card"><b style="font-size:0.8rem; color:var(--gold); text-transform:uppercase; letter-spacing:1.5px;">' + col[0] + '</b>' +
        '<ul class="check-list" style="margin-top:0.75rem;">' + col[1].map(x => '<li>' + x + '</li>').join('') + '</ul></div>').join('') +
      '</div>';
  }
  panel.innerHTML = html;
}

/* ---------- Depoimentos ---------- */
let testIdx = 0;
let testTimer = null;
function showTestimonial(i) {
  const t = T();
  if (!t.testimonials) return;
  testIdx = (i + t.testimonials.length) % t.testimonials.length;
  const q = t.testimonials[testIdx];
  const slot = $('testSlot');
  if (!slot) return;
  slot.style.opacity = '0';
  setTimeout(() => {
    slot.innerHTML =
      '<p style="font-family:\'Cormorant Garamond\',serif; font-style:italic; font-size:1.1rem; line-height:1.5; color:var(--navy); margin:0 0 0.7rem;">“' + q[0] + '”</p>' +
      '<p style="font-size:0.62rem; text-transform:uppercase; letter-spacing:1.5px; color:var(--gold); font-weight:700; margin:0;">' + q[1] + '</p>';
    slot.style.opacity = '1';
  }, 220);
  document.querySelectorAll('#testDots span').forEach((d, di) => {
    d.style.background = di === testIdx ? 'var(--gold)' : 'rgba(197,160,89,0.3)';
    d.style.width = di === testIdx ? '22px' : '8px';
  });
}
function stepTestimonial(dir) {
  showTestimonial(testIdx + dir);
  restartTestTimer();
}
function restartTestTimer() {
  if (testTimer) clearInterval(testTimer);
  testTimer = setInterval(() => showTestimonial(testIdx + 1), 6500);
}
function renderTestimonials() {
  const t = T();
  if (!$('testRoot') || !t.testimonials) return;
  $('testTitle').textContent = t.testTitle;
  $('testNote').textContent = t.testNote;
  $('testRoot').innerHTML =
    '<div style="background:white; border:1px solid var(--gold-soft); border-left:3px solid var(--gold); padding:1.4rem 1.6rem; min-height:9rem; display:flex; flex-direction:column; justify-content:center;">' +
      '<div id="testSlot" style="transition:opacity 0.22s ease;"></div>' +
    '</div>' +
    '<div style="display:flex; align-items:center; justify-content:space-between; margin-top:0.9rem;">' +
      '<div id="testDots" style="display:flex; gap:6px; align-items:center;">' +
        t.testimonials.map(() => '<span style="height:8px; border-radius:4px; background:rgba(197,160,89,0.3); cursor:pointer; transition:all 0.3s;"></span>').join('') +
      '</div>' +
      '<div style="display:flex; gap:6px;">' +
        '<button onclick="stepTestimonial(-1)" aria-label="Anterior" style="width:30px; height:30px; background:transparent; border:1px solid var(--gold-soft); color:var(--gold); cursor:pointer; font-size:0.7rem;">‹</button>' +
        '<button onclick="stepTestimonial(1)" aria-label="Próximo" style="width:30px; height:30px; background:transparent; border:1px solid var(--gold-soft); color:var(--gold); cursor:pointer; font-size:0.7rem;">›</button>' +
      '</div>' +
    '</div>';
  document.querySelectorAll('#testDots span').forEach((d, di) => d.addEventListener('click', () => { showTestimonial(di); restartTestTimer(); }));
  testIdx = 0;
  showTestimonial(0);
  restartTestTimer();
}

/* ---------- Chips do playbook ---------- */
function renderChips() {
  $('s5chips').innerHTML = T().s5chips.map(c => '<span>' + c + '</span>').join('');
}

/* ---------- Idioma ---------- */
function toggleLang() {
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  applyLang();
}

function applyLang() {
  const t = T();
  document.querySelectorAll('.nav-link').forEach((el, i) => { el.textContent = t.navLinks[i]; });
  $('portfolioLabel').textContent = t.portfolioLabel;
  $('specialistLabel').textContent = t.specialistLabel;
  $('langBtn').textContent = t.langBtn;

  $('s1p').innerHTML = t.s1p + ' <br><span style="color:var(--gold); font-weight:700;">' + t.s1span + '</span>';
  $('s1kick').textContent = t.s1kick;
  $('s1cta1').innerHTML = '<i class="fas fa-folder-open"></i> ' + t.s1cta1;
  $('s1cta2').innerHTML = '<i class="fas fa-compass"></i> ' + t.s1cta2;
  ['st1', 'st2', 'st3'].forEach((id, i) => { $(id).textContent = t.stats[i]; });

  $('s2h2').innerHTML = t.s2h2;
  $('s2p').textContent = t.s2p;
  ['s2p1','s2p2','s2p3','s2p4'].forEach((id,i) => { if($(id)) $(id).textContent = t.s2stats[i]; });
  if($('s2sectors')) $('s2sectors').textContent = t.s2sectors;
  if($('s2sectorsRow')) $('s2sectorsRow').innerHTML = t.s2sectorsList.map(s => '<span>'+s+'</span>').join('');
  if($('s2comp')) $('s2comp').textContent = t.s2comp;
  if($('s2compRow')) $('s2compRow').innerHTML = t.s2compList.map(s => '<span>'+s+'</span>').join('');
  $('s2diff').textContent = t.s2diff;
  document.querySelectorAll('.s2li').forEach((el, i) => { el.childNodes[1].textContent = ' ' + t.s2li[i]; });

  $('s3h2').innerHTML = t.s3h2;
  $('s3sub').innerHTML = t.s3sub + '<span style="color:var(--gold); font-weight:600;" id="s3hint">' + t.s3hint + '</span>';

  $('s4h2').innerHTML = t.s4h2;
  $('s4tools').textContent = t.s4tools;
  document.querySelectorAll('.s4cert').forEach((el, i) => { el.textContent = t.s4certs[i]; });

  $('s5h2').innerHTML = t.s5h2;
  $('s5quote').textContent = t.s5quote;
  $('s5m').innerHTML = t.s5m + '<span style="opacity:0.6; letter-spacing:1px;">' + t.s5mhint + '</span>';
  $('s5c').innerHTML = t.s5c + '<span style="opacity:0.6; letter-spacing:1px;">' + t.s5chint + '</span>';
  $('s5g').textContent = t.s5g;

  $('s6h2').innerHTML = t.s6h2;
  const btn = $('s6btn');
  btn.href = t.cvFile;
  btn.innerHTML = '<i class="fas fa-download"></i> ' + t.s6btn;

  renderCases();
  renderSamples();
  renderTestimonials();
  renderChips();
  if($('s2sectorsRow') && T().s2sectorsList) { $('s2sectorsRow').innerHTML = T().s2sectorsList.map(s => '<span>'+s+'</span>').join(''); }
  if($('s2compRow') && T().s2compList) { $('s2compRow').innerHTML = T().s2compList.map(s => '<span>'+s+'</span>').join(''); }
  renderMethods();
  renderFlow();
  renderTabs();
}

/* ---------- Tweaks (Personalizar) ---------- */
const TW_DEFAULTS = { accent: '#c5a059', navy: '#0a192f', photo: true, anim: true, en: false };
const TW_ACCENTS = [['#c5a059', 'Dourado'], ['#b3541e', 'Cobre'], ['#2a6fdb', 'Azul'], ['#1f8a5b', 'Verde']];
const TW_NAVIES = [['#0a192f', 'Marinho'], ['#16181d', 'Grafite'], ['#0b2e2e', 'Petróleo']];
window.TWEAKS = Object.assign({}, TW_DEFAULTS);
try { Object.assign(window.TWEAKS, JSON.parse(localStorage.getItem('dn_tweaks') || '{}')); } catch (e) {}

function toggleTweaks() {
  const p = $('twPanel');
  p.style.display = p.style.display === 'none' ? 'block' : 'none';
}

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
  return 'rgb(' + Math.min(r,255) + ',' + Math.min(g,255) + ',' + Math.min(b,255) + ')';
}

function applyTweaks(rerender) {
  const tw = window.TWEAKS;
  const root = document.documentElement.style;
  root.setProperty('--gold', tw.accent);
  const n = parseInt(tw.accent.slice(1), 16);
  root.setProperty('--gold-soft', 'rgba(' + ((n>>16)&255) + ',' + ((n>>8)&255) + ',' + (n&255) + ',0.35)');
  root.setProperty('--navy', tw.navy);
  root.setProperty('--navy2', shade(tw.navy, 1.55));
  document.body.classList.toggle('no-anim', !tw.anim);
  document.body.classList.toggle('no-photo', !tw.photo);
  localStorage.setItem('dn_tweaks', JSON.stringify(tw));
  renderTwControls();
  if (rerender) applyLang();
}

function renderTwControls() {
  const tw = window.TWEAKS;
  $('twAccent').innerHTML = TW_ACCENTS.map(a =>
    '<span class="tw-sw' + (tw.accent === a[0] ? ' sel' : '') + '" title="' + a[1] + '" style="background:' + a[0] + ';" onclick="setTweak(\'accent\', \'' + a[0] + '\')"></span>').join('');
  $('twNavy').innerHTML = TW_NAVIES.map(a =>
    '<span class="tw-sw' + (tw.navy === a[0] ? ' sel' : '') + '" title="' + a[1] + '" style="background:' + a[0] + '; border:2px solid ' + (tw.navy === a[0] ? '#ffffff' : 'rgba(255,255,255,0.25)') + ';" onclick="setTweak(\'navy\', \'' + a[0] + '\')"></span>').join('');
  $('twPhoto').checked = tw.photo;
  $('twAnim').checked = tw.anim;
  $('twEn').checked = tw.en;
}

function setTweak(key, val) {
  window.TWEAKS[key] = val;
  applyTweaks(key === 'accent');
}

function resetTweaks() {
  window.TWEAKS = Object.assign({}, TW_DEFAULTS);
  applyTweaks(true);
}

$('twPhoto').addEventListener('change', e => setTweak('photo', e.target.checked));
$('twAnim').addEventListener('change', e => setTweak('anim', e.target.checked));
$('twEn').addEventListener('change', e => {
  window.TWEAKS.en = e.target.checked;
  localStorage.setItem('dn_tweaks', JSON.stringify(window.TWEAKS));
  if ((currentLang === 'en') !== e.target.checked) toggleLang();
});

/* ---------- Init ---------- */
renderCases();
renderSamples();
renderTestimonials();
renderChips();
renderMethods();
renderFlow();
renderTabs();
runCounters($('slide1'));
if (window.TWEAKS.en) currentLang = 'en';
applyTweaks(false);
if (currentLang === 'en') applyLang();
