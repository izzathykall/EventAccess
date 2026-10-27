'use strict';
/* Staff High Urgency Alert — an in-app, single-browser educational simulation.
 * Alert criteria: verified report + organiser-assigned current staff team +
 * final urgency High + active work (New/In progress). No push or live sync. */
const EA_STAFF_TEXT={
  en:{staffAlertTitle:'High Urgency Task Alert',staffAlertShort:'HIGH URGENCY',staffAlertBanner:'Urgent staff attention required',staffAlertHelp:'Organiser-verified High priority tasks assigned to this simulated team.',staffAlertCount:'High-priority assigned tasks',staffAlertUnread:'unread alerts',staffAlertOpen:'View high-priority alerts',staffAlertAcknowledge:'Acknowledge all',staffAlertDismiss:'Dismiss notification',staffAlertViewTask:'Open task',staffAlertVerified:'Verified by organiser',staffAlertNoTasks:'No active High urgency assignments for this team.',staffAlertReceipt:'Notification acknowledged on this browser.',staffAlertSimulated:'In-app simulation only: no push notifications, shared database, or real emergency dispatch.',staffAlertDetails:'Priority was confirmed or retained during organiser review. Contact real on-site supervisors for urgent safety matters.',staffAlertBell:'Staff notifications'},
  ms:{staffAlertTitle:'Amaran Tugasan Keutamaan Tinggi',staffAlertShort:'KEUTAMAAN TINGGI',staffAlertBanner:'Tugasan penting memerlukan perhatian petugas',staffAlertHelp:'Tugasan tahap Tinggi yang telah disahkan penganjur dan diberikan kepada pasukan simulasi ini.',staffAlertCount:'Tugasan keutamaan tinggi',staffAlertUnread:'amaran belum dibaca',staffAlertOpen:'Lihat amaran keutamaan tinggi',staffAlertAcknowledge:'Sahkan semua amaran',staffAlertDismiss:'Tutup notifikasi',staffAlertViewTask:'Buka tugasan',staffAlertVerified:'Disahkan penganjur',staffAlertNoTasks:'Tiada tugasan tahap Tinggi yang aktif bagi pasukan ini.',staffAlertReceipt:'Notifikasi disahkan dalam pelayar ini.',staffAlertSimulated:'Simulasi dalam aplikasi sahaja: tiada push notification, pangkalan data bersama atau panggilan kecemasan sebenar.',staffAlertDetails:'Keutamaan telah ditentukan semasa semakan penganjur. Hubungi penyelia di lokasi sebenar untuk masalah keselamatan segera.',staffAlertBell:'Notifikasi petugas'}
};
for(const lang of ['en','ms']) Object.assign(i18n[lang],EA_STAFF_TEXT[lang]);
const EA_STAFF_SEEN_KEY='ea3_staff_alerts_seen_v1';
let EA_staffSeen={};
try{const stored=JSON.parse(localStorage.getItem(EA_STAFF_SEEN_KEY)||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))EA_staffSeen=stored}catch(e){}
function EA_staffAlertKey(r){return `${r.id}|${r.team}`}
function EA_storeSeen(){try{localStorage.setItem(EA_STAFF_SEEN_KEY,JSON.stringify(EA_staffSeen))}catch(e){/* session fallback */}}
function EA_staffHighTasks(){return reports.filter(r=>r && r.verification==='verified'&&r.team===V3_team&&r.urgency==='high'&&['New','In progress'].includes(r.status)).sort((a,b)=>(a.status==='New'?0:1)-(b.status==='New'?0:1)||(Date.parse(b.updated)||0)-(Date.parse(a.updated)||0))}
function EA_staffUnseen(){return EA_staffHighTasks().filter(r=>!EA_staffSeen[EA_staffAlertKey(r)])}
function EA_staffMarkSeen(ids){for(const task of EA_staffHighTasks())if(ids.includes(task.id))EA_staffSeen[EA_staffAlertKey(task)]=true;EA_storeSeen();EA_staffRefreshBell()}
function EA_staffRefreshBell(){const button=document.getElementById('ea-staff-bell');if(!button)return;const count=EA_staffUnseen().length;button.setAttribute('aria-label',`${t('staffAlertBell')}: ${count} ${t('staffAlertUnread')}`);button.innerHTML=`${ic('alert',17)}${count?`<span class="staff-bell-count">${count}</span>`:''}`;button.classList.toggle('has-unread',count>0);}
function EA_staffModal(force=false){if(V3_role!=='staff')return;const todos=EA_staffHighTasks(),newItems=EA_staffUnseen();if(!force&&!newItems.length)return;if(document.getElementById('modal-root')?.firstElementChild)return;
 const entries=force?todos:newItems;modal(`<div class="staff-popup-header"><div class="staff-popup-symbol">${ic('alert',26)}</div><div><div class="staff-popup-eyebrow">${t('staffAlertShort')} · ${esc(V3_team)}</div><h3>${t('staffAlertTitle')}</h3></div><button class="close-btn" onclick="EA_staffDismiss()" aria-label="${t('staffAlertDismiss')}">${ic('close')}</button></div><p class="staff-popup-lead">${t('staffAlertHelp')}</p>${entries.length?`<div class="staff-popup-tasks">${entries.map(r=>`<section class="staff-popup-task"><div class="staff-popup-taskhead"><strong>${esc(r.id)}</strong><span class="staff-priority-chip">${ic('alert',13)} ${t('high')}</span></div><strong class="staff-popup-location">${esc(labelCategory(r.category))}</strong><p>${esc(V3_labelLoc(r.loc))} · ${esc(r.details)}</p><div class="staff-popup-footer"><span>${ic('check',14)} ${t('staffAlertVerified')}</span><button class="btn btn-main staff-alert-open" onclick="EA_staffOpenTask('${esc(r.id)}')">${t('staffAlertViewTask')} ${ic('arrow',13)}</button></div></section>`).join('')}</div>`:`<p class="staff-popup-empty">${t('staffAlertNoTasks')}</p>`}<p class="staff-popup-disclaimer">${ic('info',15)} ${t('staffAlertSimulated')}</p><div class="modal-actions staff-popup-actions"><button class="btn btn-outline" onclick="EA_staffDismiss()">${t('staffAlertAcknowledge')}</button></div>`)}
function EA_staffDismiss(){EA_staffMarkSeen(EA_staffHighTasks().map(r=>r.id));closeModal();showToast(t('staffAlertReceipt'))}
function EA_staffOpenTask(id){const item=EA_staffHighTasks().find(r=>r.id===id);if(!item)return;EA_staffMarkSeen([id]);closeModal();V3_staffWork(id)}
function EA_staffOpenBell(){EA_staffModal(true)}
function EA_staffCanPop(){return V3_role==='staff' && (location.hash.slice(1).split('?')[0]==='tasks'||document.getElementById('view')?.querySelector('.v3-staff-head'))}
function EA_staffMaybePopup(){if(EA_staffCanPop())EA_staffModal(false)}
const EA_oldStaffPage=V3_tasksPage;
V3_tasksPage=function(){let html=EA_oldStaffPage();const tasks=EA_staffHighTasks(),unread=EA_staffUnseen();const banner=`<section class="staff-alert-summary ${tasks.length?'has-high':''}" aria-label="${t('staffAlertBell')}"><div class="staff-alert-icon">${ic('alert',21)}</div><div class="staff-alert-copy"><strong>${t('staffAlertBanner')}</strong><p>${tasks.length} ${t('staffAlertCount')} · ${unread.length} ${t('staffAlertUnread')}<br>${t('staffAlertSimulated')}</p></div><button class="btn ${tasks.length?'btn-danger':'btn-outline'}" onclick="EA_staffOpenBell()">${ic('alert',15)} ${t('staffAlertOpen')}</button></section>`;return html.replace('<div class="v3-staff-head',banner+'<div class="v3-staff-head')};
const EA_oldRender=render;
render=function(){EA_oldRender();let bell=document.getElementById('ea-staff-bell');if(V3_role==='staff'){
 if(!bell){const select=document.getElementById('role-picker');select.insertAdjacentHTML('beforebegin',`<button id="ea-staff-bell" class="staff-notification-bell" onclick="EA_staffOpenBell()" title="${t('staffAlertBell')}"></button>`)}
 EA_staffRefreshBell();
 document.querySelectorAll('.v3-task-grid .card').forEach(card=>{const id=card.querySelector('.report-id')?.textContent.trim();const r=reports.find(x=>x.id===id);if(r?.urgency==='high'){card.classList.add('staff-task-high');card.querySelector('.report-id')?.insertAdjacentHTML('afterend',`<span class="staff-priority-chip">${ic('alert',12)} ${t('high')}</span>`)}});
 // Entering the staff task page may reveal a newly assigned, verified high-priority case.
 EA_staffMaybePopup();
 }else if(bell)bell.remove();
};
const EA_oldSwitchRole=V3_changeRole;
V3_changeRole=function(role){EA_oldSwitchRole(role);if(role==='staff' && location.hash!=='#tasks')nav('tasks');else if(role==='staff')EA_staffMaybePopup()};
const EA_oldSetTeam=V3_setTeam;
V3_setTeam=function(team){EA_oldSetTeam(team);if(V3_role==='staff')EA_staffMaybePopup()};
const EA_oldResetDemo=V3_reset;
V3_reset=function(){const originalRecords=reports;EA_oldResetDemo();if(reports!==originalRecords){EA_staffSeen={};EA_storeSeen();render()}};
resetDemo=V3_reset;
// Initialise the count and staff alert on opening a restored staff session.
render();
