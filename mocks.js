// ===== Mockups anonimizados de entregas (recriações em HTML, sem dados de cliente) =====
// Cada entrada: { url, cap: [pt, en], html }
(function () {
  const G = '#b68235', NAVY = '#2d2b2b', SOFT = 'rgba(182,130,53,0.35)';
  const redact = '████';

  // ---- componentes utilitários ----
  const bar = (label, pct, color) =>
    '<div style="margin-bottom:0.6rem;"><div style="display:flex; justify-content:space-between; font-size:0.72rem; color:#334155; margin-bottom:3px;"><span>' + label + '</span><b>' + pct + '%</b></div>' +
    '<div style="height:7px; background:#e5e7eb; border-radius:4px; overflow:hidden;"><div style="width:' + pct + '%; height:100%; background:' + (color || G) + ';"></div></div></div>';

  const tile = (big, small, sub) =>
    '<div style="background:#fff; border:1px solid #e5e7eb; border-top:3px solid ' + G + '; padding:0.9rem 1rem; text-align:center;">' +
    '<div style="font-family:\'Cormorant Garamond\',serif; font-size:1.9rem; font-weight:600; color:' + NAVY + '; line-height:1;">' + big + '</div>' +
    '<div style="font-size:0.6rem; text-transform:uppercase; letter-spacing:1.5px; color:#667085; margin-top:5px; font-weight:700;">' + small + '</div>' +
    (sub ? '<div style="font-size:0.62rem; color:#94a3b8; margin-top:2px;">' + sub + '</div>' : '') + '</div>';

  const appHeader = (site, crumb) =>
    '<div style="background:' + NAVY + '; color:#fff; padding:0.7rem 1.2rem; display:flex; align-items:center; gap:0.8rem;">' +
    '<span style="width:26px; height:26px; background:' + G + '; color:' + NAVY + '; border-radius:5px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.8rem; flex-shrink:0;">P</span>' +
    '<div style="line-height:1.3;"><div style="font-size:0.85rem; font-weight:700;">' + site + '</div>' +
    '<div style="font-size:0.62rem; opacity:0.6; margin-top:2px;">' + crumb + '</div></div>' +
    '<span style="margin-left:auto; font-size:0.62rem; opacity:0.5; flex-shrink:0;">' + redact + ' \u00b7 Cliente Confidencial</span></div>';

  const sectionTitle = (t) =>
    '<h3 style="font-size:0.68rem; text-transform:uppercase; letter-spacing:2px; color:' + G + '; font-weight:700; margin:1.4rem 0 0.7rem;">' + t + '</h3>';

  const wrap = (inner) => '<div style="background:#f3f4f6; padding:1.4rem 1.6rem; font-family:Montserrat,sans-serif;">' + inner + '</div>';

  // ============ 1 · HUB DO PROJETO ============
  const hub = wrap(
    '<div style="display:grid; grid-template-columns:1.3fr 1fr; gap:1rem;">' +
      '<div style="background:linear-gradient(135deg,' + NAVY + ',#16305a); color:#fff; padding:1.4rem 1.6rem; display:flex; flex-direction:column; justify-content:center;">' +
        '<div style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; opacity:0.7;">Contagem regressiva</div>' +
        '<div style="font-family:\'Cormorant Garamond\',serif; font-size:3.4rem; line-height:1; margin:0.3rem 0; color:' + G + ';">42 dias</div>' +
        '<div style="font-size:0.8rem;">para o <b>Go-Live</b> \u00b7 marco corporativo</div>' +
      '</div>' +
      '<div style="display:grid; grid-template-rows:1fr 1fr; gap:1rem;">' +
        tile('189', 'dias de projeto', '7 fases \u00b7 5 marcos') +
        tile('60+', 'membros no portal', 'gest\u00e3o \u00e0 vista') +
      '</div>' +
    '</div>' +
    sectionTitle('Acessos r\u00e1pidos') +
    '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:0.7rem;">' +
      ['Cronograma', 'Status Reports', 'Riscos & Issues', 'Biblioteca', 'Matriz RACI', 'Change Requests', 'Testes / UAT', 'Treinamentos'].map(l =>
        '<div style="background:#fff; border:1px solid #e5e7eb; padding:0.8rem; font-size:0.72rem; color:' + NAVY + '; font-weight:600; text-align:center;">' + l + '</div>').join('') +
    '</div>' +
    sectionTitle('Fases do projeto') +
    '<div style="display:flex; gap:4px;">' +
      [['Prepare', 1], ['Explore', 1], ['Realize', 1], ['Deploy', 0.5], ['Run', 0]].map(f =>
        '<div style="flex:1; text-align:center;"><div style="height:6px; background:' + (f[1] === 1 ? G : f[1] ? 'rgba(182,130,53,0.5)' : '#e5e7eb') + ';"></div>' +
        '<div style="font-size:0.62rem; color:#605d5d; margin-top:5px; font-weight:600;">' + f[0] + '</div></div>').join('') +
    '</div>' +
    sectionTitle('Time do projeto') +
    '<div style="display:flex; gap:0.7rem; flex-wrap:wrap;">' +
      ['GP / PMO', 'Sponsor', 'Key Users', 'Consultoria', 'TI Cliente', 'Fornecedor'].map(r =>
        '<div style="display:flex; align-items:center; gap:7px; background:#fff; border:1px solid #e5e7eb; padding:0.4rem 0.7rem;">' +
        '<span style="width:22px; height:22px; border-radius:50%; background:' + NAVY + '; color:' + G + '; display:flex; align-items:center; justify-content:center; font-size:0.6rem; font-weight:700;">' + redact.slice(0, 2) + '</span>' +
        '<span style="font-size:0.68rem; color:#334155;">' + r + '</span></div>').join('') +
    '</div>'
  );

  // ============ 2 · CENTRO DE APRENDIZAGEM ============
  const modules = [
    ['01', 'Introdu\u00e7\u00e3o \u00e0 ferramenta', 'Vis\u00e3o geral e conceitos'],
    ['02', 'Macroprocessos', 'Fluxo ponta a ponta'],
    ['03', 'Price Management', 'Gest\u00e3o de pre\u00e7os'],
    ['04', 'Deal Management', 'Gest\u00e3o de acordos'],
    ['05', 'Analytics', 'Relat\u00f3rios e dashboards'],
    ['06', 'Simulador guiado', 'Ambiente de pr\u00e1tica'],
  ];
  const learn = wrap(
    '<div style="display:flex; align-items:baseline; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">' +
      '<div style="font-family:\'Cormorant Garamond\',serif; font-size:1.7rem; color:' + NAVY + ';">Centro de Aprendizagem</div>' +
      '<div style="font-size:0.66rem; color:#667085;">Trilhas por perfil \u00b7 conte\u00fado sob demanda</div>' +
    '</div>' +
    sectionTitle('M\u00f3dulos de treinamento') +
    '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.7rem;">' +
      modules.map(m => '<div style="background:#fff; border:1px solid #e5e7eb; padding:0.9rem 1rem;">' +
        '<div style="font-family:\'Cormorant Garamond\',serif; font-size:1.3rem; color:' + G + '; font-weight:600;">' + m[0] + '</div>' +
        '<div style="font-size:0.76rem; font-weight:700; color:' + NAVY + '; margin:0.2rem 0 0.15rem;">' + m[1] + '</div>' +
        '<div style="font-size:0.66rem; color:#667085;">' + m[2] + '</div></div>').join('') +
    '</div>' +
    sectionTitle('Trilhas por perfil de usu\u00e1rio') +
    '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:0.7rem;">' +
      [['End User', 'Opera\u00e7\u00e3o do dia a dia', '2h'], ['Key User', 'Multiplicador & UAT', '6h'], ['Admin', 'Par\u00e2metros & acessos', '4h'], ['Master User', 'Governan\u00e7a da solu\u00e7\u00e3o', '8h']].map(p =>
        '<div style="background:' + NAVY + '; color:#fff; padding:0.9rem 1rem;">' +
        '<div style="font-size:0.8rem; font-weight:700; color:' + G + ';">' + p[0] + '</div>' +
        '<div style="font-size:0.66rem; opacity:0.85; margin:0.3rem 0;">' + p[1] + '</div>' +
        '<div style="font-size:0.6rem; text-transform:uppercase; letter-spacing:1.5px; opacity:0.6;">carga \u00b7 ' + p[2] + '</div></div>').join('') +
    '</div>'
  );

  // ============ 3 · STATUS REPORT SEMANAL ============
  const status = wrap(
    appHeader('Status Report Semanal', 'Projeto \u203a Reporte \u203a Semana 14') +
    '<div style="background:#fff; padding:1.2rem 1.4rem; border:1px solid #e5e7eb; border-top:none;">' +
      '<div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.6rem; border-bottom:1px solid #eee; padding-bottom:0.8rem;">' +
        '<div><div style="font-size:0.62rem; text-transform:uppercase; letter-spacing:2px; color:#667085;">Semana 14 \u00b7 ' + redact + '/' + redact + '/2021</div>' +
        '<div style="font-family:\'Cormorant Garamond\',serif; font-size:1.4rem; color:' + NAVY + ';">Sa\u00fade geral do projeto</div></div>' +
        '<div style="display:flex; align-items:center; gap:8px; background:#ecfdf3; border:1px solid #abefc6; padding:0.4rem 0.9rem;"><span style="width:12px; height:12px; border-radius:50%; background:#1f8a5b;"></span><b style="font-size:0.72rem; color:#1f8a5b;">No caminho certo</b></div>' +
      '</div>' +
      '<div style="display:grid; grid-template-columns:1fr 1fr; gap:1.4rem; margin-top:1rem;">' +
        '<div>' +
          '<h4 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:1.5px; color:' + G + '; margin:0 0 0.6rem;">Avan\u00e7o por frente</h4>' +
          bar('Infraestrutura / Citrix', 100, '#1f8a5b') + bar('Configura\u00e7\u00e3o', 85) + bar('Testes / UAT', 60) + bar('Documenta\u00e7\u00e3o', 45) +
        '</div>' +
        '<div>' +
          '<h4 style="font-size:0.62rem; text-transform:uppercase; letter-spacing:1.5px; color:' + G + '; margin:0 0 0.6rem;">Indicadores</h4>' +
          '<div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; margin-bottom:0.8rem;">' + tile('1.02', 'SPI') + tile('0.98', 'CPI') + '</div>' +
          '<div style="font-size:0.68rem; color:#334155; line-height:1.5;"><b style="color:' + NAVY + ';">Destaques:</b> cutover planejado \u00b7 kickoff de testes conclu\u00eddo.<br><b style="color:' + NAVY + ';">Pr\u00f3ximos passos:</b> UAT com Key Users \u00b7 plano de Hypercare.</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  // ============ 4 · PAINEL DE CHAMADOS / HYPERCARE ============
  const rows = [
    ['#1042', 'Pre\u00e7os', 'Alta', 'Resolvido', '#1f8a5b'],
    ['#1047', 'Integra\u00e7\u00e3o SAP', 'Cr\u00edtica', 'Em andamento', '#d97706'],
    ['#1051', 'Relat\u00f3rios', 'M\u00e9dia', 'Em andamento', '#d97706'],
    ['#1055', 'Acessos', 'Baixa', 'Resolvido', '#1f8a5b'],
    ['#1058', 'Deal Mgmt', 'Alta', 'Aberto', '#b91c1c'],
  ];
  const hyper = wrap(
    appHeader('Painel de Chamados \u00b7 Hypercare', 'Projeto \u203a Suporte \u203a Controle de incidentes') +
    '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.7rem; margin-bottom:0.9rem; margin-top:1rem;">' +
      tile('1', 'aberto', '') + tile('2', 'em andamento', '') + tile('12', 'resolvidos (30d)', '') +
    '</div>' +
    '<div style="background:#fff; border:1px solid #e5e7eb; overflow:hidden;">' +
      '<div style="display:grid; grid-template-columns:0.7fr 1.2fr 1fr 1fr 1.2fr; background:' + NAVY + '; color:#fff; font-size:0.6rem; text-transform:uppercase; letter-spacing:1px; font-weight:700;">' +
        ['Chamado', 'M\u00f3dulo', 'Prioridade', 'Status', 'Respons\u00e1vel'].map(h => '<div style="padding:0.6rem 0.8rem;">' + h + '</div>').join('') +
    '</div>' +
      rows.map((r, i) => '<div style="display:grid; grid-template-columns:0.7fr 1.2fr 1fr 1fr 1.2fr; font-size:0.72rem; color:#334155; ' + (i % 2 ? 'background:#fafafa;' : '') + '">' +
        '<div style="padding:0.6rem 0.8rem; font-weight:700; color:' + NAVY + ';">' + r[0] + '</div>' +
        '<div style="padding:0.6rem 0.8rem;">' + r[1] + '</div>' +
        '<div style="padding:0.6rem 0.8rem;">' + r[2] + '</div>' +
        '<div style="padding:0.6rem 0.8rem;"><span style="display:inline-flex; align-items:center; gap:5px;"><span style="width:8px; height:8px; border-radius:50%; background:' + r[4] + ';"></span>' + r[3] + '</span></div>' +
        '<div style="padding:0.6rem 0.8rem; color:#94a3b8;">' + redact.slice(0, 3) + ' \u00b7 TI</div></div>').join('') +
    '</div>' +
    '<div style="font-size:0.62rem; color:#94a3b8; margin-top:0.7rem;">Integrado ao ITSM (ServiceNow) \u00b7 estado, m\u00f3dulo, criticidade e respons\u00e1vel revisados diariamente.</div>'
  );

  window.MOCKS = {
    0: { url: '\u2588\u2588\u2588\u2588.sharepoint.com/sites/Projeto', cap: ['Recria\u00e7\u00e3o anonimizada do hub do projeto \u2014 dados de cliente omitidos.', 'Anonymized recreation of the project hub \u2014 client data omitted.'], html: hub },
    1: { url: '\u2588\u2588\u2588\u2588.sharepoint.com/sites/Projeto/Aprendizagem', cap: ['Recria\u00e7\u00e3o anonimizada do centro de aprendizagem \u2014 dados de cliente omitidos.', 'Anonymized recreation of the learning center \u2014 client data omitted.'], html: learn },
    2: { url: '\u2588\u2588\u2588\u2588.sharepoint.com/sites/Projeto/Status', cap: ['Recria\u00e7\u00e3o anonimizada de um status report semanal \u2014 dados de cliente omitidos.', 'Anonymized recreation of a weekly status report \u2014 client data omitted.'], html: status },
    6: { url: '\u2588\u2588\u2588\u2588.service-now.com/hypercare', cap: ['Recria\u00e7\u00e3o anonimizada do painel de chamados \u2014 dados de cliente omitidos.', 'Anonymized recreation of the ticket panel \u2014 client data omitted.'], html: hyper },
  };
})();
