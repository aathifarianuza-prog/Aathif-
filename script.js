/* ==================================================================
   EXAMINATION CELL — SEATING & INVIGILATION SYSTEM
   Vanilla JS, localStorage-backed. No frameworks, no backend.
   ================================================================== */

/* ---------------- ICONS (tiny inline SVG set) ---------------- */
const ICONS = {
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="8.5" r="2.6"/><path d="M15 14.3c2.9.4 4.9 2.5 4.9 5.7"/></svg>',
  layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 13l9 5 9-5"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11 12 4l9 7"/><path d="M5 10v9h14v-9"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/></svg>',
  'grid-2':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2l.4 2.6h4.4l.4-2.6c.7-.3 1.4-.7 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z"/></svg>',
  exit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
};
function paintIcons(){
  document.querySelectorAll('[data-icon]').forEach(el=>{
    const key = el.getAttribute('data-icon');
    if(ICONS[key] && !el.dataset.painted){ el.innerHTML = ICONS[key]; el.dataset.painted='1'; }
  });
}

/* ---------------- STORAGE LAYER ---------------- */
const DB = {
  key(name){ return 'ecell_' + name; },
  get(name, fallback){
    try{
      const raw = localStorage.getItem(this.key(name));
      return raw ? JSON.parse(raw) : fallback;
    }catch(e){ return fallback; }
  },
  set(name, value){ localStorage.setItem(this.key(name), JSON.stringify(value)); },
};

function uid(prefix){ return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

/* ---------------- SAMPLE DATA GENERATION ---------------- */
const DEPT_SEED = [
  {code:'CSE', name:'Computer Science & Engineering'},
  {code:'IT', name:'Information Technology'},
  {code:'ECE', name:'Electronics & Communication Engineering'},
  {code:'EEE', name:'Electrical & Electronics Engineering'},
  {code:'MECH', name:'Mechanical Engineering'},
  {code:'CSBS', name:'Computer Science & Business Systems'},
  {code:'AI&DS', name:'Artificial Intelligence & Data Science'},
  {code:'AIML', name:'AI & Machine Learning'},
  {code:'MBA', name:'Master of Business Administration'},
];
const FIRST_NAMES = ['Aarav','Vihaan','Aditya','Ishaan','Kabir','Rohan','Arjun','Sai','Karthik','Dhruv','Ananya','Diya','Meera','Sneha','Priya','Kavya','Riya','Isha','Nithya','Pooja','Vikram','Naveen','Suresh','Manoj','Ajay','Divya','Shreya','Lakshmi','Aishwarya','Deepika'];
const LAST_NAMES = ['Kumar','Sharma','Iyer','Reddy','Nair','Menon','Rao','Pillai','Gupta','Verma','Krishnan','Raman','Subramaniam','Das','Bose'];
function randOf(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function generateSampleData(){
  const departments = DEPT_SEED.map(d=>({id:uid('dept'), code:d.code, name:d.name}));
  DB.set('departments', departments);

  const students = [];
  let regCounter = {};
  for(let i=0;i<100;i++){
    const dept = randOf(departments);
    regCounter[dept.code] = (regCounter[dept.code]||0)+1;
    const year = String(Math.ceil(Math.random()*4));
    students.push({
      id: uid('stu'),
      regNo: `${dept.code}${String(new Date().getFullYear()).slice(2)}${String(regCounter[dept.code]).padStart(3,'0')}`,
      name: `${randOf(FIRST_NAMES)} ${randOf(LAST_NAMES)}`,
      deptId: dept.id,
      year,
      semester: String(Math.min(8, Number(year)*2)),
      section: randOf(['A','B','C']),
      gender: randOf(['Male','Female']),
    });
  }
  students.sort((a,b)=> a.regNo.localeCompare(b.regNo));
  DB.set('students', students);

  const halls = [];
  const buildings = ['Main Block','Annex Block','Science Block','Engineering Block'];
  for(let i=0;i<10;i++){
    const benches = [20,24,25,30][i%4];
    halls.push({
      id: uid('hall'),
      hallNo: `${String.fromCharCode(65+(i%4))}${100+i}`,
      building: randOf(buildings),
      floor: String((i%3)+1),
      benches,
      seatsPerBench: 2,
      capacity: benches*2,
      status: i===8 ? 'Unavailable' : 'Available',
    });
  }
  DB.set('halls', halls);

  const invigilators = [];
  const designations = ['Assistant Professor','Associate Professor','Professor','Lecturer'];
  for(let i=0;i<20;i++){
    const dept = randOf(departments);
    invigilators.push({
      id: uid('inv'),
      facultyId: `FAC${String(i+1).padStart(3,'0')}`,
      name: `Dr. ${randOf(FIRST_NAMES)} ${randOf(LAST_NAMES)}`,
      deptId: dept.id,
      designation: randOf(designations),
      mobile: `9${Math.floor(100000000+Math.random()*899999999)}`,
    });
  }
  DB.set('invigilators', invigilators);

  DB.set('settings', {
    collegeName:'Sri Venkateswara College of Engineering',
    examName:'End Semester Examinations',
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear()+1}`,
    semester:'Odd Semester',
    session:'Forenoon',
    theme:'light',
  });
  DB.set('seatingPlans', []);
  DB.set('duties', []);
  DB.set('auth', {username:'admin', password:'admin123'});
}

if(DB.get('departments', null) === null){ generateSampleData(); }

/* ---------------- GLOBAL STATE HELPERS ---------------- */
function getDepartments(){ return DB.get('departments', []); }
function getStudents(){ return DB.get('students', []); }
function getHalls(){ return DB.get('halls', []); }
function getInvigilators(){ return DB.get('invigilators', []); }
function getSettings(){ return DB.get('settings', {}); }
function getSeatingPlans(){ return DB.get('seatingPlans', []); }
function getDuties(){ return DB.get('duties', []); }
function deptName(id){ const d = getDepartments().find(x=>x.id===id); return d ? d.code : '—'; }

/* ---------------- TOASTS ---------------- */
function toast(message, type='info'){
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const glyph = type==='success' ? '✓' : type==='error' ? '✕' : '●';
  el.innerHTML = `<span>${glyph}</span><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateX(30px)'; setTimeout(()=>el.remove(), 250); }, 3000);
}

/* ---------------- CONFIRM DIALOG ---------------- */
function confirmAction(title, message, onConfirm){
  const overlay = document.getElementById('confirmOverlay');
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMessage').textContent = message;
  overlay.classList.remove('hidden');
  const okBtn = document.getElementById('confirmOk');
  const cancelBtn = document.getElementById('confirmCancel');
  function cleanup(){ overlay.classList.add('hidden'); okBtn.onclick=null; cancelBtn.onclick=null; }
  okBtn.onclick = ()=>{ cleanup(); onConfirm(); };
  cancelBtn.onclick = cleanup;
}

/* ---------------- MODAL ---------------- */
function openModal(title, bodyHTML, onMount){
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  document.getElementById('modalOverlay').classList.remove('hidden');
  if(onMount) onMount();
}
function closeModal(){ document.getElementById('modalOverlay').classList.add('hidden'); }
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e)=>{ if(e.target.id==='modalOverlay') closeModal(); });

/* ==================================================================
   AUTH / LOGIN
   ================================================================== */
const loginScreen = document.getElementById('loginScreen');
const appShell = document.getElementById('appShell');

document.getElementById('loginForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const u = document.getElementById('loginUsername').value.trim();
  const p = document.getElementById('loginPassword').value;
  const auth = DB.get('auth', {username:'admin', password:'admin123'});
  const errEl = document.getElementById('loginError');
  if(u === auth.username && p === auth.password){
    errEl.classList.add('hidden');
    sessionStorage.setItem('ecell_logged_in','1');
    enterApp();
  }else{
    errEl.classList.remove('hidden');
  }
});

document.getElementById('logoutBtn').addEventListener('click', ()=>{
  sessionStorage.removeItem('ecell_logged_in');
  appShell.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  document.getElementById('loginPassword').value='';
});

function enterApp(){
  loginScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
  paintIcons();
  refreshAllDropdowns();
  renderDashboard();
  renderStudents();
  renderDepartments();
  renderHalls();
  renderInvigilators();
  loadSettingsForm();
  applyTheme(getSettings().theme || 'light');
}

if(sessionStorage.getItem('ecell_logged_in')==='1'){ enterApp(); }

/* ==================================================================
   NAVIGATION
   ================================================================== */
const navItems = document.querySelectorAll('.nav-item[data-view]');
const views = document.querySelectorAll('.view');
const breadcrumb = document.getElementById('breadcrumb');
const TITLES = {
  dashboard:'Dashboard', students:'Student Management', departments:'Department Management',
  halls:'Hall Management', invigilators:'Invigilator Management', seating:'Seating Arrangement',
  reports:'Reports', settings:'Settings'
};
navItems.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    navItems.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.view;
    views.forEach(v=>v.classList.remove('active'));
    document.getElementById('view-'+target).classList.add('active');
    breadcrumb.textContent = TITLES[target];
    document.getElementById('sidebar').classList.remove('open');
    if(target==='dashboard') renderDashboard();
  });
});
document.getElementById('sidebarToggle').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.toggle('open');
});

/* ==================================================================
   THEME
   ================================================================== */
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('.theme-choice').forEach(b=>{
    b.classList.toggle('selected', b.dataset.theme===theme);
  });
}
document.getElementById('themeToggle').addEventListener('click', ()=>{
  const cur = document.documentElement.getAttribute('data-theme')==='dark' ? 'light' : 'dark';
  applyTheme(cur);
  const s = getSettings(); s.theme = cur; DB.set('settings', s);
  renderDashboard();
});
document.querySelectorAll('.theme-choice').forEach(b=>{
  b.addEventListener('click', ()=>{
    applyTheme(b.dataset.theme);
    const s = getSettings(); s.theme = b.dataset.theme; DB.set('settings', s);
    renderDashboard();
  });
});

/* ==================================================================
   DASHBOARD
   ================================================================== */
function animateCounter(el, target){
  const start = 0; const duration = 700; const startTime = performance.now();
  function step(now){
    const progress = Math.min(1, (now-startTime)/duration);
    el.textContent = Math.floor(start + (target-start)*progress);
    if(progress<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderDashboard(){
  const students = getStudents(), departments = getDepartments(), halls = getHalls(), invigilators = getInvigilators();
  const plans = getSeatingPlans();
  const todayStr = new Date().toISOString().slice(0,10);
  const todaysExams = plans.filter(p=>p.date===todayStr).length;

  const counters = {
    totalStudents: students.length, totalDepartments: departments.length,
    totalHalls: halls.length, totalInvigilators: invigilators.length,
    todaysExams, seatingPlans: plans.length,
  };
  document.querySelectorAll('[data-counter]').forEach(el=>{
    animateCounter(el, counters[el.dataset.counter] || 0);
  });

  // Recent plans table
  const tbody = document.querySelector('#recentPlansTable tbody');
  const recent = [...plans].sort((a,b)=> b.createdAt - a.createdAt).slice(0,6);
  tbody.innerHTML = recent.length ? recent.map(p=>{
    const hall = halls.find(h=>h.id===p.hallId);
    return `<tr><td>${p.date}</td><td>${p.session}</td><td>${hall?hall.hallNo:'—'}</td>
      <td>${deptName(p.deptAId)} + ${deptName(p.deptBId)}</td><td>${p.rows.length*2 - p.unseatedShown||0}</td></tr>`;
  }).join('') : `<tr><td colspan="5"><div class="empty-state"><div class="glyph">🪑</div>No seating plans generated yet.</div></td></tr>`;

  drawDeptChart(departments, students);
  drawHallChart(halls, plans);
}

function drawDeptChart(departments, students){
  const canvas = document.getElementById('deptChart');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width, canvas.height);
  const counts = departments.map(d=> students.filter(s=>s.deptId===d.id).length);
  const max = Math.max(1, ...counts);
  const barW = (canvas.width-40) / departments.length;
  const inkColor = getComputedStyle(document.documentElement).getPropertyValue('--brass').trim() || '#B8862E';
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#6B7280';
  departments.forEach((d,i)=>{
    const h = (counts[i]/max) * (canvas.height-50);
    const x = 20 + i*barW;
    const y = canvas.height-30-h;
    ctx.fillStyle = inkColor;
    ctx.fillRect(x+6, y, barW-12, h);
    ctx.fillStyle = textColor;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.code, x+barW/2, canvas.height-12);
    ctx.fillText(String(counts[i]), x+barW/2, y-6);
  });
}

function drawHallChart(halls, plans){
  const canvas = document.getElementById('hallChart');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width, canvas.height);
  const top = halls.slice(0,8);
  const usage = top.map(h=> plans.filter(p=>p.hallId===h.id).length);
  const max = Math.max(1, ...usage, 1);
  const barW = (canvas.width-40) / (top.length||1);
  const okColor = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#1B2A4B';
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#6B7280';
  top.forEach((h,i)=>{
    const val = usage[i];
    const barH = (val/max) * (canvas.height-50);
    const x = 20 + i*barW;
    const y = canvas.height-30-barH;
    ctx.fillStyle = okColor;
    ctx.fillRect(x+6, y, barW-12, barH || 2);
    ctx.fillStyle = textColor;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(h.hallNo, x+barW/2, canvas.height-12);
    ctx.fillText(String(val), x+barW/2, y-6);
  });
}

/* ==================================================================
   DROPDOWNS (shared across modules)
   ================================================================== */
function refreshAllDropdowns(){
  const departments = getDepartments();
  const halls = getHalls();
  const deptOptions = departments.map(d=>`<option value="${d.id}">${d.code} — ${d.name}</option>`).join('');
  ['studentDeptFilter','invigilatorDeptFilter'].forEach(id=>{
    const el = document.getElementById(id);
    const cur = el.value;
    el.innerHTML = `<option value="">All Departments</option>` + deptOptions;
    el.value = cur;
  });
  ['seatDept1','seatDept2'].forEach(id=>{
    document.getElementById(id).innerHTML = deptOptions;
  });
  document.getElementById('seatHall').innerHTML = halls.filter(h=>h.status==='Available')
    .map(h=>`<option value="${h.id}">${h.hallNo} (${h.capacity} seats)</option>`).join('') || '<option value="">No halls available</option>';
}

/* ==================================================================
   STUDENT MANAGEMENT
   ================================================================== */
let studentPage = 1; const PAGE_SIZE = 10;

function studentFormHTML(s){
  const departments = getDepartments();
  return `
    <div class="form-grid">
      <label class="field"><span>Register Number</span><input class="input" id="f_regNo" value="${s?.regNo||''}" ${s?'readonly':''}></label>
      <label class="field"><span>Student Name</span><input class="input" id="f_name" value="${s?.name||''}"></label>
      <label class="field"><span>Department</span><select class="input select" id="f_dept">${departments.map(d=>`<option value="${d.id}" ${s?.deptId===d.id?'selected':''}>${d.code}</option>`).join('')}</select></label>
      <label class="field"><span>Year</span><select class="input select" id="f_year">${[1,2,3,4].map(y=>`<option ${String(y)===s?.year?'selected':''}>${y}</option>`).join('')}</select></label>
      <label class="field"><span>Semester</span><input class="input" id="f_sem" value="${s?.semester||''}"></label>
      <label class="field"><span>Section</span><select class="input select" id="f_section">${['A','B','C'].map(x=>`<option ${x===s?.section?'selected':''}>${x}</option>`).join('')}</select></label>
      <label class="field"><span>Gender</span><select class="input select" id="f_gender"><option ${s?.gender==='Male'?'selected':''}>Male</option><option ${s?.gender==='Female'?'selected':''}>Female</option></select></label>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" id="f_cancel">Cancel</button>
      <button class="btn btn-primary" id="f_save">${s?'Save Changes':'Add Student'}</button>
    </div>`;
}

function openStudentModal(existing){
  openModal(existing?'Edit Student':'Add Student', studentFormHTML(existing), ()=>{
    document.getElementById('f_cancel').onclick = closeModal;
    document.getElementById('f_save').onclick = ()=>{
      const regNo = document.getElementById('f_regNo').value.trim();
      const name = document.getElementById('f_name').value.trim();
      if(!regNo || !name){ toast('Register number and name are required.', 'error'); return; }
      let students = getStudents();
      if(existing){
        const idx = students.findIndex(x=>x.id===existing.id);
        students[idx] = {...existing, name, deptId:document.getElementById('f_dept').value,
          year:document.getElementById('f_year').value, semester:document.getElementById('f_sem').value,
          section:document.getElementById('f_section').value, gender:document.getElementById('f_gender').value};
        toast('Student updated.', 'success');
      }else{
        if(students.some(x=>x.regNo===regNo)){ toast('A student with this register number already exists.', 'error'); return; }
        students.push({id:uid('stu'), regNo, name, deptId:document.getElementById('f_dept').value,
          year:document.getElementById('f_year').value, semester:document.getElementById('f_sem').value,
          section:document.getElementById('f_section').value, gender:document.getElementById('f_gender').value});
        toast('Student added.', 'success');
      }
      students.sort((a,b)=>a.regNo.localeCompare(b.regNo));
      DB.set('students', students);
      closeModal(); renderStudents(); renderDashboard();
    };
  });
}

function renderStudents(){
  const departments = getDepartments();
  const search = (document.getElementById('studentSearch').value||'').toLowerCase();
  const deptFilter = document.getElementById('studentDeptFilter').value;
  const yearFilter = document.getElementById('studentYearFilter').value;
  let students = getStudents().filter(s=>{
    const matchSearch = !search || s.name.toLowerCase().includes(search) || s.regNo.toLowerCase().includes(search);
    const matchDept = !deptFilter || s.deptId===deptFilter;
    const matchYear = !yearFilter || s.year===yearFilter;
    return matchSearch && matchDept && matchYear;
  });
  const totalPages = Math.max(1, Math.ceil(students.length/PAGE_SIZE));
  studentPage = Math.min(studentPage, totalPages);
  const pageItems = students.slice((studentPage-1)*PAGE_SIZE, studentPage*PAGE_SIZE);

  const tbody = document.querySelector('#studentsTable tbody');
  tbody.innerHTML = pageItems.length ? pageItems.map(s=>`
    <tr>
      <td class="mono">${s.regNo}</td><td>${s.name}</td>
      <td><span class="tag">${deptName(s.deptId)}</span></td>
      <td>${s.year}</td><td>${s.semester}</td><td>${s.section}</td><td>${s.gender}</td>
      <td class="row-actions">
        <button title="Edit" data-edit="${s.id}">✎</button>
        <button title="Delete" data-del="${s.id}">🗑</button>
      </td>
    </tr>`).join('') : `<tr><td colspan="8"><div class="empty-state"><div class="glyph">🎓</div>No students found.</div></td></tr>`;

  tbody.querySelectorAll('[data-edit]').forEach(btn=>btn.addEventListener('click', ()=>{
    openStudentModal(getStudents().find(s=>s.id===btn.dataset.edit));
  }));
  tbody.querySelectorAll('[data-del]').forEach(btn=>btn.addEventListener('click', ()=>{
    confirmAction('Delete Student', 'This will permanently remove the student record.', ()=>{
      DB.set('students', getStudents().filter(s=>s.id!==btn.dataset.del));
      toast('Student deleted.', 'success'); renderStudents(); renderDashboard();
    });
  }));

  const pag = document.getElementById('studentsPagination');
  pag.innerHTML = Array.from({length:totalPages}, (_,i)=>i+1)
    .map(p=>`<button class="${p===studentPage?'active':''}" data-page="${p}">${p}</button>`).join('');
  pag.querySelectorAll('[data-page]').forEach(btn=>btn.addEventListener('click', ()=>{
    studentPage = Number(btn.dataset.page); renderStudents();
  }));
}
document.getElementById('addStudentBtn').addEventListener('click', ()=>openStudentModal(null));
document.getElementById('studentSearch').addEventListener('input', ()=>{ studentPage=1; renderStudents(); });
document.getElementById('studentDeptFilter').addEventListener('change', ()=>{ studentPage=1; renderStudents(); });
document.getElementById('studentYearFilter').addEventListener('change', ()=>{ studentPage=1; renderStudents(); });
document.getElementById('importStudentsBtn').addEventListener('click', ()=>{
  toast('Excel import is a placeholder in this offline build.', 'info');
});

/* ==================================================================
   DEPARTMENT MANAGEMENT
   ================================================================== */
function openDeptModal(existing){
  const body = `
    <div class="form-grid">
      <label class="field"><span>Department Code</span><input class="input" id="f_code" value="${existing?.code||''}"></label>
      <label class="field"><span>Department Name</span><input class="input" id="f_name" value="${existing?.name||''}"></label>
    </div>
    <div class="form-actions"><button class="btn btn-ghost" id="f_cancel">Cancel</button><button class="btn btn-primary" id="f_save">${existing?'Save Changes':'Add Department'}</button></div>`;
  openModal(existing?'Edit Department':'Add Department', body, ()=>{
    document.getElementById('f_cancel').onclick = closeModal;
    document.getElementById('f_save').onclick = ()=>{
      const code = document.getElementById('f_code').value.trim().toUpperCase();
      const name = document.getElementById('f_name').value.trim();
      if(!code || !name){ toast('Both fields are required.', 'error'); return; }
      let departments = getDepartments();
      if(existing){
        departments[departments.findIndex(d=>d.id===existing.id)] = {...existing, code, name};
        toast('Department updated.', 'success');
      }else{
        if(departments.some(d=>d.code===code)){ toast('Department code already exists.', 'error'); return; }
        departments.push({id:uid('dept'), code, name});
        toast('Department added.', 'success');
      }
      DB.set('departments', departments);
      closeModal(); renderDepartments(); refreshAllDropdowns(); renderStudents(); renderDashboard();
    };
  });
}
function renderDepartments(){
  const departments = getDepartments(); const students = getStudents();
  const tbody = document.querySelector('#deptTable tbody');
  tbody.innerHTML = departments.length ? departments.map(d=>`
    <tr><td class="mono">${d.code}</td><td>${d.name}</td><td>${students.filter(s=>s.deptId===d.id).length}</td>
    <td class="row-actions"><button data-edit="${d.id}">✎</button><button data-del="${d.id}">🗑</button></td></tr>`).join('')
    : `<tr><td colspan="4"><div class="empty-state"><div class="glyph">🏛</div>No departments yet.</div></td></tr>`;
  tbody.querySelectorAll('[data-edit]').forEach(btn=>btn.addEventListener('click', ()=>openDeptModal(departments.find(d=>d.id===btn.dataset.edit))));
  tbody.querySelectorAll('[data-del]').forEach(btn=>btn.addEventListener('click', ()=>{
    confirmAction('Delete Department', 'Students under this department will remain but lose their department link.', ()=>{
      DB.set('departments', getDepartments().filter(d=>d.id!==btn.dataset.del));
      toast('Department deleted.', 'success'); renderDepartments(); refreshAllDropdowns();
    });
  }));
}
document.getElementById('addDeptBtn').addEventListener('click', ()=>openDeptModal(null));

/* ==================================================================
   HALL MANAGEMENT
   ================================================================== */
function openHallModal(existing){
  const body = `
    <div class="form-grid">
      <label class="field"><span>Hall Number</span><input class="input" id="f_hallNo" value="${existing?.hallNo||''}"></label>
      <label class="field"><span>Building</span><input class="input" id="f_building" value="${existing?.building||''}"></label>
      <label class="field"><span>Floor</span><input class="input" id="f_floor" value="${existing?.floor||''}"></label>
      <label class="field"><span>Number of Benches</span><input class="input" type="number" min="1" id="f_benches" value="${existing?.benches||30}"></label>
      <label class="field"><span>Seats per Bench</span><input class="input" type="number" min="1" max="2" id="f_seats" value="${existing?.seatsPerBench||2}"></label>
      <label class="field"><span>Status</span><select class="input select" id="f_status"><option ${existing?.status==='Available'?'selected':''}>Available</option><option ${existing?.status==='Unavailable'?'selected':''}>Unavailable</option></select></label>
    </div>
    <div class="form-actions"><button class="btn btn-ghost" id="f_cancel">Cancel</button><button class="btn btn-primary" id="f_save">${existing?'Save Changes':'Add Hall'}</button></div>`;
  openModal(existing?'Edit Hall':'Add Hall', body, ()=>{
    document.getElementById('f_cancel').onclick = closeModal;
    document.getElementById('f_save').onclick = ()=>{
      const hallNo = document.getElementById('f_hallNo').value.trim();
      const benches = Number(document.getElementById('f_benches').value)||0;
      const seatsPerBench = Number(document.getElementById('f_seats').value)||2;
      if(!hallNo || !benches){ toast('Hall number and bench count are required.', 'error'); return; }
      let halls = getHalls();
      const data = {hallNo, building:document.getElementById('f_building').value.trim(),
        floor:document.getElementById('f_floor').value.trim(), benches, seatsPerBench,
        capacity: benches*seatsPerBench, status:document.getElementById('f_status').value};
      if(existing){
        halls[halls.findIndex(h=>h.id===existing.id)] = {...existing, ...data};
        toast('Hall updated.', 'success');
      }else{
        halls.push({id:uid('hall'), ...data});
        toast('Hall added.', 'success');
      }
      DB.set('halls', halls);
      closeModal(); renderHalls(); refreshAllDropdowns(); renderDashboard();
    };
  });
}
function renderHalls(){
  const halls = getHalls();
  const tbody = document.querySelector('#hallsTable tbody');
  tbody.innerHTML = halls.length ? halls.map(h=>`
    <tr><td class="mono">${h.hallNo}</td><td>${h.building||'—'}</td><td>${h.floor||'—'}</td>
    <td>${h.benches}</td><td>${h.seatsPerBench}</td><td>${h.capacity}</td>
    <td><span class="tag ${h.status==='Available'?'tag-ok':'tag-bad'}">${h.status}</span></td>
    <td class="row-actions"><button data-edit="${h.id}">✎</button><button data-del="${h.id}">🗑</button></td></tr>`).join('')
    : `<tr><td colspan="8"><div class="empty-state"><div class="glyph">🚪</div>No halls added yet.</div></td></tr>`;
  tbody.querySelectorAll('[data-edit]').forEach(btn=>btn.addEventListener('click', ()=>openHallModal(halls.find(h=>h.id===btn.dataset.edit))));
  tbody.querySelectorAll('[data-del]').forEach(btn=>btn.addEventListener('click', ()=>{
    confirmAction('Delete Hall', 'This hall will no longer be available for seating arrangement.', ()=>{
      DB.set('halls', getHalls().filter(h=>h.id!==btn.dataset.del));
      toast('Hall deleted.', 'success'); renderHalls(); refreshAllDropdowns();
    });
  }));
}
document.getElementById('addHallBtn').addEventListener('click', ()=>openHallModal(null));

/* ==================================================================
   INVIGILATOR MANAGEMENT
   ================================================================== */
function openInvigilatorModal(existing){
  const departments = getDepartments();
  const body = `
    <div class="form-grid">
      <label class="field"><span>Faculty ID</span><input class="input" id="f_facId" value="${existing?.facultyId||''}" ${existing?'readonly':''}></label>
      <label class="field"><span>Faculty Name</span><input class="input" id="f_name" value="${existing?.name||''}"></label>
      <label class="field"><span>Department</span><select class="input select" id="f_dept">${departments.map(d=>`<option value="${d.id}" ${existing?.deptId===d.id?'selected':''}>${d.code}</option>`).join('')}</select></label>
      <label class="field"><span>Designation</span><input class="input" id="f_desig" value="${existing?.designation||''}"></label>
      <label class="field"><span>Mobile Number</span><input class="input" id="f_mobile" value="${existing?.mobile||''}"></label>
    </div>
    <div class="form-actions"><button class="btn btn-ghost" id="f_cancel">Cancel</button><button class="btn btn-primary" id="f_save">${existing?'Save Changes':'Add Invigilator'}</button></div>`;
  openModal(existing?'Edit Invigilator':'Add Invigilator', body, ()=>{
    document.getElementById('f_cancel').onclick = closeModal;
    document.getElementById('f_save').onclick = ()=>{
      const facultyId = document.getElementById('f_facId').value.trim();
      const name = document.getElementById('f_name').value.trim();
      if(!facultyId || !name){ toast('Faculty ID and name are required.', 'error'); return; }
      let invigilators = getInvigilators();
      const data = {name, deptId:document.getElementById('f_dept').value, designation:document.getElementById('f_desig').value.trim(), mobile:document.getElementById('f_mobile').value.trim()};
      if(existing){
        invigilators[invigilators.findIndex(i=>i.id===existing.id)] = {...existing, ...data};
        toast('Invigilator updated.', 'success');
      }else{
        if(invigilators.some(i=>i.facultyId===facultyId)){ toast('Faculty ID already exists.', 'error'); return; }
        invigilators.push({id:uid('inv'), facultyId, ...data});
        toast('Invigilator added.', 'success');
      }
      DB.set('invigilators', invigilators);
      closeModal(); renderInvigilators(); renderDashboard();
    };
  });
}
function renderInvigilators(){
  const search = (document.getElementById('invigilatorSearch').value||'').toLowerCase();
  const deptFilter = document.getElementById('invigilatorDeptFilter').value;
  const invigilators = getInvigilators().filter(i=>{
    const matchSearch = !search || i.name.toLowerCase().includes(search) || i.facultyId.toLowerCase().includes(search);
    const matchDept = !deptFilter || i.deptId===deptFilter;
    return matchSearch && matchDept;
  });
  const tbody = document.querySelector('#invigilatorsTable tbody');
  tbody.innerHTML = invigilators.length ? invigilators.map(i=>`
    <tr><td class="mono">${i.facultyId}</td><td>${i.name}</td><td><span class="tag">${deptName(i.deptId)}</span></td>
    <td>${i.designation||'—'}</td><td class="mono">${i.mobile||'—'}</td>
    <td class="row-actions"><button data-edit="${i.id}">✎</button><button data-del="${i.id}">🗑</button></td></tr>`).join('')
    : `<tr><td colspan="6"><div class="empty-state"><div class="glyph">🛡</div>No invigilators found.</div></td></tr>`;
  tbody.querySelectorAll('[data-edit]').forEach(btn=>btn.addEventListener('click', ()=>openInvigilatorModal(getInvigilators().find(i=>i.id===btn.dataset.edit))));
  tbody.querySelectorAll('[data-del]').forEach(btn=>btn.addEventListener('click', ()=>{
    confirmAction('Delete Invigilator', 'This faculty member will be removed from the invigilation pool.', ()=>{
      DB.set('invigilators', getInvigilators().filter(i=>i.id!==btn.dataset.del));
      toast('Invigilator deleted.', 'success'); renderInvigilators(); renderDashboard();
    });
  }));
}
document.getElementById('addInvigilatorBtn').addEventListener('click', ()=>openInvigilatorModal(null));
document.getElementById('invigilatorSearch').addEventListener('input', renderInvigilators);
document.getElementById('invigilatorDeptFilter').addEventListener('change', renderInvigilators);

/* ==================================================================
   SEATING ARRANGEMENT — THE CORE ALGORITHM
   ================================================================== */
let lastGeneratedPlan = null;

function runForwardReverseAlgorithm(deptAStudents, deptBStudents, benchCount){
  const A = [...deptAStudents]; // forward order (already regNo-sorted)
  const B = [...deptBStudents].slice().reverse(); // reverse order
  const rows = [];
  let ai=0, bi=0;
  for(let b=1; b<=benchCount; b++){
    const left = ai<A.length ? A[ai++] : null;
    const right = bi<B.length ? B[bi++] : null;
    if(!left && !right) break;
    rows.push({bench:b, left, right});
  }
  const unseatedCount = (A.length-ai) + (B.length-bi);
  return {rows, unseatedCount};
}

document.getElementById('generateSeatingBtn').addEventListener('click', ()=>{
  const dept1 = document.getElementById('seatDept1').value;
  const dept2 = document.getElementById('seatDept2').value;
  const date = document.getElementById('seatDate').value;
  const session = document.getElementById('seatSession').value;
  const hallId = document.getElementById('seatHall').value;

  if(!dept1 || !dept2){ toast('Select both departments.', 'error'); return; }
  if(dept1 === dept2){ toast('Choose two different departments.', 'error'); return; }
  if(!date){ toast('Select an exam date.', 'error'); return; }
  if(!hallId){ toast('No hall selected — add an available hall first.', 'error'); return; }

  const hall = getHalls().find(h=>h.id===hallId);
  const students = getStudents();
  const deptAStudents = students.filter(s=>s.deptId===dept1).sort((a,b)=>a.regNo.localeCompare(b.regNo));
  const deptBStudents = students.filter(s=>s.deptId===dept2).sort((a,b)=>a.regNo.localeCompare(b.regNo));

  if(!deptAStudents.length && !deptBStudents.length){ toast('Neither department has students to seat.', 'error'); return; }

  const {rows, unseatedCount} = runForwardReverseAlgorithm(deptAStudents, deptBStudents, hall.benches);

  const plan = {
    id: uid('plan'), deptAId:dept1, deptBId:dept2, date, session, hallId, rows,
    unseatedCount, createdAt: Date.now(), invigilatorId: null,
  };
  lastGeneratedPlan = plan;
  renderSeatingChart(plan);
  if(unseatedCount>0){ toast(`${unseatedCount} student(s) could not be seated — hall capacity exceeded.`, 'error'); }
  else{ toast('Seating arrangement generated.', 'success'); }
});

function renderSeatingChart(plan){
  const settings = getSettings();
  const hall = getHalls().find(h=>h.id===plan.hallId);
  const invigilator = plan.invigilatorId ? getInvigilators().find(i=>i.id===plan.invigilatorId) : null;

  const rowsHTML = plan.rows.map(r=>`
    <div class="bench-row">
      <div class="bench-num">${String(r.bench).padStart(2,'0')}</div>
      ${['left','right'].map(side=>{
        const st = r[side];
        if(!st) return `<div class="bench-seat empty">Empty Seat</div>`;
        return `<div class="bench-seat"><span class="reg">${st.regNo}</span><span class="name">${st.name} · ${deptName(st.deptId)}</span></div>`;
      }).join('')}
    </div>`).join('');

  document.getElementById('seatingChartArea').innerHTML = `
    <div id="printArea">
      <div class="chart-title-block">
        <h2>${settings.collegeName||'Examination Cell'}</h2>
        <p class="muted">${settings.examName||'Examinations'} — Seating Chart</p>
      </div>
      <div class="chart-meta">
        <span>Date: <b>${plan.date}</b></span>
        <span>Session: <b>${plan.session}</b></span>
        <span>Hall: <b>${hall?hall.hallNo:'—'}</b></span>
        <span>Departments: <b>${deptName(plan.deptAId)} + ${deptName(plan.deptBId)}</b></span>
        <span>Invigilator: <b>${invigilator?invigilator.name:'Not assigned'}</b></span>
      </div>
      <div class="bench-ledger">
        <div class="bench-row head"><div class="bench-num">BENCH</div><div>DEPT ${deptName(plan.deptAId)} (FORWARD)</div><div>DEPT ${deptName(plan.deptBId)} (REVERSE)</div></div>
        ${rowsHTML}
      </div>
    </div>`;
  document.getElementById('seatingResultPanel').classList.remove('hidden');

  let plans = getSeatingPlans().filter(p=>p.id!==plan.id);
  plans.push(plan);
  DB.set('seatingPlans', plans);
  renderDashboard();
}

document.getElementById('printSeatingBtn').addEventListener('click', ()=> window.print());

document.getElementById('assignInvigilatorBtn').addEventListener('click', ()=>{
  if(!lastGeneratedPlan){ toast('Generate a seating plan first.', 'error'); return; }
  const plan = lastGeneratedPlan;
  const duties = getDuties();
  const alreadyAssignedIds = duties.filter(d=>d.date===plan.date && d.session===plan.session).map(d=>d.invigilatorId);
  const available = getInvigilators().filter(i=>!alreadyAssignedIds.includes(i.id));
  if(!available.length){ toast('All invigilators are already assigned for this date/session.', 'error'); return; }

  const body = `
    <div class="form-grid">
      <label class="field" style="grid-column:1/-1"><span>Invigilator</span>
        <select class="input select" id="f_invigilator">${available.map(i=>`<option value="${i.id}">${i.name} (${deptName(i.deptId)})</option>`).join('')}</select>
      </label>
    </div>
    <div class="form-actions"><button class="btn btn-ghost" id="f_cancel">Cancel</button><button class="btn btn-primary" id="f_save">Assign</button></div>`;
  openModal('Assign Invigilator', body, ()=>{
    document.getElementById('f_cancel').onclick = closeModal;
    document.getElementById('f_save').onclick = ()=>{
      const invId = document.getElementById('f_invigilator').value;
      plan.invigilatorId = invId;
      let plans = getSeatingPlans().filter(p=>p.id!==plan.id); plans.push(plan); DB.set('seatingPlans', plans);
      const hall = getHalls().find(h=>h.id===plan.hallId);
      duties.push({id:uid('duty'), invigilatorId:invId, hallId:plan.hallId, date:plan.date, session:plan.session, planId:plan.id});
      DB.set('duties', duties);
      toast('Invigilator assigned and duty sheet updated.', 'success');
      closeModal();
      renderSeatingChart(plan);
    };
  });
});

/* ==================================================================
   REPORTS
   ================================================================== */
document.querySelectorAll('.report-card').forEach(card=>{
  card.addEventListener('click', ()=> generateReport(card.dataset.report));
});

function generateReport(type){
  const plans = getSeatingPlans();
  const halls = getHalls();
  const invigilators = getInvigilators();
  const duties = getDuties();
  const settings = getSettings();
  let title = '', html = '';

  if(!plans.length && type!=='duty'){
    title = 'No Data';
    html = `<div class="empty-state"><div class="glyph">📄</div>Generate at least one seating plan first.</div>`;
  }else if(type==='hallwise'){
    title = 'Hall-wise Seating Report';
    html = halls.map(h=>{
      const hallPlans = plans.filter(p=>p.hallId===h.id);
      if(!hallPlans.length) return '';
      return `<h4 style="margin:18px 0 8px">${h.hallNo} — ${h.building||''}</h4>` + hallPlans.map(p=>`
        <p class="muted" style="margin-bottom:8px">${p.date} · ${p.session} · ${deptName(p.deptAId)} + ${deptName(p.deptBId)}</p>
        <div class="bench-ledger" style="margin-bottom:18px">
          <div class="bench-row head"><div class="bench-num">BENCH</div><div>LEFT</div><div>RIGHT</div></div>
          ${p.rows.map(r=>`<div class="bench-row"><div class="bench-num">${r.bench}</div>
            <div class="bench-seat ${!r.left?'empty':''}">${r.left?r.left.regNo+' · '+r.left.name:'Empty'}</div>
            <div class="bench-seat ${!r.right?'empty':''}">${r.right?r.right.regNo+' · '+r.right.name:'Empty'}</div></div>`).join('')}
        </div>`).join('');
    }).join('') || `<div class="empty-state"><div class="glyph">🚪</div>No hall data to display.</div>`;
  }else if(type==='deptwise'){
    title = 'Department-wise Seating Report';
    const departments = getDepartments();
    html = departments.map(d=>{
      const seated = [];
      plans.forEach(p=>{
        p.rows.forEach(r=>{
          [r.left, r.right].forEach(st=>{ if(st && st.deptId===d.id) seated.push({st,p}); });
        });
      });
      if(!seated.length) return '';
      return `<h4 style="margin:18px 0 8px">${d.code} — ${d.name}</h4>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Reg. No</th><th>Name</th><th>Date</th><th>Hall</th></tr></thead><tbody>
        ${seated.map(({st,p})=>`<tr><td class="mono">${st.regNo}</td><td>${st.name}</td><td>${p.date}</td><td>${halls.find(h=>h.id===p.hallId)?.hallNo||'—'}</td></tr>`).join('')}
        </tbody></table></div>`;
    }).join('') || `<div class="empty-state"><div class="glyph">🏛</div>No department data to display.</div>`;
  }else if(type==='studentlist'){
    title = 'Student Seating List';
    const rows = [];
    plans.forEach(p=>{
      p.rows.forEach(r=>{
        [r.left, r.right].forEach(st=>{ if(st) rows.push({st,p,bench:r.bench}); });
      });
    });
    html = rows.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Reg. No</th><th>Name</th><th>Dept</th><th>Date</th><th>Hall</th><th>Bench</th></tr></thead><tbody>
      ${rows.map(({st,p,bench})=>`<tr><td class="mono">${st.regNo}</td><td>${st.name}</td><td>${deptName(st.deptId)}</td><td>${p.date}</td><td>${halls.find(h=>h.id===p.hallId)?.hallNo||'—'}</td><td>${bench}</td></tr>`).join('')}
      </tbody></table></div>` : `<div class="empty-state"><div class="glyph">🎓</div>No students have been seated yet.</div>`;
  }else if(type==='duty'){
    title = 'Invigilator Duty Report';
    html = duties.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Faculty</th><th>Department</th><th>Hall</th><th>Date</th><th>Session</th></tr></thead><tbody>
      ${duties.map(d=>{
        const inv = invigilators.find(i=>i.id===d.invigilatorId);
        const hall = halls.find(h=>h.id===d.hallId);
        return `<tr><td>${inv?inv.name:'—'}</td><td>${inv?deptName(inv.deptId):'—'}</td><td>${hall?hall.hallNo:'—'}</td><td>${d.date}</td><td>${d.session}</td></tr>`;
      }).join('')}
      </tbody></table></div>` : `<div class="empty-state"><div class="glyph">🛡</div>No invigilators assigned yet.</div>`;
  }

  document.getElementById('reportResultTitle').textContent = title;
  document.getElementById('reportResultArea').innerHTML = `<div id="printArea">
    <div class="chart-title-block"><h2>${settings.collegeName||''}</h2><p class="muted">${title}</p></div>
    ${html}</div>`;
  document.getElementById('reportResultPanel').classList.remove('hidden');
  document.getElementById('reportResultPanel').scrollIntoView({behavior:'smooth', block:'start'});
}
document.getElementById('printReportBtn').addEventListener('click', ()=> window.print());

/* ==================================================================
   SETTINGS
   ================================================================== */
function loadSettingsForm(){
  const s = getSettings();
  document.getElementById('setCollegeName').value = s.collegeName||'';
  document.getElementById('setExamName').value = s.examName||'';
  document.getElementById('setAcademicYear').value = s.academicYear||'';
  document.getElementById('setSemester').value = s.semester||'';
  document.getElementById('setSession').value = s.session||'Forenoon';
}
document.getElementById('settingsForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const s = getSettings();
  s.collegeName = document.getElementById('setCollegeName').value.trim();
  s.examName = document.getElementById('setExamName').value.trim();
  s.academicYear = document.getElementById('setAcademicYear').value.trim();
  s.semester = document.getElementById('setSemester').value.trim();
  s.session = document.getElementById('setSession').value;
  DB.set('settings', s);
  toast('Settings saved.', 'success');
  renderDashboard();
});
document.getElementById('passwordForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const auth = DB.get('auth', {username:'admin', password:'admin123'});
  const cur = document.getElementById('curPassword').value;
  const next = document.getElementById('newPassword').value;
  if(cur !== auth.password){ toast('Current password is incorrect.', 'error'); return; }
  if(!next || next.length<4){ toast('New password must be at least 4 characters.', 'error'); return; }
  auth.password = next; DB.set('auth', auth);
  document.getElementById('passwordForm').reset();
  toast('Password changed successfully.', 'success');
});

/* ==================================================================
   GLOBAL SEARCH (topbar) — jumps to the matching module
   ================================================================== */
document.getElementById('globalSearch').addEventListener('keydown', (e)=>{
  if(e.key !== 'Enter') return;
  const q = e.target.value.trim().toLowerCase();
  if(!q) return;
  const students = getStudents(), invigilators = getInvigilators(), halls = getHalls();
  if(students.some(s=>s.regNo.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))){
    document.querySelector('.nav-item[data-view="students"]').click();
    document.getElementById('studentSearch').value = e.target.value; renderStudents();
  }else if(invigilators.some(i=>i.name.toLowerCase().includes(q) || i.facultyId.toLowerCase().includes(q))){
    document.querySelector('.nav-item[data-view="invigilators"]').click();
    document.getElementById('invigilatorSearch').value = e.target.value; renderInvigilators();
  }else if(halls.some(h=>h.hallNo.toLowerCase().includes(q))){
    document.querySelector('.nav-item[data-view="halls"]').click();
  }else{
    toast('No matching student, hall, or faculty found.', 'error');
  }
});

/* ==================================================================
   KEYBOARD SHORTCUTS
   ================================================================== */
document.addEventListener('keydown', (e)=>{
  if(e.ctrlKey && e.key==='k'){ e.preventDefault(); document.getElementById('globalSearch').focus(); }
  if(e.key==='Escape'){ closeModal(); document.getElementById('confirmOverlay').classList.add('hidden'); }
});
