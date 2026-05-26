// ── DATA (cargada desde el backend) ──────────────────────────
let membersData = [];
let programsData = [];

const actividadData = [
  {icon:'💪',title:'Nueva inscripción Premium — Laura Castro',desc:'HOY 8:15 AM'},
  {icon:'🔄',title:'Renovación plan — Juan Rodríguez',desc:'HOY 7:40 AM'},
  {icon:'🏆',title:'100 asistencias — Valentina Gómez',desc:'AYER 6:30 PM'},
  {icon:'⚠️',title:'Membresía vencida — Diego Ruiz',desc:'AYER 12:00 PM'},
  {icon:'💳',title:'Pago recibido $280,000 — Sofía Martínez',desc:'22 MAY 9:10 AM'},
  {icon:'📋',title:'Nueva clase: Spinning Sáb 7AM',desc:'21 MAY'},
];

const memberColors=['#e94560','#0891b2','#059669','#d97706'];

// ── CHART DATA ────────────────────────────────────────────────
const chartData = {
  users: {
    semanal: {
      data:[142,198,176,231,189,214,162],
      cats:['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],
      desc:'Visitas esta semana por día',
      footer:'actualizado hace 5 min'
    },
    mensual: {
      data:[1820,2100,1960,2340,2210,2580,2430,2700,2560,2890,2740,3010,2950,3200,3100,3380,3210,3460,3310,3580,3450,3700,3550,3820,3680,3940,3800,4060,3920,4200],
      cats:Array.from({length:30},(_,i)=>`${i+1}`),
      desc:'Asistencias este mes por día',
      footer:'vista mensual'
    }
  },
  sales: {
    diario: {
      data:[1.2,0.9,1.5,1.1,1.8,2.1,1.4,1.7,1.3,2.0,1.6,1.9,1.5,2.2,1.8,2.4,2.0,2.6,2.2,2.8,2.4,3.0,2.6,3.2,2.8,3.4,3.0,3.6,3.2,3.8],
      cats:Array.from({length:30},(_,i)=>`${i+1}`),
      desc:'Ingresos diarios (millones COP)',
      footer:'actualizado hace 4 min'
    },
    mensual: {
      data:[42,38,51,47,55,62,58,66,61,70,65,74],
      cats:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      desc:'Ingresos mensuales (millones COP)',
      footer:'vista mensual'
    },
    anual: {
      data:[320,410,480,540,590,680],
      cats:['2019','2020','2021','2022','2023','2024'],
      desc:'Ingresos anuales (millones COP)',
      footer:'vista anual'
    }
  }
};

// ── CHART INSTANCES ───────────────────────────────────────────
let chartUsers = null, chartSales = null, chartTasks = null;

const baseOpts = {
  chart:{toolbar:{show:false}},
  grid:{show:false,padding:{top:0,right:4,bottom:0,left:4}},
  dataLabels:{enabled:false},
  legend:{show:false},
  tooltip:{theme:'light'},
};

function buildUsersChart(period) {
  const d = chartData.users[period];
  document.getElementById('desc-users').textContent = d.desc;
  document.getElementById('footer-users').textContent = d.footer;
  const opts = {
    ...baseOpts,
    chart:{...baseOpts.chart,type:'bar',height:160,animations:{speed:400}},
    series:[{name:'Usuarios',data:d.data}],
    colors:['#e94560'],
    plotOptions:{bar:{columnWidth: d.data.length > 15 ? '70%' : '45%',borderRadius:3}},
    xaxis:{categories:d.cats,axisBorder:{show:false},axisTicks:{show:false},labels:{style:{fontSize:'10px',colors:Array(d.cats.length).fill('#9ca3af')},rotate:0}},
    yaxis:{show:false},
  };
  if(chartUsers){chartUsers.destroy();}
  chartUsers = new ApexCharts(document.getElementById('chart-users'), opts);
  chartUsers.render();
}

function buildSalesChart(period) {
  const d = chartData.sales[period];
  document.getElementById('desc-sales').textContent = d.desc;
  document.getElementById('footer-sales').textContent = d.footer;
  const opts = {
    ...baseOpts,
    chart:{...baseOpts.chart,type:'line',height:160,animations:{speed:400}},
    series:[{name:'Ventas (M)',data:d.data}],
    colors:['#0891b2'],
    stroke:{curve:'smooth',width:3,lineCap:'round'},
    markers:{size: d.data.length <= 12 ? 4 : 0,strokeWidth:0,hover:{size:6}},
    xaxis:{categories:d.cats,axisBorder:{show:false},axisTicks:{show:false},labels:{style:{fontSize:'10px',colors:Array(d.cats.length).fill('#9ca3af')},rotate:0}},
    yaxis:{show:false},
  };
  if(chartSales){chartSales.destroy();}
  chartSales = new ApexCharts(document.getElementById('chart-sales'), opts);
  chartSales.render();
}

function switchPeriod(chartId, period, btn) {
  btn.closest('.period-toggle').querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if(chartId === 'users') buildUsersChart(period);
  else if(chartId === 'sales') buildSalesChart(period);
}

function initCharts() {
  buildUsersChart('semanal');
  buildSalesChart('diario');
  chartTasks = new ApexCharts(document.getElementById('chart-tasks'), {
    ...baseOpts,
    chart:{...baseOpts.chart,type:'line',height:160},
    series:[{name:'Clases',data:[18,22,19,25,28,24,30,27,32,29,35,31,38,34,40,36,42,38,44,40,46,42,48,44,50,46,52,48,54,50]}],
    colors:['#059669'],
    stroke:{curve:'smooth',width:3,lineCap:'round'},
    markers:{size:0,hover:{size:5}},
    xaxis:{categories:Array.from({length:30},(_,i)=>`${i+1}`),axisBorder:{show:false},axisTicks:{show:false},labels:{style:{fontSize:'10px',colors:Array(30).fill('#9ca3af')}}},
    yaxis:{show:false},
  });
  chartTasks.render();
}

// ── RENDER TABLES ─────────────────────────────────────────────
function renderProgramsTable(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = programsData.map(p => `
    <tr>
      <td><div class="tbl-company">
        <div style="width:30px;height:30px;border-radius:6px;background:${p.color};display:grid;place-items:center;font-size:11px;font-weight:700;color:white;">${p.logo}</div>
        ${p.name}
      </div></td>
      <td><div class="member-stack">${p.members.map((m,i)=>`<div class="member-placeholder" style="background:${memberColors[i%memberColors.length]}">${m}</div>`).join('')}</div></td>
      <td>${p.budget}</td>
      <td><div class="progress-bar-wrap">
        <span class="progress-pct">${p.completion}%</span>
        <div class="progress-bar"><div class="progress-bar-fill${p.completion===100?' done':''}" style="width:${p.completion}%"></div></div>
      </div></td>
    </tr>`).join('');
}

function renderMembersTable(list = membersData) {
  const tbody = document.getElementById('authors-table-body');
  if (!tbody) return;
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--gray-400);font-size:13px;">Sin resultados</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(m => `
    <tr>
      <td><div class="author-cell">
        <div style="width:36px;height:36px;border-radius:8px;background:${m.color};display:grid;place-items:center;font-size:13px;font-weight:700;color:white;flex-shrink:0;">${m.initials}</div>
        <div><div class="author-name">${m.name}</div><div class="author-email">${m.email}</div></div>
      </div></td>
      <td><div class="job-title">${m.plan[0]}</div><div class="job-dept">${m.plan[1] || ''}</div></td>
      <td><span class="chip ${m.active ? (m.plan[0]==='Premium'?'premium':'basic') : 'inactive'}">${m.active ? m.plan[0].toUpperCase() : 'INACTIVO'}</span></td>
      <td>${m.date}</td>
      <td class="tbl-actions"><a href="#" data-member-id="${m.id}">Editar</a></td>
    </tr>`).join('');
}

function renderActividad() {
  document.getElementById('orders-timeline').innerHTML = actividadData.map(o => `
    <div class="timeline-item">
      <div class="timeline-icon">${o.icon}</div>
      <div class="timeline-body">
        <div class="timeline-title">${o.title}</div>
        <div class="timeline-desc">${o.desc}</div>
      </div>
    </div>`).join('');
}

function renderAlerts() {
  const alerts = [
    {color:'green',text:'3 membresías renovadas hoy. ¡Excelente retención!'},
    {color:'orange',text:'5 membresías vencen esta semana. Considera enviar recordatorios.'},
    {color:'red',text:'La piscina está en mantenimiento. Notifica a los miembros afectados.'},
    {color:'gray',text:'Respaldo automático del sistema completado exitosamente.'},
  ];
  ['alerts-container','alerts-icon-container'].forEach((cid, withIcon) => {
    document.getElementById(cid).innerHTML = alerts.map((a,i) => `
      <div class="alert ${a.color}" id="${cid}-${i}">
        ${withIcon ? `<svg class="alert-icon" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` : ''}
        <span>${a.text}</span>
        <button class="alert-close" onclick="this.parentElement.style.display='none'" aria-label="Cerrar">&times;</button>
      </div>`).join('');
  });
}

// ── DATA LOADERS (backend) ────────────────────────────────────
async function loadMembers() {
  try {
    membersData = await api.members.list();
    renderMembersTable();
    updateActiveMembersStat();
  } catch (e) {
    console.error('Error cargando miembros:', e);
  }
}

async function loadPrograms() {
  try {
    programsData = await api.programs.list();
    renderProgramsTable('projects-table-body');
    renderProgramsTable('projects-table-body-2');
  } catch (e) {
    console.error('Error cargando programas:', e);
  }
}

function updateActiveMembersStat() {
  const el = document.getElementById('stat-active-members');
  if (!el) return;
  const active = membersData.filter(m => m.active).length;
  el.textContent = active.toLocaleString('es-CO');
}

// ── SEARCH ────────────────────────────────────────────────────
function attachSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      renderMembersTable();
      return;
    }
    const filtered = membersData.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.plan[0] || '').toLowerCase().includes(q) ||
      (m.plan[1] || '').toLowerCase().includes(q)
    );
    renderMembersTable(filtered);
    if (document.getElementById('page-tables').style.display === 'none') {
      navigate('tables', null);
    }
  });
}

// ── SIGN UP (crea miembro en la DB) ───────────────────────────
function attachSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;
  const feedback = document.getElementById('signupFeedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const plan = document.getElementById('signupPlan').value;
    const activity = document.getElementById('signupActivity').value;

    if (!name || !email) {
      feedback.className = 'form-feedback err';
      feedback.textContent = 'Completa nombre y email.';
      return;
    }

    try {
      await api.members.create({
        name,
        email,
        plan: [plan, activity],
        active: true,
      });
      feedback.className = 'form-feedback ok';
      feedback.textContent = '✓ Miembro registrado correctamente.';
      form.reset();
      await loadMembers();
      setTimeout(() => navigate('tables', null), 800);
    } catch (err) {
      feedback.className = 'form-feedback err';
      feedback.textContent = err.message || 'Error al registrar miembro.';
    }
  });
}

// ── NAVIGATION ────────────────────────────────────────────────
const pages = {home:'Dashboard',profile:'Mi Perfil',tables:'Miembros',notifications:'Alertas',signin:'Iniciar Sesión',signup:'Registrarse'};
function navigate(id, btn) {
  document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active');p.style.display='none';});
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const pg = document.getElementById('page-'+id);
  pg.style.display = 'block';
  setTimeout(() => pg.classList.add('active'), 10);
  if(btn) btn.classList.add('active');
  const isAuth = id === 'signin' || id === 'signup';
  document.getElementById('topbar').style.display = isAuth ? 'none' : 'flex';
  document.getElementById('main-footer').style.display = isAuth ? 'none' : 'flex';
  document.getElementById('breadcrumb').innerHTML = `gympro / <span>${id}</span>`;
  document.getElementById('topbar-title').textContent = pages[id] || id;
}

// ── CONFIGURATOR ──────────────────────────────────────────────
function setSidenavColor(el, dark, light) {
  document.querySelectorAll('.swatch').forEach(s=>s.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('sidebar').style.background = `linear-gradient(195deg,${light},${dark})`;
}
function setSidenavType(btn, type) {
  document.querySelectorAll('.config-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const sb = document.getElementById('sidebar');
  if(type==='white'){sb.style.background='white';sb.style.boxShadow='0 4px 20px rgba(0,0,0,.1)';}
  else if(type==='transparent'){sb.style.background='transparent';sb.style.boxShadow='none';}
  else{sb.style.background='linear-gradient(195deg,#16213e,#1a1a2e)';sb.style.boxShadow='none';}
}
function toggleFixedNavbar(v) {
  const tb = document.getElementById('topbar');
  tb.style.position = v ? 'sticky' : 'relative';
  tb.style.top = v ? '0' : '';
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  renderActividad();
  renderAlerts();
  initCharts();
  await loadPrograms();
  await loadMembers();
  attachSearch();
  attachSignupForm();
  document.getElementById('page-home').style.display = 'block';
});
