/* ================================================================
   THEME HELPER (DARK / LIGHT MODE)
   ================================================================ */
function getTheme(){
  return localStorage.getItem('ig_theme') || 'light';
}
function setTheme(t){
  localStorage.setItem('ig_theme', t);
  document.documentElement.setAttribute('data-theme', t);
}
// Apply saved theme immediately on script load
document.documentElement.setAttribute('data-theme', getTheme());

/* ================================================================
   STORAGE HELPERS & DATA MODELS
   ================================================================ */
const DB = {
  users: 'ig_users',
  session: 'ig_session',
  invoices: 'ig_invoices',
  customers: 'ig_customers',
  enterprises: 'ig_enterprises'
};

const DEFAULT_ADMIN = {
  id: 'u_admin',
  name: 'Admin User',
  email: 'admin@admin.com',
  password: 'admin123',
  businessName: 'Ledgerly Enterprise Solutions',
  phone: '+91 98765 43210',
  address: '100 Executive Way, Suite 500, Mumbai, MH',
  upiId: 'admin@upi',
  taxId: '27AAAAA0000A1Z5'
};

const SAMPLE_ENTERPRISES = [
  {
    id: 'ent_default',
    userId: 'u_admin',
    isDefault: true,
    name: 'Ledgerly Global Tech',
    tagline: 'Enterprise Software & Financial Solutions',
    email: 'billing@ledgerly.com',
    phone: '+91 98765 43210',
    address: '100 Executive Tower, BKC, Mumbai, MH 400051',
    taxId: '27AAAAA0000A1Z5',
    currency: 'INR (₹)',
    currencySymbol: '₹',
    upiId: 'ledgerly@icici',
    bankName: 'HDFC Bank',
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0000123',
    paymentUrl: 'https://pay.ledgerly.com/checkout',
    notes: 'Thank you for choosing Ledgerly Global Tech.'
  }
];

const SAMPLE_CUSTOMERS = [
  {
    id: 'cust_sample_1',
    userId: 'u_admin',
    name: 'Acme Corporation',
    contactPerson: 'Sarah Jenkins',
    email: 'accounts@acme.com',
    phone: '+91 91234 56789',
    address: '45 Corporate Blvd, Cyber City, Gurugram, HR',
    taxId: '06AAACA1234B1Z2',
    terms: 'Net 15 Days'
  },
  {
    id: 'cust_sample_2',
    userId: 'u_admin',
    name: 'Starlight Media Pvt Ltd',
    contactPerson: 'Rajesh Sharma',
    email: 'finance@starlightmedia.in',
    phone: '+91 98111 22233',
    address: '12 Film City Road, Goregaon East, Mumbai, MH',
    taxId: '27AABCS9876C1Z9',
    terms: 'Due on Receipt'
  }
];

function getAll(key){
  try{
    const data = JSON.parse(localStorage.getItem(key));
    if(key === DB.users){
      let users = Array.isArray(data) ? data : [];
      if(!users.some(u => u.email.toLowerCase() === DEFAULT_ADMIN.email)){
        users.unshift(DEFAULT_ADMIN);
        localStorage.setItem(DB.users, JSON.stringify(users));
      }
      return users;
    }
    if(key === DB.enterprises){
      let items = Array.isArray(data) ? data : [];
      if(items.length === 0){
        items = [...SAMPLE_ENTERPRISES];
        localStorage.setItem(DB.enterprises, JSON.stringify(items));
      }
      return items;
    }
    if(key === DB.customers){
      let items = Array.isArray(data) ? data : [];
      if(items.length === 0){
        items = [...SAMPLE_CUSTOMERS];
        localStorage.setItem(DB.customers, JSON.stringify(items));
      }
      return items;
    }
    return data || [];
  }catch(e){
    if(key === DB.users) return [DEFAULT_ADMIN];
    if(key === DB.enterprises) return [...SAMPLE_ENTERPRISES];
    if(key === DB.customers) return [...SAMPLE_CUSTOMERS];
    return [];
  }
}
function setAll(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function uid(prefix){ return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

function getSession(){ try{ return JSON.parse(localStorage.getItem(DB.session)); }catch(e){ return null; } }
function setSession(userId, remember){
  const s = { userId, remember: !!remember };
  localStorage.setItem(DB.session, JSON.stringify(s));
}
function clearSession(){ localStorage.removeItem(DB.session); }
function currentUser(){
  const s = getSession();
  if(!s) return null;
  return getAll(DB.users).find(u => u.id === s.userId) || null;
}

/* ================================================================
   VALIDATION HELPERS
   ================================================================ */
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function fmtMoney(n, symbol = '₹'){
  n = Number(n)||0;
  return symbol + ' ' + n.toLocaleString('en-IN',{minimumFractionDigits:2, maximumFractionDigits:2});
}
function fmtDate(d){
  if(!d) return '—';
  const dt = new Date(d+'T00:00:00');
  if(isNaN(dt)) return d;
  return dt.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
}
function todayISO(){ return new Date().toISOString().slice(0,10); }

/* ================================================================
   SIGNATURE PAD
   ================================================================ */
function initSignaturePad(canvas, existingDataUrl){
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#16241f';
  let drawing = false;
  let hasDrawing = false;

  function pos(e){
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  }
  function start(e){
    drawing = true; hasDrawing = true;
    const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y);
    canvas.setPointerCapture(e.pointerId);
  }
  function move(e){
    if(!drawing) return;
    const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke();
  }
  function end(){ drawing = false; }

  canvas.addEventListener('pointerdown', start);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('pointerleave', end);

  if(existingDataUrl){
    const img = new Image();
    img.onload = ()=> ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.src = existingDataUrl;
    hasDrawing = true;
  }

  return {
    clear(){ ctx.clearRect(0,0,canvas.width,canvas.height); hasDrawing = false; },
    isEmpty(){ return !hasDrawing; },
    toDataURL(){ return canvas.toDataURL('image/png'); }
  };
}

/* ================================================================
   PAYMENT QR & LINK HELPERS
   ================================================================ */
function buildUpiLink(invoice){
  const upiId = invoice.seller && invoice.seller.upiId;
  if(!upiId) return null;
  const params = new URLSearchParams({
    pa: upiId,
    pn: invoice.seller.name || 'Merchant',
    am: Number(invoice.grandTotal || 0).toFixed(2),
    cu: 'INR',
    tn: 'Invoice ' + invoice.invoiceNumber
  });
  return 'upi://pay?' + params.toString();
}

function getPaymentQrTarget(invoice){
  if(invoice.seller && invoice.seller.paymentUrl){
    return invoice.seller.paymentUrl;
  }
  return buildUpiLink(invoice);
}

function qrImageUrl(data, size = 200){
  if(!data) return '';
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._tm);
  showToast._tm = setTimeout(()=> t.classList.remove('show'), 2400);
}

/* ================================================================
   ROUTER
   ================================================================ */
const routes = {
  '/login': renderLogin,
  '/register': renderRegister,
  '/dashboard': guarded(renderDashboard),
  '/create': guarded(renderCreateInvoice),
  '/edit': guarded(renderCreateInvoice),
  '/preview': guarded(renderPreview),
  '/history': guarded(renderHistory),
  '/customers': guarded(renderCustomers),
  '/enterprise': guarded(renderEnterprise),
  '/profile': guarded(renderProfile),
};

function guarded(fn){
  return function(params){
    if(!currentUser()){ location.hash = '#/login'; return; }
    fn(params);
  };
}

function parseHash(){
  const raw = location.hash.replace(/^#/, '') || '/login';
  const [path, qs] = raw.split('?');
  const params = new URLSearchParams(qs || '');
  return { path: path || '/login', params };
}

function route(){
  const { path, params } = parseHash();
  const handler = routes[path];
  const app = document.getElementById('app');
  if(!handler){ location.hash = '#/login'; return; }
  app.innerHTML = '';
  handler(params);
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', ()=>{
  if(!location.hash) location.hash = currentUser() ? '#/dashboard' : '#/login';
  route();
});

/* ================================================================
   SHARED CHROME (sidebar + topbar) FOR APP VIEWS
   ================================================================ */
function appShell(activePath, title, eyebrow, contentHTML){
  const user = currentUser();
  const currentTheme = getTheme();
  const themeLabel = currentTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';

  const nav = [
    {path:'/dashboard', label:'Dashboard', ico:'D'},
    {path:'/create', label:'New Invoice', ico:'+'},
    {path:'/history', label:'Invoices', ico:'I'},
    {path:'/customers', label:'Customers', ico:'C'},
    {path:'/enterprise', label:'Enterprise', ico:'E'},
    {path:'/profile', label:'Profile', ico:'P'},
  ];
  const navHTML = nav.map(n => `
    <a class="nav-link ${activePath===n.path?'active':''}" href="#${n.path}">
      <span class="ico">${n.ico}</span>${n.label}
    </a>`).join('');

  return `
  <div class="shell">
    <div class="mobile-topbar no-print">
      <div class="brandmark"><div class="seal">L</div><div class="word">Ledger<span>ly</span></div></div>
      <button id="menuToggle" aria-label="Open menu">&#9776;</button>
    </div>
    <aside class="sidebar no-print" id="sidebar">
      <div class="brandmark"><div class="seal">L</div><div class="word">Ledger<span>ly</span></div></div>
      <nav class="sidebar-nav">${navHTML}</nav>
      <div class="sidebar-user">
        <div class="name">${escapeHTML(user?.name || '')}</div>
        <div class="biz">${escapeHTML(user?.businessName || 'Ledgerly Account')}</div>
        <button class="btn btn-ghost btn-sm btn-block" id="logoutBtn" style="border-color:rgba(255,255,255,0.25);color:#eef1ea;">Log out</button>
      </div>
    </aside>
    <main class="main">
      <div class="topbar">
        <div>
          ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
          <h1>${title}</h1>
        </div>
        <button class="theme-toggle no-print" id="themeToggleBtn">${themeLabel}</button>
      </div>
      <div id="viewContent">${contentHTML}</div>
    </main>
  </div>`;
}

function mountShellEvents(){
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  if(toggle){ toggle.addEventListener('click', ()=> sidebar.classList.toggle('open')); }
  
  const logout = document.getElementById('logoutBtn');
  if(logout){ logout.addEventListener('click', ()=>{ clearSession(); location.hash = '#/login'; }); }

  const themeBtn = document.getElementById('themeToggleBtn');
  if(themeBtn){
    themeBtn.addEventListener('click', ()=>{
      const nextTheme = getTheme() === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      themeBtn.textContent = nextTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
      showToast(`Switched to ${nextTheme} mode.`);
    });
  }
}

function escapeHTML(str){
  return String(str ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ================================================================
   VIEW: LOGIN
   ================================================================ */
function renderLogin(){
  const app = document.getElementById('app');
  app.innerHTML = `
  <div class="auth-shell">
    <div class="auth-card">
      <div class="brandmark"><div class="seal">L</div><div class="word">Ledger<span>ly</span></div></div>
      <h1>Welcome back</h1>
      <p class="auth-sub">Log in to pick up where you left off.<br><small style="color:var(--teal);font-weight:600;">(Admin Login: admin@admin.com / admin123)</small></p>
      <div id="formMsg" class="form-msg"></div>
      <form id="loginForm" novalidate>
        <div class="field" id="f-email">
          <label for="email">Email address</label>
          <input type="email" id="email" autocomplete="email" placeholder="you@business.com" value="admin@admin.com">
          <div class="field-error">Enter a valid email address.</div>
        </div>
        <div class="field" id="f-password">
          <label for="password">Password</label>
          <input type="password" id="password" autocomplete="current-password" placeholder="••••••••" value="admin123">
          <div class="field-error">Enter your password.</div>
        </div>
        <div class="auth-remember">
          <label><input type="checkbox" id="remember" checked> Remember me</label>
          <button type="button" class="link-btn" id="forgotBtn">Forgot password?</button>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Log in</button>
      </form>
      <p class="auth-foot">New to Ledgerly? <a href="#/register">Create an account</a></p>
    </div>
  </div>`;

  document.getElementById('forgotBtn').addEventListener('click', ()=>{
    const email = document.getElementById('email').value.trim();
    const msg = document.getElementById('formMsg');
    if(!email || (!isValidEmail(email) && email.toLowerCase() !== 'admin')){
      msg.textContent = 'Enter your account email above first, then tap "Forgot password?".';
      msg.className = 'form-msg error show';
      return;
    }
    const user = getAll(DB.users).find(u => u.email.toLowerCase() === email.toLowerCase());
    if(!user && email.toLowerCase() !== 'admin' && email.toLowerCase() !== 'admin@admin.com'){
      msg.textContent = 'No account found with that email.';
      msg.className = 'form-msg error show';
      return;
    }
    const pwd = user ? user.password : 'admin123';
    msg.textContent = `Your password reminder: "${pwd}".`;
    msg.className = 'form-msg success show';
  });

  document.getElementById('loginForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    let valid = true;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const fEmail = document.getElementById('f-email');
    const fPass = document.getElementById('f-password');
    fEmail.classList.remove('has-error'); fPass.classList.remove('has-error');

    if(!email){ fEmail.classList.add('has-error'); valid = false; }
    if(!password){ fPass.classList.add('has-error'); valid = false; }
    if(!valid) return;

    const users = getAll(DB.users);
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if ((email.toLowerCase() === 'admin@admin.com' || email.toLowerCase() === 'admin') && password === 'admin123') {
      if(!user) {
        user = DEFAULT_ADMIN;
        users.push(user);
        setAll(DB.users, users);
      }
    }

    const msg = document.getElementById('formMsg');
    if(!user || user.password !== password){
      msg.textContent = 'Incorrect email or password. Please try again.';
      msg.className = 'form-msg error show';
      return;
    }
    setSession(user.id, document.getElementById('remember').checked);
    location.hash = '#/dashboard';
  });
}

/* ================================================================
   VIEW: REGISTER
   ================================================================ */
function renderRegister(){
  const app = document.getElementById('app');
  app.innerHTML = `
  <div class="auth-shell">
    <div class="auth-card">
      <div class="brandmark"><div class="seal">L</div><div class="word">Ledger<span>ly</span></div></div>
      <h1>Create your account</h1>
      <p class="auth-sub">Set up an account to start generating invoices.</p>
      <div id="formMsg" class="form-msg"></div>
      <form id="regForm" novalidate>
        <div class="field" id="f-name">
          <label for="name">Full name</label>
          <input type="text" id="name" autocomplete="name" placeholder="Jordan Rivera">
          <div class="field-error">Enter your full name.</div>
        </div>
        <div class="field" id="f-email">
          <label for="email">Email address</label>
          <input type="email" id="email" autocomplete="email" placeholder="you@business.com">
          <div class="field-error">Enter a valid email address.</div>
        </div>
        <div class="field" id="f-password">
          <label for="password">Password</label>
          <input type="password" id="password" autocomplete="new-password" placeholder="At least 6 characters">
          <div class="field-error">Password must be at least 6 characters.</div>
        </div>
        <div class="field" id="f-confirm">
          <label for="confirm">Confirm password</label>
          <input type="password" id="confirm" autocomplete="new-password" placeholder="Re-enter password">
          <div class="field-error">Passwords do not match.</div>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Create account</button>
      </form>
      <p class="auth-foot">Already have an account? <a href="#/login">Log in</a></p>
    </div>
  </div>`;

  document.getElementById('regForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    ['name','email','password','confirm'].forEach(id => document.getElementById('f-'+id).classList.remove('has-error'));
    let valid = true;
    if(!name){ document.getElementById('f-name').classList.add('has-error'); valid = false; }
    if(!isValidEmail(email)){ document.getElementById('f-email').classList.add('has-error'); valid = false; }
    if(!password || password.length < 6){ document.getElementById('f-password').classList.add('has-error'); valid = false; }
    if(confirm !== password){ document.getElementById('f-confirm').classList.add('has-error'); valid = false; }
    if(!valid) return;

    const users = getAll(DB.users);
    const msg = document.getElementById('formMsg');
    if(users.some(u => u.email.toLowerCase() === email.toLowerCase())){
      msg.textContent = 'An account with this email already exists. Try logging in instead.';
      msg.className = 'form-msg error show';
      return;
    }
    const newUser = {
      id: uid('u'), name, email, password,
      businessName:'', phone:'', address:''
    };
    users.push(newUser);
    setAll(DB.users, users);
    setSession(newUser.id, true);
    showToast('Account created — welcome to Ledgerly.');
    location.hash = '#/dashboard';
  });
}

/* ================================================================
   VIEW: DASHBOARD
   ================================================================ */
function renderDashboard(){
  const user = currentUser();
  const invoices = getAll(DB.invoices).filter(i => i.userId === user.id)
    .sort((a,b)=> b.createdAt - a.createdAt);

  const total = invoices.length;
  const totalValue = invoices.reduce((s,i)=> s + i.grandTotal, 0);
  const paidCount = invoices.filter(i=>i.status==='Paid').length;
  const pendingCount = invoices.filter(i=>i.status==='Pending').length;

  const recent = invoices.slice(0,5);
  const rows = recent.length ? recent.map(rowHTML).join('') :
    `<tr class="empty-row"><td colspan="5">No invoices yet. Create your first one to see it here.</td></tr>`;

  const content = `
    <div class="cta-banner">
      <div>
        <h2>Ready to bill a client?</h2>
        <p>Build a new invoice with automatic totals &amp; instant payment QR code in a couple of minutes.</p>
      </div>
      <a href="#/create" class="btn btn-brass">+ Create New Invoice</a>
    </div>

    <div class="stat-grid">
      <div class="card stat-card accent"><div class="label">Total Invoices</div><div class="value">${total}</div></div>
      <div class="card stat-card"><div class="label">Total Billed</div><div class="value mono">${fmtMoney(totalValue)}</div></div>
      <div class="card stat-card"><div class="label">Paid</div><div class="value">${paidCount}</div></div>
      <div class="card stat-card"><div class="label">Pending</div><div class="value">${pendingCount}</div></div>
    </div>

    <div class="card" style="padding:22px 24px;">
      <div class="section-head">
        <h2>Recent Invoices</h2>
        <a class="see-all" href="#/history">View all →</a>
      </div>
      <table class="ledger-table">
        <thead><tr><th>Invoice #</th><th>Customer</th><th>Date</th><th class="num">Amount</th><th>Status</th></tr></thead>
        <tbody id="recentBody">${rows}</tbody>
      </table>
    </div>`;

  document.getElementById('app').innerHTML = appShell('/dashboard', `Welcome, ${escapeHTML(user.name.split(' ')[0])}`, 'Dashboard', content);
  mountShellEvents();

  document.querySelectorAll('#recentBody tr[data-id]').forEach(tr=>{
    tr.addEventListener('click', ()=> location.hash = '#/preview?id='+tr.dataset.id);
  });
}

function rowHTML(inv){
  const symbol = inv.currencySymbol || '₹';
  return `<tr data-id="${inv.id}">
    <td class="mono">${escapeHTML(inv.invoiceNumber)}</td>
    <td>${escapeHTML(inv.customer.name)}</td>
    <td>${fmtDate(inv.invoiceDate)}</td>
    <td class="num">${fmtMoney(inv.grandTotal, symbol)}</td>
    <td><span class="stamp ${inv.status.toLowerCase()}">${inv.status}</span></td>
  </tr>`;
}

/* ================================================================
   VIEW: CREATE / EDIT INVOICE (With Signature Pad & Auto-Fills)
   ================================================================ */
let builderItems = [];
let builderEditId = null;

function blankItem(){ return { id: uid('it'), name:'', description:'', qty:1, price:0 }; }

function renderCreateInvoice(params){
  const user = currentUser();
  const editId = params.get('id');
  const preCustId = params.get('cust_id');
  const preEntId = params.get('ent_id');

  let invoice = null;
  if(editId){
    invoice = getAll(DB.invoices).find(i => i.id === editId && i.userId === user.id);
  }
  builderEditId = invoice ? invoice.id : null;
  builderItems = invoice ? invoice.items.map(i=>({...i})) : [blankItem()];

  let savedCustomers = getAll(DB.customers).filter(c => c.userId === user.id);
  let savedEnterprises = getAll(DB.enterprises).filter(e => e.userId === user.id);
  
  const defaultEnt = preEntId 
    ? (savedEnterprises.find(e => e.id === preEntId) || savedEnterprises[0])
    : (savedEnterprises.find(e => e.isDefault) || savedEnterprises[0]);

  const preloadedCust = preCustId ? savedCustomers.find(c => c.id === preCustId) : null;

  const seller = invoice ? invoice.seller : {
    name: defaultEnt ? defaultEnt.name : (user.businessName || ''),
    address: defaultEnt ? defaultEnt.address : (user.address || ''),
    email: defaultEnt ? defaultEnt.email : (user.email || ''),
    phone: defaultEnt ? defaultEnt.phone : (user.phone || ''),
    upiId: defaultEnt ? defaultEnt.upiId : (user.upiId || ''),
    taxId: defaultEnt ? defaultEnt.taxId : (user.taxId || ''),
    bankName: defaultEnt ? defaultEnt.bankName : '',
    accountNumber: defaultEnt ? defaultEnt.accountNumber : '',
    ifscCode: defaultEnt ? defaultEnt.ifscCode : '',
    paymentUrl: defaultEnt ? defaultEnt.paymentUrl : ''
  };

  const customer = invoice ? invoice.customer : {
    name: preloadedCust ? preloadedCust.name : '',
    address: preloadedCust ? preloadedCust.address : '',
    email: preloadedCust ? preloadedCust.email : '',
    phone: preloadedCust ? preloadedCust.phone : '',
    taxId: preloadedCust ? preloadedCust.taxId : ''
  };

  const invoiceNumber = invoice ? invoice.invoiceNumber : nextInvoiceNumber(user.id);
  const invoiceDate = invoice ? invoice.invoiceDate : todayISO();
  const dueDate = invoice ? invoice.dueDate : '';
  const discountPct = invoice ? invoice.discountPct : 0;
  const taxPct = invoice ? invoice.taxPct : 0;
  const notes = invoice ? (invoice.notes || '') : (defaultEnt ? defaultEnt.notes : '');
  const paymentTerms = invoice ? invoice.paymentTerms : (preloadedCust?.terms || 'Due within 15 days of invoice date.');
  const currencySymbol = invoice ? (invoice.currencySymbol || '₹') : (defaultEnt ? (defaultEnt.currencySymbol || '₹') : '₹');
  const signatureData = invoice ? (invoice.signature || user.signature || '') : (user.signature || '');

  function getCustOptionsHtml(selectedId){
    return savedCustomers.map(c => 
      `<option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${escapeHTML(c.name)} ${c.contactPerson ? `(${c.contactPerson})` : ''}</option>`
    ).join('');
  }

  function getEntOptionsHtml(selectedId){
    return savedEnterprises.map(e => 
      `<option value="${e.id}" ${(selectedId ? e.id === selectedId : defaultEnt && defaultEnt.id === e.id) ? 'selected' : ''}>${escapeHTML(e.name)} ${e.isDefault ? '[Default]' : ''}</option>`
    ).join('');
  }

  const content = `
    <div id="createMsg" class="form-msg"></div>

    <div class="builder-grid">
      <!-- Seller / Enterprise Section -->
      <div class="card builder-card">
        <h3>
          <span>Seller / Enterprise</span>
          <div class="builder-header-actions">
            <select id="enterpriseSelect" class="autofill-select">
              <option value="">-- Load Profile --</option>
              ${getEntOptionsHtml(defaultEnt?.id)}
            </select>
            <button type="button" class="btn-xs" id="quickAddEntBtn" title="Create new enterprise profile">+ New</button>
            <button type="button" class="btn-xs" id="saveAsEntBtn" title="Save filled details as a reusable Enterprise Profile">💾 Save Profile</button>
          </div>
        </h3>
        <div class="field"><label>Business / Company Name</label><input id="s_name" value="${escapeHTML(seller.name)}" placeholder="Your Enterprise Name"></div>
        <div class="field"><label>Address</label><input id="s_address" value="${escapeHTML(seller.address)}" placeholder="Street, City, State, ZIP"></div>
        <div class="field-row">
          <div class="field"><label>Email</label><input id="s_email" type="email" value="${escapeHTML(seller.email)}" placeholder="billing@enterprise.com"></div>
          <div class="field"><label>Phone</label><input id="s_phone" value="${escapeHTML(seller.phone)}" placeholder="+91 00000 00000"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>GSTIN / Tax ID</label><input id="s_tax" value="${escapeHTML(seller.taxId || '')}" placeholder="27AAAAA0000A1Z5"></div>
          <div class="field">
            <label>Currency Symbol</label>
            <select id="i_currency">
              <option value="₹" ${currencySymbol==='₹'?'selected':''}>INR (₹)</option>
              <option value="$" ${currencySymbol==='$'?'selected':''}>USD ($)</option>
              <option value="€" ${currencySymbol==='€'?'selected':''}>EUR (€)</option>
              <option value="£" ${currencySymbol==='£'?'selected':''}>GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Customer Section -->
      <div class="card builder-card">
        <h3>
          <span>Customer Information</span>
          <div class="builder-header-actions">
            <select id="customerSelect" class="autofill-select">
              <option value="">-- Load Saved Customer --</option>
              ${getCustOptionsHtml(preloadedCust?.id)}
            </select>
            <button type="button" class="btn-xs" id="quickAddCustBtn" title="Create new customer profile">+ New</button>
            <button type="button" class="btn-xs" id="saveAsCustBtn" title="Save filled details as a reusable Customer Profile">💾 Save Profile</button>
          </div>
        </h3>
        <div class="field" id="f-c_name"><label>Customer / Client Name</label><input id="c_name" value="${escapeHTML(customer.name)}" placeholder="Client or Company Name"><div class="field-error">Customer name is required.</div></div>
        <div class="field"><label>Customer Address</label><input id="c_address" value="${escapeHTML(customer.address)}" placeholder="Street, City, State, ZIP"></div>
        <div class="field-row">
          <div class="field"><label>Customer Email</label><input id="c_email" type="email" value="${escapeHTML(customer.email)}" placeholder="client@company.com"></div>
          <div class="field"><label>Customer Phone</label><input id="c_phone" value="${escapeHTML(customer.phone)}" placeholder="+91 00000 00000"></div>
        </div>
        <div class="field" style="margin-bottom:0;"><label>Customer GSTIN / Tax ID</label><input id="c_tax" value="${escapeHTML(customer.taxId || '')}" placeholder="Optional Tax ID"></div>
      </div>
    </div>

    <!-- Invoice Meta Information -->
    <div class="card builder-card">
      <h3>Invoice Information</h3>
      <div class="field-row">
        <div class="field"><label>Invoice Number</label><input id="i_number" class="mono" value="${escapeHTML(invoiceNumber)}"></div>
        <div class="field"><label>Invoice Date</label><input id="i_date" type="date" value="${invoiceDate}"></div>
        <div class="field"><label>Due Date</label><input id="i_due" type="date" value="${dueDate}"></div>
      </div>
    </div>

    <!-- Payment QR & Bank Details -->
    <div class="card builder-card">
      <h3>Payment &amp; Bank Transfer Details (For QR Code &amp; Invoice Footer)</h3>
      <div class="field-row">
        <div class="field"><label>UPI ID (Generates Dynamic Payment QR)</label><input id="s_upi" value="${escapeHTML(seller.upiId || '')}" placeholder="yourname@bank"></div>
        <div class="field"><label>Custom Payment Link / URL (Stripe, PayPal, etc.)</label><input id="s_payurl" value="${escapeHTML(seller.paymentUrl || '')}" placeholder="https://pay.example.com/checkout"></div>
      </div>
      <div class="field-row" style="margin-bottom:0;">
        <div class="field"><label>Bank Name</label><input id="s_bank" value="${escapeHTML(seller.bankName || '')}" placeholder="HDFC Bank"></div>
        <div class="field"><label>Account Number</label><input id="s_acc" class="mono" value="${escapeHTML(seller.accountNumber || '')}" placeholder="502000xxxxxx"></div>
        <div class="field"><label>IFSC / SWIFT Code</label><input id="s_ifsc" class="mono" value="${escapeHTML(seller.ifscCode || '')}" placeholder="HDFC0000123"></div>
      </div>
    </div>

    <!-- Products / Services -->
    <div class="card builder-card">
      <h3>Products / Services</h3>
      <table class="items-table" id="itemsTable">
        <thead><tr>
          <th>Item</th><th>Description</th><th class="col-qty">Qty</th><th class="col-price">Unit Price</th><th>Total</th><th class="col-remove"></th>
        </tr></thead>
        <tbody id="itemsBody"></tbody>
      </table>
      <button type="button" class="btn btn-ghost btn-sm" id="addItemBtn">+ Add Item</button>
    </div>

    <!-- Discount, Tax & Totals -->
    <div class="card builder-card">
      <h3>Discount, Tax &amp; Totals</h3>
      <div class="totals-box">
        <div class="row"><span>Subtotal</span><span class="amt" id="t_subtotal">₹0.00</span></div>
        <div class="row"><span>Discount (<input type="number" class="pct-input" id="i_discount" value="${discountPct}" min="0" max="100" step="0.1">%)</span><span class="amt" id="t_discount">−₹0.00</span></div>
        <div class="row"><span>Tax (<input type="number" class="pct-input" id="i_tax" value="${taxPct}" min="0" max="100" step="0.1">%)</span><span class="amt" id="t_tax">+₹0.00</span></div>
        <div class="row grand"><span>Grand Total</span><span class="amt" id="t_grand">₹0.00</span></div>
      </div>
    </div>

    <!-- Digital Signature Box in Builder -->
    <div class="card builder-card">
      <h3>Authorised Signature</h3>
      <p class="helper-text">Draw a signature below for this invoice, or leave as is to use your default profile signature.</p>
      <div class="builder-sig-box">
        <canvas id="builderSigPad" class="builder-sig-canvas" width="360" height="120"></canvas>
        <div>
          <button type="button" class="btn btn-ghost btn-sm" id="clearBuilderSigBtn">Clear Canvas</button>
          ${user.signature ? `<button type="button" class="btn btn-ghost btn-sm" id="loadUserSigBtn" style="margin-left:6px;">Load Profile Signature</button>` : ''}
        </div>
      </div>
    </div>

    <!-- Terms & Notes -->
    <div class="card builder-card">
      <h3>Payment Terms &amp; Notes</h3>
      <div class="field"><label>Payment Terms</label><textarea id="i_terms" rows="2">${escapeHTML(paymentTerms)}</textarea></div>
      <div class="field" style="margin-bottom:0;"><label>Notes</label><textarea id="i_notes" rows="2" placeholder="Thank you for your business.">${escapeHTML(notes)}</textarea></div>
    </div>

    <div class="form-actions">
      <a href="#/dashboard" class="btn btn-ghost">Cancel</a>
      <button type="button" class="btn btn-ghost" id="previewBtn">Preview</button>
      <button type="button" class="btn btn-primary" id="generateBtn">Generate Invoice</button>
    </div>

    <!-- Quick Add Customer Modal -->
    <div class="modal-overlay" id="quickCustModal">
      <div class="modal-card">
        <div class="modal-head">
          <h2>Quick Add Customer</h2>
          <button class="modal-close" id="closeQuickCustModal">&times;</button>
        </div>
        <form id="quickCustForm">
          <div class="field"><label>Customer / Company Name *</label><input id="qc_name" required placeholder="Acme Inc."></div>
          <div class="field"><label>Contact Person</label><input id="qc_contact" placeholder="Jane Doe"></div>
          <div class="field-row">
            <div class="field"><label>Email</label><input id="qc_email" type="email" placeholder="billing@acme.com"></div>
            <div class="field"><label>Phone</label><input id="qc_phone" placeholder="+91 98765 43210"></div>
          </div>
          <div class="field"><label>Address</label><input id="qc_address" placeholder="123 Business Way, City, State"></div>
          <div class="field-row">
            <div class="field"><label>GSTIN / Tax ID</label><input id="qc_tax" placeholder="27AAAAA0000A1Z5"></div>
            <div class="field"><label>Default Terms</label><input id="qc_terms" placeholder="Net 15 Days"></div>
          </div>
          <div class="form-actions" style="margin-top:20px;">
            <button type="button" class="btn btn-ghost" id="cancelQuickCustModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save &amp; Use Customer</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Quick Add Enterprise Modal -->
    <div class="modal-overlay" id="quickEntModal">
      <div class="modal-card">
        <div class="modal-head">
          <h2>Quick Add Enterprise Profile</h2>
          <button class="modal-close" id="closeQuickEntModal">&times;</button>
        </div>
        <form id="quickEntForm">
          <div class="field"><label>Enterprise / Business Name *</label><input id="qe_name" required placeholder="Ledgerly Tech Ltd"></div>
          <div class="field"><label>Tagline / Description</label><input id="qe_tagline" placeholder="Enterprise Financial Solutions"></div>
          <div class="field-row">
            <div class="field"><label>Business Email</label><input id="qe_email" type="email" placeholder="billing@ledgerly.com"></div>
            <div class="field"><label>Business Phone</label><input id="qe_phone" placeholder="+91 98765 43210"></div>
          </div>
          <div class="field"><label>Business Address</label><input id="qe_address" placeholder="100 Executive Tower, Mumbai"></div>
          <div class="field-row">
            <div class="field"><label>GSTIN / Tax ID</label><input id="qe_tax" placeholder="27AAAAA0000A1Z5"></div>
            <div class="field">
              <label>Currency</label>
              <select id="qe_currency">
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>
          </div>
          <div class="field-row">
            <div class="field"><label>UPI ID (For QR)</label><input id="qe_upi" placeholder="ledgerly@icici"></div>
            <div class="field"><label>Custom Payment URL</label><input id="qe_payurl" placeholder="https://pay.ledgerly.com"></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Bank Name</label><input id="qe_bank" placeholder="HDFC Bank"></div>
            <div class="field"><label>Account Number</label><input id="qe_acc" class="mono" placeholder="502000xxxxxx"></div>
            <div class="field"><label>IFSC Code</label><input id="qe_ifsc" class="mono" placeholder="HDFC0000123"></div>
          </div>
          <div class="form-actions" style="margin-top:20px;">
            <button type="button" class="btn btn-ghost" id="cancelQuickEntModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save &amp; Use Profile</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('app').innerHTML = appShell('/create', invoice ? 'Edit Invoice' : 'Create Invoice', 'Invoice Builder', content);
  mountShellEvents();

  renderItemsBody();
  recalcTotals();

  // Initialize Builder Signature Pad
  const builderSigCanvas = document.getElementById('builderSigPad');
  const bPad = initSignaturePad(builderSigCanvas, signatureData);

  document.getElementById('clearBuilderSigBtn').addEventListener('click', ()=> bPad.clear());
  const loadProfileSigBtn = document.getElementById('loadUserSigBtn');
  if(loadProfileSigBtn){
    loadProfileSigBtn.addEventListener('click', ()=>{
      if(user.signature){
        bPad.clear();
        const img = new Image();
        img.onload = ()=> builderSigCanvas.getContext('2d').drawImage(img, 0, 0, builderSigCanvas.width, builderSigCanvas.height);
        img.src = user.signature;
        showToast('Profile signature loaded.');
      }
    });
  }

  // Handle Enterprise Auto-Fill
  document.getElementById('enterpriseSelect').addEventListener('change', (e)=>{
    const entId = e.target.value;
    if(!entId) return;
    const ent = savedEnterprises.find(item => item.id === entId);
    if(ent){
      document.getElementById('s_name').value = ent.name || '';
      document.getElementById('s_address').value = ent.address || '';
      document.getElementById('s_email').value = ent.email || '';
      document.getElementById('s_phone').value = ent.phone || '';
      document.getElementById('s_tax').value = ent.taxId || '';
      document.getElementById('s_upi').value = ent.upiId || '';
      document.getElementById('s_payurl').value = ent.paymentUrl || '';
      document.getElementById('s_bank').value = ent.bankName || '';
      document.getElementById('s_acc').value = ent.accountNumber || '';
      document.getElementById('s_ifsc').value = ent.ifscCode || '';
      if(ent.notes) document.getElementById('i_notes').value = ent.notes;
      if(ent.currencySymbol) document.getElementById('i_currency').value = ent.currencySymbol;
      showToast('Loaded enterprise profile: ' + ent.name);
      recalcTotals();
    }
  });

  // Handle Customer Auto-Fill
  document.getElementById('customerSelect').addEventListener('change', (e)=>{
    const custId = e.target.value;
    if(!custId) return;
    const cust = savedCustomers.find(item => item.id === custId);
    if(cust){
      document.getElementById('c_name').value = cust.name || '';
      document.getElementById('c_address').value = cust.address || '';
      document.getElementById('c_email').value = cust.email || '';
      document.getElementById('c_phone').value = cust.phone || '';
      document.getElementById('c_tax').value = cust.taxId || '';
      if(cust.terms) document.getElementById('i_terms').value = cust.terms;
      showToast('Loaded customer: ' + cust.name);
    }
  });

  // Save current filled Seller details as a new Enterprise Profile
  document.getElementById('saveAsEntBtn').addEventListener('click', ()=>{
    const name = document.getElementById('s_name').value.trim();
    if(!name){
      showToast('Please enter a business name first.');
      return;
    }
    const currSym = document.getElementById('i_currency').value;
    const newEnt = {
      id: uid('ent'),
      userId: user.id,
      name,
      tagline: '',
      email: document.getElementById('s_email').value.trim(),
      phone: document.getElementById('s_phone').value.trim(),
      address: document.getElementById('s_address').value.trim(),
      taxId: document.getElementById('s_tax').value.trim(),
      currency: currSym === '₹' ? 'INR (₹)' : currSym === '$' ? 'USD ($)' : currSym === '€' ? 'EUR (€)' : 'GBP (£)',
      currencySymbol: currSym,
      upiId: document.getElementById('s_upi').value.trim(),
      paymentUrl: document.getElementById('s_payurl').value.trim(),
      bankName: document.getElementById('s_bank').value.trim(),
      accountNumber: document.getElementById('s_acc').value.trim(),
      ifscCode: document.getElementById('s_ifsc').value.trim(),
      notes: document.getElementById('i_notes').value.trim(),
      isDefault: false
    };
    let allEnts = getAll(DB.enterprises);
    allEnts.push(newEnt);
    setAll(DB.enterprises, allEnts);
    savedEnterprises = allEnts.filter(e => e.userId === user.id);
    document.getElementById('enterpriseSelect').innerHTML = '<option value="">-- Load Profile --</option>' + getEntOptionsHtml(newEnt.id);
    showToast('Saved current seller details as new Enterprise Profile: ' + name);
  });

  // Save current filled Customer details as a new Customer Profile
  document.getElementById('saveAsCustBtn').addEventListener('click', ()=>{
    const name = document.getElementById('c_name').value.trim();
    if(!name){
      showToast('Please enter a customer name first.');
      return;
    }
    const newCust = {
      id: uid('cust'),
      userId: user.id,
      name,
      contactPerson: '',
      email: document.getElementById('c_email').value.trim(),
      phone: document.getElementById('c_phone').value.trim(),
      address: document.getElementById('c_address').value.trim(),
      taxId: document.getElementById('c_tax').value.trim(),
      terms: document.getElementById('i_terms').value.trim()
    };
    let allCusts = getAll(DB.customers);
    allCusts.push(newCust);
    setAll(DB.customers, allCusts);
    savedCustomers = allCusts.filter(c => c.userId === user.id);
    document.getElementById('customerSelect').innerHTML = '<option value="">-- Load Saved Customer --</option>' + getCustOptionsHtml(newCust.id);
    showToast('Saved current customer as Profile: ' + name);
  });

  // Quick Add Modals
  const quickCustModal = document.getElementById('quickCustModal');
  document.getElementById('quickAddCustBtn').addEventListener('click', ()=>{
    document.getElementById('quickCustForm').reset();
    quickCustModal.classList.add('show');
  });
  document.getElementById('closeQuickCustModal').addEventListener('click', ()=> quickCustModal.classList.remove('show'));
  document.getElementById('cancelQuickCustModal').addEventListener('click', ()=> quickCustModal.classList.remove('show'));
  document.getElementById('quickCustForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('qc_name').value.trim();
    if(!name) return;
    const newCust = {
      id: uid('cust'),
      userId: user.id,
      name,
      contactPerson: document.getElementById('qc_contact').value.trim(),
      email: document.getElementById('qc_email').value.trim(),
      phone: document.getElementById('qc_phone').value.trim(),
      address: document.getElementById('qc_address').value.trim(),
      taxId: document.getElementById('qc_tax').value.trim(),
      terms: document.getElementById('qc_terms').value.trim()
    };
    let allCusts = getAll(DB.customers);
    allCusts.push(newCust);
    setAll(DB.customers, allCusts);
    savedCustomers = allCusts.filter(c => c.userId === user.id);
    document.getElementById('customerSelect').innerHTML = '<option value="">-- Load Saved Customer --</option>' + getCustOptionsHtml(newCust.id);
    
    // Auto-fill into form
    document.getElementById('c_name').value = newCust.name;
    document.getElementById('c_address').value = newCust.address;
    document.getElementById('c_email').value = newCust.email;
    document.getElementById('c_phone').value = newCust.phone;
    document.getElementById('c_tax').value = newCust.taxId;
    if(newCust.terms) document.getElementById('i_terms').value = newCust.terms;

    quickCustModal.classList.remove('show');
    showToast('Customer profile added & applied.');
  });

  const quickEntModal = document.getElementById('quickEntModal');
  document.getElementById('quickAddEntBtn').addEventListener('click', ()=>{
    document.getElementById('quickEntForm').reset();
    quickEntModal.classList.add('show');
  });
  document.getElementById('closeQuickEntModal').addEventListener('click', ()=> quickEntModal.classList.remove('show'));
  document.getElementById('cancelQuickEntModal').addEventListener('click', ()=> quickEntModal.classList.remove('show'));
  document.getElementById('quickEntForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('qe_name').value.trim();
    if(!name) return;
    const currVal = document.getElementById('qe_currency').value;
    const symMatch = currVal.match(/\((.*?)\)/);
    const currencySymbol = symMatch ? symMatch[1] : '₹';

    const newEnt = {
      id: uid('ent'),
      userId: user.id,
      name,
      tagline: document.getElementById('qe_tagline').value.trim(),
      email: document.getElementById('qe_email').value.trim(),
      phone: document.getElementById('qe_phone').value.trim(),
      address: document.getElementById('qe_address').value.trim(),
      taxId: document.getElementById('qe_tax').value.trim(),
      currency: currVal,
      currencySymbol,
      upiId: document.getElementById('qe_upi').value.trim(),
      paymentUrl: document.getElementById('qe_payurl').value.trim(),
      bankName: document.getElementById('qe_bank').value.trim(),
      accountNumber: document.getElementById('qe_acc').value.trim(),
      ifscCode: document.getElementById('qe_ifsc').value.trim(),
      isDefault: false
    };
    let allEnts = getAll(DB.enterprises);
    allEnts.push(newEnt);
    setAll(DB.enterprises, allEnts);
    savedEnterprises = allEnts.filter(e => e.userId === user.id);
    document.getElementById('enterpriseSelect').innerHTML = '<option value="">-- Load Profile --</option>' + getEntOptionsHtml(newEnt.id);

    // Auto-fill into form
    document.getElementById('s_name').value = newEnt.name;
    document.getElementById('s_address').value = newEnt.address;
    document.getElementById('s_email').value = newEnt.email;
    document.getElementById('s_phone').value = newEnt.phone;
    document.getElementById('s_tax').value = newEnt.taxId;
    document.getElementById('s_upi').value = newEnt.upiId;
    document.getElementById('s_payurl').value = newEnt.paymentUrl;
    document.getElementById('s_bank').value = newEnt.bankName;
    document.getElementById('s_acc').value = newEnt.accountNumber;
    document.getElementById('s_ifsc').value = newEnt.ifscCode;
    document.getElementById('i_currency').value = newEnt.currencySymbol;

    quickEntModal.classList.remove('show');
    showToast('Enterprise profile added & applied.');
    recalcTotals();
  });

  document.getElementById('addItemBtn').addEventListener('click', ()=>{
    builderItems.push(blankItem());
    renderItemsBody();
    recalcTotals();
  });
  document.getElementById('i_discount').addEventListener('input', recalcTotals);
  document.getElementById('i_tax').addEventListener('input', recalcTotals);
  document.getElementById('i_currency').addEventListener('change', recalcTotals);

  document.getElementById('previewBtn').addEventListener('click', ()=> handleSave('Draft', true, bPad));
  document.getElementById('generateBtn').addEventListener('click', ()=> handleSave('Generated', true, bPad));
}

function renderItemsBody(){
  const sym = document.getElementById('i_currency') ? document.getElementById('i_currency').value : '₹';
  const body = document.getElementById('itemsBody');
  body.innerHTML = builderItems.map((item, idx)=> `
    <tr data-idx="${idx}">
      <td><input class="it-name" value="${escapeHTML(item.name)}" placeholder="Service / Product name"></td>
      <td><input class="it-desc" value="${escapeHTML(item.description)}" placeholder="Optional description"></td>
      <td><input class="it-qty mono" type="number" min="0" step="1" value="${item.qty}"></td>
      <td><input class="it-price mono" type="number" min="0" step="0.01" value="${item.price}"></td>
      <td class="item-total mono" id="itemTotal-${item.id}">${fmtMoney(item.qty*item.price, sym)}</td>
      <td class="col-remove"><button type="button" class="remove-item" title="Remove item" data-idx="${idx}">&times;</button></td>
    </tr>`).join('');

  body.querySelectorAll('tr').forEach(tr=>{
    const idx = Number(tr.dataset.idx);
    tr.querySelector('.it-name').addEventListener('input', e=>{ builderItems[idx].name = e.target.value; });
    tr.querySelector('.it-desc').addEventListener('input', e=>{ builderItems[idx].description = e.target.value; });
    tr.querySelector('.it-qty').addEventListener('input', e=>{ builderItems[idx].qty = Number(e.target.value)||0; updateItemRow(idx); });
    tr.querySelector('.it-price').addEventListener('input', e=>{ builderItems[idx].price = Number(e.target.value)||0; updateItemRow(idx); });
  });
  body.querySelectorAll('.remove-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(builderItems.length === 1){ showToast('An invoice needs at least one item.'); return; }
      const idx = Number(btn.dataset.idx);
      builderItems.splice(idx,1);
      renderItemsBody();
      recalcTotals();
    });
  });
}

function updateItemRow(idx){
  const sym = document.getElementById('i_currency') ? document.getElementById('i_currency').value : '₹';
  const item = builderItems[idx];
  const cell = document.getElementById('itemTotal-'+item.id);
  if(cell) cell.textContent = fmtMoney(item.qty * item.price, sym);
  recalcTotals();
}

function computeTotals(items, discountPct, taxPct){
  const subtotal = items.reduce((s,i)=> s + (Number(i.qty)||0)*(Number(i.price)||0), 0);
  const discount = subtotal * (Number(discountPct)||0) / 100;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * (Number(taxPct)||0) / 100;
  const grandTotal = subtotal - discount + tax;
  return { subtotal, discount, tax, grandTotal };
}

function recalcTotals(){
  const sym = document.getElementById('i_currency') ? document.getElementById('i_currency').value : '₹';
  const discountPct = Number(document.getElementById('i_discount').value)||0;
  const taxPct = Number(document.getElementById('i_tax').value)||0;
  const { subtotal, discount, tax, grandTotal } = computeTotals(builderItems, discountPct, taxPct);
  document.getElementById('t_subtotal').textContent = fmtMoney(subtotal, sym);
  document.getElementById('t_discount').textContent = '−' + fmtMoney(discount, sym);
  document.getElementById('t_tax').textContent = '+' + fmtMoney(tax, sym);
  document.getElementById('t_grand').textContent = fmtMoney(grandTotal, sym);
}

function nextInvoiceNumber(userId){
  const count = getAll(DB.invoices).filter(i=>i.userId===userId).length;
  const year = new Date().getFullYear();
  return `INV-${year}-${String(count+1).padStart(3,'0')}`;
}

function handleSave(status, goToPreview, bPad){
  const msg = document.getElementById('createMsg');
  msg.className = 'form-msg';

  const cNameField = document.getElementById('f-c_name');
  cNameField.classList.remove('has-error');
  const customerName = document.getElementById('c_name').value.trim();

  const cleanItems = builderItems
    .map(i=>({...i, name: i.name.trim()}))
    .filter(i => i.name || i.qty || i.price);

  let valid = true;
  if(!customerName){ cNameField.classList.add('has-error'); valid = false; }
  if(cleanItems.length === 0){
    msg.textContent = 'Add at least one product or service with a name.';
    msg.className = 'form-msg error show';
    valid = false;
  }
  const hasInvalidQtyPrice = cleanItems.some(i => Number(i.qty) < 0 || Number(i.price) < 0 || isNaN(i.qty) || isNaN(i.price));
  if(hasInvalidQtyPrice){
    msg.textContent = 'Quantity and price must be valid, non-negative numbers.';
    msg.className = 'form-msg error show';
    valid = false;
  }
  if(!valid){
    if(!msg.textContent){ msg.textContent = 'Please fix the highlighted fields before continuing.'; msg.className = 'form-msg error show'; }
    return;
  }

  const user = currentUser();
  const discountPct = Number(document.getElementById('i_discount').value)||0;
  const taxPct = Number(document.getElementById('i_tax').value)||0;
  const currencySymbol = document.getElementById('i_currency').value;
  const totals = computeTotals(cleanItems, discountPct, taxPct);

  const invoices = getAll(DB.invoices);
  const existingIdx = builderEditId ? invoices.findIndex(i=>i.id===builderEditId) : -1;
  const existingInv = existingIdx >= 0 ? invoices[existingIdx] : null;

  const invoiceSignature = (bPad && !bPad.isEmpty()) ? bPad.toDataURL() : (user.signature || (existingInv ? existingInv.signature : '') || '');

  const invoiceData = {
    id: builderEditId || uid('inv'),
    userId: user.id,
    currencySymbol,
    invoiceNumber: document.getElementById('i_number').value.trim() || nextInvoiceNumber(user.id),
    invoiceDate: document.getElementById('i_date').value || todayISO(),
    dueDate: document.getElementById('i_due').value || '',
    seller: {
      name: document.getElementById('s_name').value.trim(),
      address: document.getElementById('s_address').value.trim(),
      email: document.getElementById('s_email').value.trim(),
      phone: document.getElementById('s_phone').value.trim(),
      taxId: document.getElementById('s_tax').value.trim(),
      upiId: document.getElementById('s_upi').value.trim(),
      paymentUrl: document.getElementById('s_payurl').value.trim(),
      bankName: document.getElementById('s_bank').value.trim(),
      accountNumber: document.getElementById('s_acc').value.trim(),
      ifscCode: document.getElementById('s_ifsc').value.trim(),
    },
    customer: {
      name: customerName,
      address: document.getElementById('c_address').value.trim(),
      email: document.getElementById('c_email').value.trim(),
      phone: document.getElementById('c_phone').value.trim(),
      taxId: document.getElementById('c_tax').value.trim(),
    },
    items: cleanItems,
    discountPct, taxPct,
    subtotal: totals.subtotal, discount: totals.discount, tax: totals.tax, grandTotal: totals.grandTotal,
    paymentTerms: document.getElementById('i_terms').value.trim(),
    notes: document.getElementById('i_notes').value.trim(),
    status: existingInv ? existingInv.status : status,
    paidAt: existingInv ? existingInv.paidAt : null,
    paymentMethod: existingInv ? existingInv.paymentMethod : '',
    transactionRef: existingInv ? existingInv.transactionRef : '',
    paidMessage: existingInv ? existingInv.paidMessage : '',
    createdAt: existingInv ? existingInv.createdAt : Date.now(),
    signature: invoiceSignature
  };

  if(existingIdx >= 0){ invoices[existingIdx] = invoiceData; } else { invoices.push(invoiceData); }
  setAll(DB.invoices, invoices);
  showToast(status === 'Generated' ? 'Invoice generated.' : 'Invoice saved.');
  if(goToPreview){ location.hash = '#/preview?id=' + invoiceData.id; }
}

/* ================================================================
   VIEW: PREVIEW (With Paid Watermark, Settlement Banner & Payment Modal)
   ================================================================ */
function renderPreview(params){
  const user = currentUser();
  const id = params.get('id');
  let invoices = getAll(DB.invoices);
  let invoice = invoices.find(i => i.id === id && i.userId === user.id);

  if(!invoice){
    document.getElementById('app').innerHTML = appShell('/history', 'Invoice not found', 'Preview',
      `<p>We couldn't find that invoice. It may have been deleted.</p><a class="btn btn-primary" href="#/history">Back to history</a>`);
    mountShellEvents();
    return;
  }

  const sym = invoice.currencySymbol || '₹';
  const isPaid = (invoice.status === 'Paid');

  const itemsRows = invoice.items.map(it => `
    <tr>
      <td class="desc-cell">${escapeHTML(it.name)}${it.description ? `<div class="item-desc">${escapeHTML(it.description)}</div>` : ''}</td>
      <td class="num">${it.qty}</td>
      <td class="num">${fmtMoney(it.price, sym)}</td>
      <td class="num">${fmtMoney(it.qty*it.price, sym)}</td>
    </tr>`).join('');

  const statusOptions = ['Draft','Generated','Pending','Paid'].map(s=>
    `<option value="${s}" ${invoice.status===s?'selected':''}>${s}</option>`).join('');

  const qrTarget = getPaymentQrTarget(invoice);
  const isCustomUrl = !!(invoice.seller && invoice.seller.paymentUrl);

  const paidBannerHTML = isPaid ? `
    <div class="paid-receipt-banner">
      <div class="banner-head">
        <div class="banner-title">
          <span style="font-size:18px;">✓</span> Payment Received &amp; Settled
        </div>
        <div class="banner-badge">OFFICIAL RECEIPT</div>
      </div>
      <div class="banner-msg">
        "${escapeHTML(invoice.paidMessage || 'Payment received with thanks. This invoice is officially settled in full.')}"
      </div>
      <div class="banner-meta">
        <div class="meta-col">
          <div class="lbl">Amount Settled</div>
          <div class="val">${fmtMoney(invoice.grandTotal, sym)}</div>
        </div>
        <div class="meta-col">
          <div class="lbl">Payment Date</div>
          <div class="val">${fmtDate(invoice.paidAt || invoice.invoiceDate)}</div>
        </div>
        <div class="meta-col">
          <div class="lbl">Payment Method</div>
          <div class="val">${escapeHTML(invoice.paymentMethod || 'Direct Payment')}</div>
        </div>
        ${invoice.transactionRef ? `
        <div class="meta-col">
          <div class="lbl">Transaction / UTR Ref</div>
          <div class="val">${escapeHTML(invoice.transactionRef)}</div>
        </div>` : ''}
      </div>
    </div>` : '';

  const sheet = `
    <div class="invoice-sheet" id="invoiceSheet">
      ${isPaid ? `<div class="paid-watermark">PAID</div>` : ''}

      <div class="inv-head">
        <div>
          <p class="biz-name">${escapeHTML(invoice.seller.name || 'Your Business')}</p>
          <div class="biz-meta">
            ${escapeHTML(invoice.seller.address || '')}<br>
            ${escapeHTML(invoice.seller.email || '')}${invoice.seller.email && invoice.seller.phone ? ' · ' : ''}${escapeHTML(invoice.seller.phone || '')}
            ${invoice.seller.taxId ? `<br><strong>Tax ID / GSTIN:</strong> ${escapeHTML(invoice.seller.taxId)}` : ''}
          </div>
        </div>
        <div class="inv-head-right">
          <p class="inv-title">INVOICE</p>
          <div class="inv-num">${escapeHTML(invoice.invoiceNumber)}</div>
        </div>
      </div>

      <div class="inv-meta-grid">
        <div><div class="label">Invoice Date</div><div class="val mono">${fmtDate(invoice.invoiceDate)}</div></div>
        <div><div class="label">Due Date</div><div class="val mono">${fmtDate(invoice.dueDate)}</div></div>
        <div><div class="label">Status</div><div class="val"><span class="stamp ${invoice.status.toLowerCase()}">${invoice.status}</span></div></div>
      </div>

      ${paidBannerHTML}

      <div class="bill-to">
        <div class="label">Bill To</div>
        <div class="cust-name">${escapeHTML(invoice.customer.name)}</div>
        <div class="cust-meta">
          ${escapeHTML(invoice.customer.address || '')}<br>
          ${escapeHTML(invoice.customer.email || '')}${invoice.customer.email && invoice.customer.phone ? ' · ' : ''}${escapeHTML(invoice.customer.phone || '')}
          ${invoice.customer.taxId ? `<br><strong>Tax ID / GSTIN:</strong> ${escapeHTML(invoice.customer.taxId)}` : ''}
        </div>
      </div>

      <table class="inv-items">
        <thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Unit Price</th><th class="num">Total</th></tr></thead>
        <tbody>${itemsRows}</tbody>
      </table>

      <div class="inv-totals">
        <div class="row"><span>Subtotal</span><span class="amt">${fmtMoney(invoice.subtotal, sym)}</span></div>
        <div class="row"><span>Discount (${invoice.discountPct}%)</span><span class="amt">−${fmtMoney(invoice.discount, sym)}</span></div>
        <div class="row"><span>Tax (${invoice.taxPct}%)</span><span class="amt">+${fmtMoney(invoice.tax, sym)}</span></div>
        <div class="row grand"><span>Grand Total</span><span class="amt">${fmtMoney(invoice.grandTotal, sym)}</span></div>
      </div>

      <div class="inv-foot">
        <div class="block"><div class="label">Payment Terms</div>${escapeHTML(invoice.paymentTerms || '—')}</div>
        <div class="block"><div class="label">Notes</div>${escapeHTML(invoice.notes || '—')}</div>
      </div>

      <div class="inv-pay-sign">
        <div class="pay-block-container">
          ${qrTarget && !isPaid ? `
          <div class="pay-block">
            <div class="label">${isCustomUrl ? 'Scan to Pay Link' : 'Scan to Pay (UPI)'}</div>
            <img src="${qrImageUrl(qrTarget, 200)}" alt="Payment QR code" width="110" height="110">
            <div class="upi-id">${escapeHTML(invoice.seller.upiId || 'Scan with any App')}</div>
          </div>` : ''}

          ${(invoice.seller.bankName || invoice.seller.accountNumber) ? `
          <div class="pay-details-box">
            <div class="label" style="margin-bottom:4px;font-size:10px;text-transform:uppercase;font-weight:700;color:#7c8c85;">${isPaid ? 'Settlement Account' : 'Direct Bank Transfer'}</div>
            ${invoice.seller.bankName ? `<div><strong>Bank:</strong> ${escapeHTML(invoice.seller.bankName)}</div>` : ''}
            ${invoice.seller.accountNumber ? `<div><strong>A/C No:</strong> <span class="mono">${escapeHTML(invoice.seller.accountNumber)}</span></div>` : ''}
            ${invoice.seller.ifscCode ? `<div><strong>IFSC/SWIFT:</strong> <span class="mono">${escapeHTML(invoice.seller.ifscCode)}</span></div>` : ''}
          </div>` : ''}
        </div>

        <div class="sign-block">
          <div class="sig-slot">${invoice.signature ? `<img src="${invoice.signature}" class="sig-img" alt="Authorised signature">` : ''}</div>
          <div class="sig-line"></div>
          <div class="sig-label">Authorised Signature</div>
          <div class="sig-name">${escapeHTML(invoice.seller.name || '')}</div>
        </div>
      </div>
    </div>`;

  const emailSubject = isPaid 
    ? `Payment Receipt for Invoice ${invoice.invoiceNumber} from ${invoice.seller.name || 'Merchant'}`
    : `Invoice ${invoice.invoiceNumber} from ${invoice.seller.name || 'Merchant'}`;

  const emailBody = isPaid
    ? `Dear ${invoice.customer.name},\n\nThank you for your payment! Here is your official receipt for Invoice ${invoice.invoiceNumber}.\n\n` +
      `Amount Paid: ${fmtMoney(invoice.grandTotal, sym)}\n` +
      `Payment Date: ${fmtDate(invoice.paidAt || invoice.invoiceDate)}\n` +
      `Payment Method: ${invoice.paymentMethod || 'Direct Payment'}\n` +
      (invoice.transactionRef ? `Transaction Ref: ${invoice.transactionRef}\n` : '') +
      `\nMessage: ${invoice.paidMessage || 'Thank you for your business!'}\n\nBest regards,\n${invoice.seller.name || ''}`
    : `Dear ${invoice.customer.name},\n\nPlease find the details for Invoice ${invoice.invoiceNumber}.\n\n` +
      `Amount Due: ${fmtMoney(invoice.grandTotal, sym)}\nDue Date: ${fmtDate(invoice.dueDate)}\n\n` +
      (invoice.seller.upiId ? `Pay via UPI: ${invoice.seller.upiId}\n` : '') +
      (invoice.seller.paymentUrl ? `Pay Online: ${invoice.seller.paymentUrl}\n` : '') +
      `\nThank you for your business!\n\nBest regards,\n${invoice.seller.name || ''}`;

  const content = `
    <div class="preview-toolbar no-print">
      <div class="left">
        <a href="#/edit?id=${invoice.id}" class="btn btn-ghost btn-sm">Edit Invoice</a>
        <select id="statusSelect" class="btn btn-ghost btn-sm" style="padding:7px 10px;">${statusOptions}</select>
        <button class="btn ${isPaid ? 'btn-ghost' : 'btn-success'} btn-sm" id="recordPaymentBtn">
          ${isPaid ? '⚙ Payment Details' : '✓ Record Payment / Mark Paid'}
        </button>
      </div>
      <div class="left">
        <button class="btn btn-ghost btn-sm" id="emailBtn">✉ Email ${isPaid ? 'Receipt' : 'Invoice'}</button>
        <button class="btn btn-ghost btn-sm" id="backBtn">Back to Invoices</button>
        <button class="btn btn-primary btn-sm" id="printBtn">Print / Save as PDF</button>
      </div>
    </div>
    ${sheet}

    <!-- Record Payment Modal -->
    <div class="modal-overlay" id="paymentModal">
      <div class="modal-card">
        <div class="modal-head">
          <h2>${isPaid ? 'Edit Payment & Receipt Details' : 'Record Payment & Display Paid Message'}</h2>
          <button class="modal-close" id="closePaymentModal">&times;</button>
        </div>
        <form id="paymentForm">
          <div class="field">
            <label>Payment Status</label>
            <select id="pay_status">
              <option value="Paid" selected>Paid (Confirmed &amp; Settled)</option>
              <option value="Pending">Pending</option>
              <option value="Generated">Generated</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Payment Date</label>
              <input type="date" id="pay_date" value="${invoice.paidAt || todayISO()}">
            </div>
            <div class="field">
              <label>Payment Method</label>
              <select id="pay_method">
                <option value="UPI / QR Code" ${invoice.paymentMethod==='UPI / QR Code'?'selected':''}>UPI / QR Code</option>
                <option value="Bank Transfer (NEFT/IMPS)" ${invoice.paymentMethod==='Bank Transfer (NEFT/IMPS)'?'selected':''}>Bank Transfer (NEFT/IMPS)</option>
                <option value="Credit / Debit Card" ${invoice.paymentMethod==='Credit / Debit Card'?'selected':''}>Credit / Debit Card</option>
                <option value="Net Banking" ${invoice.paymentMethod==='Net Banking'?'selected':''}>Net Banking</option>
                <option value="Cash" ${invoice.paymentMethod==='Cash'?'selected':''}>Cash</option>
                <option value="Cheque" ${invoice.paymentMethod==='Cheque'?'selected':''}>Cheque</option>
                <option value="Online Payment Gateway" ${invoice.paymentMethod==='Online Payment Gateway'?'selected':''}>Online Payment Gateway</option>
                <option value="Other" ${invoice.paymentMethod==='Other'?'selected':''}>Other</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>Transaction Reference / UTR / Cheque Number</label>
            <input id="pay_ref" value="${escapeHTML(invoice.transactionRef || '')}" placeholder="e.g. UPI-42891002345 or CHQ-991201">
          </div>
          <div class="field">
            <label>Paid Message / Receipt Acknowledgement Note</label>
            <textarea id="pay_msg" rows="3" placeholder="Custom note to display on the invoice receipt">${escapeHTML(invoice.paidMessage || `Payment of ${fmtMoney(invoice.grandTotal, sym)} received in full with thanks. This invoice is officially settled.`)}</textarea>
          </div>
          <div class="form-actions" style="margin-top:20px;">
            <button type="button" class="btn btn-ghost" id="cancelPaymentModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save &amp; Display Receipt</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Email Modal -->
    <div class="modal-overlay" id="emailModal">
      <div class="modal-card">
        <div class="modal-head">
          <h2>Email ${isPaid ? 'Payment Receipt' : 'Invoice'} to Client</h2>
          <button class="modal-close" id="closeEmailModal">&times;</button>
        </div>
        <div class="field">
          <label>Recipient Email</label>
          <input id="em_to" type="email" value="${escapeHTML(invoice.customer.email || '')}" placeholder="client@email.com">
        </div>
        <div class="field">
          <label>Subject</label>
          <input id="em_subj" value="${escapeHTML(emailSubject)}">
        </div>
        <div class="field">
          <label>Message Body</label>
          <textarea id="em_body" rows="8">${escapeHTML(emailBody)}</textarea>
        </div>
        <div class="form-actions" style="margin-top:20px;">
          <button type="button" class="btn btn-ghost" id="copyEmailBtn">Copy Email Content</button>
          <a class="btn btn-primary" id="openMailClientBtn" target="_blank">Open Mail App (mailto:)</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('app').innerHTML = appShell('/history', 'Invoice Preview', 'Preview & Receipt', content);
  mountShellEvents();

  document.getElementById('printBtn').addEventListener('click', ()=> window.print());
  document.getElementById('backBtn').addEventListener('click', ()=> location.hash = '#/history');
  
  // Payment Modal Events
  const paymentModal = document.getElementById('paymentModal');
  document.getElementById('recordPaymentBtn').addEventListener('click', ()=> paymentModal.classList.add('show'));
  document.getElementById('closePaymentModal').addEventListener('click', ()=> paymentModal.classList.remove('show'));
  document.getElementById('cancelPaymentModal').addEventListener('click', ()=> paymentModal.classList.remove('show'));
  
  document.getElementById('paymentForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const newStatus = document.getElementById('pay_status').value;
    const paidAt = document.getElementById('pay_date').value;
    const paymentMethod = document.getElementById('pay_method').value;
    const transactionRef = document.getElementById('pay_ref').value.trim();
    const paidMessage = document.getElementById('pay_msg').value.trim();

    invoices = getAll(DB.invoices);
    const idx = invoices.findIndex(i=>i.id===invoice.id);
    if(idx >= 0){
      invoices[idx] = {
        ...invoices[idx],
        status: newStatus,
        paidAt: newStatus === 'Paid' ? (paidAt || todayISO()) : null,
        paymentMethod: newStatus === 'Paid' ? paymentMethod : '',
        transactionRef: newStatus === 'Paid' ? transactionRef : '',
        paidMessage: newStatus === 'Paid' ? paidMessage : ''
      };
      setAll(DB.invoices, invoices);
      paymentModal.classList.remove('show');
      showToast(newStatus === 'Paid' ? 'Payment recorded! Paid message displayed.' : 'Invoice status updated.');
      renderPreview(params);
    }
  });

  // Email Modal Events
  const emailModal = document.getElementById('emailModal');
  const openMailClientBtn = document.getElementById('openMailClientBtn');

  function updateMailtoLink(){
    const to = document.getElementById('em_to').value.trim();
    const subj = document.getElementById('em_subj').value;
    const body = document.getElementById('em_body').value;
    openMailClientBtn.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  }

  document.getElementById('emailBtn').addEventListener('click', ()=>{
    updateMailtoLink();
    emailModal.classList.add('show');
  });
  document.getElementById('closeEmailModal').addEventListener('click', ()=> emailModal.classList.remove('show'));
  document.getElementById('em_to').addEventListener('input', updateMailtoLink);
  document.getElementById('em_subj').addEventListener('input', updateMailtoLink);
  document.getElementById('em_body').addEventListener('input', updateMailtoLink);

  document.getElementById('copyEmailBtn').addEventListener('click', ()=>{
    const body = document.getElementById('em_body').value;
    navigator.clipboard.writeText(body);
    showToast('Email text copied to clipboard!');
  });

  document.getElementById('statusSelect').addEventListener('change', (e)=>{
    const selectedVal = e.target.value;
    if(selectedVal === 'Paid'){
      document.getElementById('pay_status').value = 'Paid';
      paymentModal.classList.add('show');
    } else {
      invoices = getAll(DB.invoices);
      const idx = invoices.findIndex(i=>i.id===invoice.id);
      if(idx>=0){ 
        invoices[idx].status = selectedVal; 
        setAll(DB.invoices, invoices); 
        showToast('Status updated to ' + selectedVal + '.');
        renderPreview(params);
      }
    }
  });
}

/* ================================================================
   VIEW: HISTORY / ALL INVOICES
   ================================================================ */
function renderHistory(){
  const user = currentUser();
  const content = `
    <div class="filter-bar">
      <input type="text" id="searchInput" placeholder="Search by invoice number or customer name...">
      <select id="statusFilter">
        <option value="">All statuses</option>
        <option value="Draft">Draft</option>
        <option value="Generated">Generated</option>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
      </select>
      <input type="date" id="dateFilter" title="Filter by invoice date">
    </div>
    <div class="card" style="padding:22px 24px;">
      <table class="ledger-table">
        <thead><tr><th>Invoice #</th><th>Customer</th><th>Date</th><th class="num">Amount</th><th>Status</th></tr></thead>
        <tbody id="historyBody"></tbody>
      </table>
    </div>`;

  document.getElementById('app').innerHTML = appShell('/history', 'Invoice History', 'All Invoices', content);
  mountShellEvents();

  function draw(){
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const date = document.getElementById('dateFilter').value;
    let invoices = getAll(DB.invoices).filter(i => i.userId === user.id);
    if(q){
      invoices = invoices.filter(i => i.invoiceNumber.toLowerCase().includes(q) || i.customer.name.toLowerCase().includes(q));
    }
    if(status){ invoices = invoices.filter(i => i.status === status); }
    if(date){ invoices = invoices.filter(i => i.invoiceDate === date); }
    invoices.sort((a,b)=> b.createdAt - a.createdAt);

    const body = document.getElementById('historyBody');
    body.innerHTML = invoices.length ? invoices.map(rowHTML).join('') :
      `<tr class="empty-row"><td colspan="5">No invoices match your search.</td></tr>`;
    body.querySelectorAll('tr[data-id]').forEach(tr=>{
      tr.addEventListener('click', ()=> location.hash = '#/preview?id='+tr.dataset.id);
    });
  }

  document.getElementById('searchInput').addEventListener('input', draw);
  document.getElementById('statusFilter').addEventListener('change', draw);
  document.getElementById('dateFilter').addEventListener('change', draw);
  draw();
}

/* ================================================================
   VIEW: CUSTOMER PROFILES MANAGEMENT (`/customers`)
   ================================================================ */
function renderCustomers(){
  const user = currentUser();
  const content = `
    <div class="filter-bar">
      <input type="text" id="custSearch" placeholder="Search customers by name, contact, or email...">
      <button class="btn btn-primary" id="addCustBtn">+ Add Customer</button>
    </div>
    <div class="directory-grid" id="custGrid"></div>

    <!-- Add/Edit Customer Modal -->
    <div class="modal-overlay" id="custModal">
      <div class="modal-card">
        <div class="modal-head">
          <h2 id="custModalTitle">Add Customer Profile</h2>
          <button class="modal-close" id="closeCustModal">&times;</button>
        </div>
        <form id="custForm">
          <input type="hidden" id="c_id">
          <div class="field"><label>Company / Customer Name *</label><input id="mc_name" required placeholder="Acme Inc."></div>
          <div class="field"><label>Contact Person</label><input id="mc_contact" placeholder="Jane Doe"></div>
          <div class="field-row">
            <div class="field"><label>Email</label><input id="mc_email" type="email" placeholder="billing@acme.com"></div>
            <div class="field"><label>Phone</label><input id="mc_phone" placeholder="+91 98765 43210"></div>
          </div>
          <div class="field"><label>Address</label><input id="mc_address" placeholder="123 Business Way, City, State"></div>
          <div class="field-row">
            <div class="field"><label>GSTIN / Tax ID</label><input id="mc_tax" placeholder="27AAAAA0000A1Z5"></div>
            <div class="field"><label>Default Payment Terms</label><input id="mc_terms" placeholder="Net 15 Days"></div>
          </div>
          <div class="form-actions" style="margin-top:20px;">
            <button type="button" class="btn btn-ghost" id="cancelCustModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Customer</button>
          </div>
        </form>
      </div>
    </div>`;

  document.getElementById('app').innerHTML = appShell('/customers', 'Customer Directory', 'Profiles', content);
  mountShellEvents();

  function draw(){
    const q = document.getElementById('custSearch').value.trim().toLowerCase();
    let customers = getAll(DB.customers).filter(c => c.userId === user.id);
    if(q){
      customers = customers.filter(c => c.name.toLowerCase().includes(q) || (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) || (c.email && c.email.toLowerCase().includes(q)));
    }

    const grid = document.getElementById('custGrid');
    if(!customers.length){
      grid.innerHTML = `<div class="card" style="grid-column:1/-1;padding:40px;text-align:center;color:var(--ink-soft);">No customers found. Click "+ Add Customer" to create one.</div>`;
      return;
    }

    grid.innerHTML = customers.map(c => `
      <div class="card dir-card">
        <div>
          <div class="title">${escapeHTML(c.name)}</div>
          ${c.contactPerson ? `<div class="subtitle">Contact: ${escapeHTML(c.contactPerson)}</div>` : ''}
          ${c.email ? `<div class="meta-item">✉ ${escapeHTML(c.email)}</div>` : ''}
          ${c.phone ? `<div class="meta-item">📞 ${escapeHTML(c.phone)}</div>` : ''}
          ${c.address ? `<div class="meta-item">📍 ${escapeHTML(c.address)}</div>` : ''}
          ${c.taxId ? `<div class="meta-item">💳 GST/Tax: <span class="mono">${escapeHTML(c.taxId)}</span></div>` : ''}
        </div>
        <div class="card-actions">
          <a href="#/create?cust_id=${c.id}" class="btn btn-primary btn-sm" style="text-decoration:none;">+ Invoice</a>
          <button class="btn btn-ghost btn-sm edit-c-btn" data-id="${c.id}">Edit</button>
          <button class="btn btn-danger btn-sm del-c-btn" data-id="${c.id}">Delete</button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.edit-c-btn').forEach(b => b.addEventListener('click', () => openCustModal(b.dataset.id)));
    grid.querySelectorAll('.del-c-btn').forEach(b => b.addEventListener('click', () => deleteCustomer(b.dataset.id)));
  }

  const modal = document.getElementById('custModal');
  document.getElementById('addCustBtn').addEventListener('click', () => openCustModal());
  document.getElementById('closeCustModal').addEventListener('click', () => modal.classList.remove('show'));
  document.getElementById('cancelCustModal').addEventListener('click', () => modal.classList.remove('show'));

  function openCustModal(id){
    const title = document.getElementById('custModalTitle');
    title.textContent = id ? 'Edit Customer Profile' : 'Add Customer Profile';
    document.getElementById('c_id').value = id || '';

    if(id){
      const c = getAll(DB.customers).find(item => item.id === id);
      if(c){
        document.getElementById('mc_name').value = c.name || '';
        document.getElementById('mc_contact').value = c.contactPerson || '';
        document.getElementById('mc_email').value = c.email || '';
        document.getElementById('mc_phone').value = c.phone || '';
        document.getElementById('mc_address').value = c.address || '';
        document.getElementById('mc_tax').value = c.taxId || '';
        document.getElementById('mc_terms').value = c.terms || '';
      }
    } else {
      document.getElementById('custForm').reset();
      document.getElementById('c_id').value = '';
    }
    modal.classList.add('show');
  }

  function deleteCustomer(id){
    if(!confirm('Are you sure you want to delete this customer profile?')) return;
    let customers = getAll(DB.customers).filter(c => c.id !== id);
    setAll(DB.customers, customers);
    showToast('Customer deleted.');
    draw();
  }

  document.getElementById('custForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('c_id').value;
    const name = document.getElementById('mc_name').value.trim();
    if(!name) return;

    let customers = getAll(DB.customers);
    const data = {
      id: id || uid('cust'),
      userId: user.id,
      name,
      contactPerson: document.getElementById('mc_contact').value.trim(),
      email: document.getElementById('mc_email').value.trim(),
      phone: document.getElementById('mc_phone').value.trim(),
      address: document.getElementById('mc_address').value.trim(),
      taxId: document.getElementById('mc_tax').value.trim(),
      terms: document.getElementById('mc_terms').value.trim()
    };

    if(id){
      const idx = customers.findIndex(c => c.id === id);
      if(idx >= 0) customers[idx] = data;
    } else {
      customers.push(data);
    }

    setAll(DB.customers, customers);
    modal.classList.remove('show');
    showToast(id ? 'Customer updated.' : 'Customer added.');
    draw();
  });

  document.getElementById('custSearch').addEventListener('input', draw);
  draw();
}

/* ================================================================
   VIEW: ENTERPRISE PROFILES MANAGEMENT (`/enterprise`)
   ================================================================ */
function renderEnterprise(){
  const user = currentUser();
  const content = `
    <div class="filter-bar">
      <input type="text" id="entSearch" placeholder="Search enterprise profiles...">
      <button class="btn btn-primary" id="addEntBtn">+ Add Enterprise Profile</button>
    </div>
    <div class="directory-grid" id="entGrid"></div>

    <!-- Enterprise Modal -->
    <div class="modal-overlay" id="entModal">
      <div class="modal-card">
        <div class="modal-head">
          <h2 id="entModalTitle">Add Enterprise Profile</h2>
          <button class="modal-close" id="closeEntModal">&times;</button>
        </div>
        <form id="entForm">
          <input type="hidden" id="e_id">
          <div class="field"><label>Enterprise / Business Name *</label><input id="me_name" required placeholder="Acme Global Solutions"></div>
          <div class="field"><label>Tagline / Description</label><input id="me_tagline" placeholder="Premium Consulting Services"></div>
          <div class="field-row">
            <div class="field"><label>Business Email</label><input id="me_email" type="email" placeholder="billing@acme.com"></div>
            <div class="field"><label>Business Phone</label><input id="me_phone" placeholder="+91 98765 43210"></div>
          </div>
          <div class="field"><label>Business Address</label><input id="me_address" placeholder="100 Tech Park, Suite 400"></div>
          <div class="field-row">
            <div class="field"><label>GSTIN / Tax ID</label><input id="me_tax" placeholder="27AAAAA0000A1Z5"></div>
            <div class="field">
              <label>Default Currency</label>
              <select id="me_currency">
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>
          </div>

          <h3 style="font-size:14px;margin:20px 0 10px;text-transform:uppercase;color:var(--brass-dark);">Payment &amp; QR Settings</h3>
          <div class="field-row">
            <div class="field"><label>UPI ID (for Payment QR)</label><input id="me_upi" placeholder="yourname@upi"></div>
            <div class="field"><label>Custom Checkout URL</label><input id="me_payurl" placeholder="https://pay.example.com"></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Bank Name</label><input id="me_bank" placeholder="HDFC Bank"></div>
            <div class="field"><label>Account Number</label><input id="me_acc" class="mono" placeholder="50200012345"></div>
            <div class="field"><label>IFSC/SWIFT</label><input id="me_ifsc" class="mono" placeholder="HDFC0000123"></div>
          </div>

          <div class="field" style="margin-top:10px;">
            <label><input type="checkbox" id="me_isdefault"> Set as Default Enterprise Profile</label>
          </div>

          <div class="form-actions" style="margin-top:20px;">
            <button type="button" class="btn btn-ghost" id="cancelEntModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Profile</button>
          </div>
        </form>
      </div>
    </div>`;

  document.getElementById('app').innerHTML = appShell('/enterprise', 'Enterprise Profiles', 'Multi-Business', content);
  mountShellEvents();

  function draw(){
    const q = document.getElementById('entSearch').value.trim().toLowerCase();
    let enterprises = getAll(DB.enterprises).filter(e => e.userId === user.id);
    if(q){
      enterprises = enterprises.filter(e => e.name.toLowerCase().includes(q) || (e.email && e.email.toLowerCase().includes(q)));
    }

    const grid = document.getElementById('entGrid');
    if(!enterprises.length){
      grid.innerHTML = `<div class="card" style="grid-column:1/-1;padding:40px;text-align:center;color:var(--ink-soft);">No enterprise profiles found. Click "+ Add Enterprise Profile" to create one.</div>`;
      return;
    }

    grid.innerHTML = enterprises.map(e => `
      <div class="card dir-card">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div class="title">${escapeHTML(e.name)}</div>
            ${e.isDefault ? `<span class="badge">Default</span>` : ''}
          </div>
          ${e.tagline ? `<div class="subtitle">${escapeHTML(e.tagline)}</div>` : ''}
          ${e.email ? `<div class="meta-item">✉ ${escapeHTML(e.email)}</div>` : ''}
          ${e.phone ? `<div class="meta-item">📞 ${escapeHTML(e.phone)}</div>` : ''}
          ${e.upiId ? `<div class="meta-item">📱 UPI: <span class="mono">${escapeHTML(e.upiId)}</span></div>` : ''}
          ${e.bankName ? `<div class="meta-item">🏦 ${escapeHTML(e.bankName)} (${escapeHTML(e.accountNumber || '')})</div>` : ''}
        </div>
        <div class="card-actions">
          <a href="#/create?ent_id=${e.id}" class="btn btn-primary btn-sm" style="text-decoration:none;">+ Invoice</a>
          <button class="btn btn-ghost btn-sm edit-e-btn" data-id="${e.id}">Edit</button>
          ${!e.isDefault ? `<button class="btn btn-ghost btn-sm default-e-btn" data-id="${e.id}">Make Default</button>` : ''}
          <button class="btn btn-danger btn-sm del-e-btn" data-id="${e.id}">Delete</button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.edit-e-btn').forEach(b => b.addEventListener('click', () => openEntModal(b.dataset.id)));
    grid.querySelectorAll('.default-e-btn').forEach(b => b.addEventListener('click', () => setDefaultEnt(b.dataset.id)));
    grid.querySelectorAll('.del-e-btn').forEach(b => b.addEventListener('click', () => deleteEnt(b.dataset.id)));
  }

  const modal = document.getElementById('entModal');
  document.getElementById('addEntBtn').addEventListener('click', () => openEntModal());
  document.getElementById('closeEntModal').addEventListener('click', () => modal.classList.remove('show'));
  document.getElementById('cancelEntModal').addEventListener('click', () => modal.classList.remove('show'));

  function openEntModal(id){
    const title = document.getElementById('entModalTitle');
    title.textContent = id ? 'Edit Enterprise Profile' : 'Add Enterprise Profile';
    document.getElementById('e_id').value = id || '';

    if(id){
      const e = getAll(DB.enterprises).find(item => item.id === id);
      if(e){
        document.getElementById('me_name').value = e.name || '';
        document.getElementById('me_tagline').value = e.tagline || '';
        document.getElementById('me_email').value = e.email || '';
        document.getElementById('me_phone').value = e.phone || '';
        document.getElementById('me_address').value = e.address || '';
        document.getElementById('me_tax').value = e.taxId || '';
        document.getElementById('me_currency').value = e.currency || 'INR (₹)';
        document.getElementById('me_upi').value = e.upiId || '';
        document.getElementById('me_payurl').value = e.paymentUrl || '';
        document.getElementById('me_bank').value = e.bankName || '';
        document.getElementById('me_acc').value = e.accountNumber || '';
        document.getElementById('me_ifsc').value = e.ifscCode || '';
        document.getElementById('me_isdefault').checked = !!e.isDefault;
      }
    } else {
      document.getElementById('entForm').reset();
      document.getElementById('e_id').value = '';
    }
    modal.classList.add('show');
  }

  function setDefaultEnt(id){
    let enterprises = getAll(DB.enterprises);
    enterprises.forEach(e => e.isDefault = (e.id === id));
    setAll(DB.enterprises, enterprises);
    showToast('Default enterprise profile updated.');
    draw();
  }

  function deleteEnt(id){
    let enterprises = getAll(DB.enterprises);
    if(enterprises.length === 1){
      showToast('You must keep at least one enterprise profile.');
      return;
    }
    if(!confirm('Delete this enterprise profile?')) return;
    enterprises = enterprises.filter(e => e.id !== id);
    if(!enterprises.some(e => e.isDefault) && enterprises.length){
      enterprises[0].isDefault = true;
    }
    setAll(DB.enterprises, enterprises);
    showToast('Enterprise profile deleted.');
    draw();
  }

  document.getElementById('entForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('e_id').value;
    const name = document.getElementById('me_name').value.trim();
    if(!name) return;

    let enterprises = getAll(DB.enterprises);
    const isDefault = document.getElementById('me_isdefault').checked || enterprises.length === 0;

    if(isDefault){
      enterprises.forEach(item => item.isDefault = false);
    }

    const currVal = document.getElementById('me_currency').value;
    const symMatch = currVal.match(/\((.*?)\)/);
    const currencySymbol = symMatch ? symMatch[1] : '₹';

    const data = {
      id: id || uid('ent'),
      userId: user.id,
      name,
      tagline: document.getElementById('me_tagline').value.trim(),
      email: document.getElementById('me_email').value.trim(),
      phone: document.getElementById('me_phone').value.trim(),
      address: document.getElementById('me_address').value.trim(),
      taxId: document.getElementById('me_tax').value.trim(),
      currency: currVal,
      currencySymbol,
      upiId: document.getElementById('me_upi').value.trim(),
      paymentUrl: document.getElementById('me_payurl').value.trim(),
      bankName: document.getElementById('me_bank').value.trim(),
      accountNumber: document.getElementById('me_acc').value.trim(),
      ifscCode: document.getElementById('me_ifsc').value.trim(),
      isDefault
    };

    if(id){
      const idx = enterprises.findIndex(item => item.id === id);
      if(idx >= 0) enterprises[idx] = data;
    } else {
      enterprises.push(data);
    }

    setAll(DB.enterprises, enterprises);
    modal.classList.remove('show');
    showToast(id ? 'Enterprise profile updated.' : 'Enterprise profile created.');
    draw();
  });

  document.getElementById('entSearch').addEventListener('input', draw);
  draw();
}

/* ================================================================
   VIEW: PROFILE
   ================================================================ */
function renderProfile(){
  const user = currentUser();
  const content = `
    <div class="card profile-card">
      <div id="profileMsg" class="form-msg"></div>
      <form id="profileForm">
        <div class="field"><label>Name</label><input id="p_name" value="${escapeHTML(user.name)}"></div>
        <div class="field" id="f-p_email"><label>Email</label><input id="p_email" type="email" value="${escapeHTML(user.email)}"><div class="field-error">Enter a valid email address.</div></div>
        <div class="field"><label>Business Name</label><input id="p_business" value="${escapeHTML(user.businessName || '')}"></div>
        <div class="field"><label>Phone Number</label><input id="p_phone" value="${escapeHTML(user.phone || '')}"></div>
        <div class="field"><label>Address</label><input id="p_address" value="${escapeHTML(user.address || '')}"></div>
        <div class="field" style="margin-bottom:0;">
          <label>UPI ID (default for payment QR)</label>
          <input id="p_upi" value="${escapeHTML(user.upiId || '')}" placeholder="yourname@bank">
        </div>
        <div class="form-actions" style="justify-content:flex-start;">
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>

    <div class="card profile-card sig-pad-card" style="margin-top:20px;">
      <h3>Authorised Signature</h3>
      <p class="helper-text" style="margin-bottom:14px;">Draw your signature below with your mouse or finger. It's captured onto every invoice you generate or save from now on.</p>
      <canvas id="sigPad" width="360" height="140"></canvas>
      <div style="display:flex;gap:10px;margin-top:12px;align-items:center;flex-wrap:wrap;">
        <button type="button" class="btn btn-ghost btn-sm" id="clearSigBtn">Clear</button>
        <button type="button" class="btn btn-primary btn-sm" id="saveSigBtn">Save Signature</button>
        <span class="helper-text" id="sigStatus" style="margin:0;"></span>
      </div>
    </div>`;

  document.getElementById('app').innerHTML = appShell('/profile', 'Your Profile', 'Account Settings', content);
  mountShellEvents();

  document.getElementById('profileForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const emailField = document.getElementById('f-p_email');
    emailField.classList.remove('has-error');
    const email = document.getElementById('p_email').value.trim();
    if(!isValidEmail(email)){ emailField.classList.add('has-error'); return; }

    const users = getAll(DB.users);
    const dup = users.find(u => u.id !== user.id && u.email.toLowerCase() === email.toLowerCase());
    const msg = document.getElementById('profileMsg');
    if(dup){
      msg.textContent = 'That email is already used by another account.';
      msg.className = 'form-msg error show';
      return;
    }
    const idx = users.findIndex(u=>u.id===user.id);
    users[idx] = {
      ...users[idx],
      name: document.getElementById('p_name').value.trim() || users[idx].name,
      email,
      businessName: document.getElementById('p_business').value.trim(),
      phone: document.getElementById('p_phone').value.trim(),
      address: document.getElementById('p_address').value.trim(),
      upiId: document.getElementById('p_upi').value.trim(),
    };
    setAll(DB.users, users);
    msg.textContent = 'Profile updated successfully.';
    msg.className = 'form-msg success show';
    showToast('Profile saved.');
  });

  const sigCanvas = document.getElementById('sigPad');
  const pad = initSignaturePad(sigCanvas, user.signature || '');
  const sigStatus = document.getElementById('sigStatus');
  if(user.signature){ sigStatus.textContent = 'Saved signature loaded.'; }

  document.getElementById('clearSigBtn').addEventListener('click', ()=>{
    pad.clear();
    sigStatus.textContent = '';
  });
  document.getElementById('saveSigBtn').addEventListener('click', ()=>{
    const users = getAll(DB.users);
    const idx = users.findIndex(u=>u.id===user.id);
    users[idx].signature = pad.isEmpty() ? '' : pad.toDataURL();
    setAll(DB.users, users);
    sigStatus.textContent = pad.isEmpty() ? 'Signature cleared.' : 'Signature saved.';
    showToast(pad.isEmpty() ? 'Signature cleared.' : 'Signature saved.');
  });
}
