/* EventAccess V3 · Smart Urgency Classification (educational rules-based decision support).
   IMPORTANT: Does not determine real emergencies, notify staff, close facilities or verify
   incident reports. The attendee may override the suggestion; the organiser reviews
   the final priority separately from confirming the underlying report. */
'use strict';

const EA_URGENCY_MESSAGES = {
  en: {
    urgencyTitle:'Smart Urgency Recommendation', urgencySubtitle:'Rule-based suggestion · example venue only',
    urgencyPrompt:'Choose an issue type and location to receive a suggested priority.',
    urgencyLevel:'Suggested urgency', urgencyCurrent:'Selected urgency',
    urgencyAuto:'Suggestion applied', urgencyManual:'Manually selected by attendee',
    urgencyRestore:'Use suggested level', urgencyHelper:'Based on issue type and the fictional access graph. You may adjust the selection. The organiser confirms the final urgency during review.',
    urgencyReviewTitle:'Organiser priority review',urgencyReviewNote:'Confirm or adjust urgency independently of verifying the report. The model suggestion is not proof of danger.',
    urgencyRecorded:'Urgency confirmed by organiser', urgencyAwaiting:'Awaiting organiser priority review',
    urgencySuggested:'System suggestion', urgencySelected:'Attendee selection',urgencyFinal:'Organiser-confirmed priority',
    urgencyConfirmedMessage:'Organiser priority recorded', urgencyAnalyticTitle:'Urgency distribution',
    urgencyActiveHigh:'High-priority open reports', urgencySort:'Open reports first; then urgency (High → Medium → Low)',
    urgencyLimits:'Illustrative decision support only. For immediate safety hazards, contact on-site staff; no automatic emergency response.',
    urgencySummary:'Suggested: {suggested} · Selected: {selected}',
    urgencyRuleSoleLift:'The only modelled step-free connection between levels uses this lift.',
    urgencyRuleAccessibleToilet:'This is the only modelled accessible toilet on the selected floor.',
    urgencyRuleNoRoute:'The reported blockage would leave at least one example facility inaccessible from Registration.',
    urgencyRuleDetour:'The example graph still has an alternative accessible route around this obstruction.',
    urgencyRuleBlocked:'A potential route obstruction warrants prompt inspection, even though no closure is verified.',
    urgencyRuleMainSign:'Wayfinding at a key access point can affect navigation and orientation.',
    urgencyRuleMinorSign:'Signage issues generally need follow-up but do not necessarily close a corridor.',
    urgencyRuleStandard:'This category requires individual review; Medium is used as a starting point.',
    urgencyRuleSelect:'Select an issue type and location for a suggestion.',
    urgencyReviewEvent:'Urgency reviewed by organiser',
    urgencyLabelHigh:'High',urgencyLabelMedium:'Medium',urgencyLabelLow:'Low'
  },
  ms: {
    urgencyTitle:'Cadangan Tahap Keutamaan Pintar', urgencySubtitle:'Cadangan berasaskan peraturan · lokasi contoh sahaja',
    urgencyPrompt:'Pilih jenis isu dan lokasi untuk melihat cadangan tahap keutamaan.',
    urgencyLevel:'Keutamaan dicadangkan', urgencyCurrent:'Keutamaan dipilih',
    urgencyAuto:'Cadangan digunakan', urgencyManual:'Dipilih sendiri oleh pengunjung',
    urgencyRestore:'Gunakan cadangan', urgencyHelper:'Berdasarkan jenis isu dan graf laluan rekaan. Pengunjung boleh mengubah pilihan. Penganjur mengesahkan keutamaan akhir semasa semakan.',
    urgencyReviewTitle:'Semakan keutamaan penganjur',urgencyReviewNote:'Sahkan atau ubah keutamaan secara berasingan daripada pengesahan laporan. Cadangan sistem bukan bukti bahaya.',
    urgencyRecorded:'Keutamaan disahkan penganjur', urgencyAwaiting:'Menunggu semakan keutamaan penganjur',
    urgencySuggested:'Cadangan sistem', urgencySelected:'Pilihan pengunjung',urgencyFinal:'Keutamaan akhir penganjur',
    urgencyConfirmedMessage:'Keutamaan disahkan penganjur', urgencyAnalyticTitle:'Taburan keutamaan',
    urgencyActiveHigh:'Laporan keutamaan tinggi yang aktif', urgencySort:'Laporan aktif didahulukan; kemudian mengikut keutamaan (Tinggi → Sederhana → Rendah)',
    urgencyLimits:'Panduan simulasi sahaja. Untuk bahaya segera, hubungi petugas lokasi; tiada respons kecemasan automatik.',
    urgencySummary:'Cadangan: {suggested} · Dipilih: {selected}',
    urgencyRuleSoleLift:'Lif ini ialah satu-satunya sambungan antara aras tanpa tangga dalam graf contoh.',
    urgencyRuleAccessibleToilet:'Ini ialah satu-satunya tandas OKU yang dipetakan pada aras tersebut.',
    urgencyRuleNoRoute:'Halangan ini menyebabkan sekurang-kurangnya satu kemudahan contoh tidak dapat diakses dari Pendaftaran.',
    urgencyRuleDetour:'Graf contoh masih mempunyai laluan alternatif mesra akses untuk mengelak halangan ini.',
    urgencyRuleBlocked:'Potensi halangan laluan memerlukan pemeriksaan walaupun penutupan belum disahkan.',
    urgencyRuleMainSign:'Papan tanda pada titik akses utama boleh mengganggu navigasi dan orientasi.',
    urgencyRuleMinorSign:'Masalah papan tanda memerlukan tindakan tetapi tidak semestinya menutup koridor.',
    urgencyRuleStandard:'Kategori ini memerlukan semakan individu; Sederhana digunakan sebagai titik permulaan.',
    urgencyRuleSelect:'Pilih jenis isu dan lokasi untuk melihat cadangan.',
    urgencyReviewEvent:'Keutamaan disemak penganjur',
    urgencyLabelHigh:'Tinggi',urgencyLabelMedium:'Sederhana',urgencyLabelLow:'Rendah'
  }
};
for (const lang of ['en','ms']) Object.assign(i18n[lang],EA_URGENCY_MESSAGES[lang]);
const EA_URGENCY_VALUES = ['low','medium','high'];
function EA_urgencyRank(value){return ({low:1,medium:2,high:3})[value]||2}
function EA_activeRank(r){return (r.status!=='Resolved'&&r.status!=='Rejected')?1:0}
function EA_chip(level){const val=EA_URGENCY_VALUES.includes(level)?level:'medium';return `<span class="chip ${val==='high'?'red':val==='medium'?'amber':'green'}">${esc(t(val))}</span>`}
function EA_isValidType(type){return problems.some(x=>x[0]===type)}
function EA_isValidLoc(loc){return Boolean(facility[loc]||areas[loc])}
function EA_hypotheticalEdge(location){
  const pairs={eastcorridor:['firstaid','toilet'],westcorridor:['crosswest','registration'],maincorridor:['crossEast','crossMid'],registration:['crosswest','registration'],firstaid:['firstaid','toilet'],toilet:['firstaid','toilet'],hall:['crossMid','hall'],entrance:['entrance','registration'],lift:['crossEast','lift'],prayer:['crossQuiet','prayer'],quiet:['crossQuiet','quiet'],studio:['upperLobby','studio'],lounge:['upperLobby','lounge'],toilet1:['lounge','toilet1'],upperLift:['upperLift','upperLobby'],upperLobby:['upperLift','upperLobby']};
  return pairs[location]?edgeKey(...pairs[location]):null;
}
function EA_canReach(from,to,excludedEdge){
  if(!nodes[from]||!nodes[to])return false;
  const visited=new Set([from]),q=[from];
  for(let k=0;k<q.length;k++){
    const u=q[k];if(u===to)return true;
    for(const [a,b] of networkEdges){
      const v=a===u?b:b===u?a:null;
      if(!v||edgeKey(a,b)===excludedEdge||visited.has(v))continue;
      visited.add(v);q.push(v);
    }
  }
  return false;
}
function EA_assessUrgency(type,loc){
  if(!EA_isValidType(type)||!EA_isValidLoc(loc))return {level:'medium',reason:'urgencyRuleSelect',ready:false};
  if(type==='liftbroken'){
    // The single accessible inter-floor lift in this example building is a critical connector.
    return (loc==='lift'||loc==='upperLift')?{level:'high',reason:'urgencyRuleSoleLift',ready:true}:{level:'medium',reason:'urgencyRuleStandard',ready:true};
  }
  if(type==='toiletbroken'){
    return ['toilet','toilet1'].includes(loc)?{level:'high',reason:'urgencyRuleAccessibleToilet',ready:true}:{level:'medium',reason:'urgencyRuleStandard',ready:true};
  }
  if(type==='blocked'){
    const edge=EA_hypotheticalEdge(loc);
    if(!edge)return{level:'medium',reason:'urgencyRuleBlocked',ready:true};
    // Scenario graph check ONLY: compare reachability from Registration before/after
    // removing the allegedly blocked edge; this has no effect on real map restrictions.
    const important=['entrance','hall','firstaid','lift','toilet','quiet','prayer','upperLobby','studio','lounge','toilet1'];
    const inaccessible=important.some(target=>EA_canReach('registration',target,null)&&!EA_canReach('registration',target,edge));
    return inaccessible?{level:'high',reason:'urgencyRuleNoRoute',ready:true}:{level:'medium',reason:'urgencyRuleDetour',ready:true};
  }
  if(type==='signage'){
    return ['entrance','registration','lift','upperLift'].includes(loc)?{level:'medium',reason:'urgencyRuleMainSign',ready:true}:{level:'low',reason:'urgencyRuleMinorSign',ready:true};
  }
  return{level:'medium',reason:'urgencyRuleStandard',ready:true};
}
function EA_recommendationCard(){
  return `<div id="ea-urgency-adviser" class="urgency-adviser" aria-live="polite"><div class="urgency-head"><span class="urgency-head-icon">${ic('shield',18)}</span><div><h3>${t('urgencyTitle')}</h3><p>${t('urgencySubtitle')}</p></div><span id="ea-urgency-recommend-chip" class="chip">—</span></div><p class="urgency-rationale" id="ea-urgency-rationale">${t('urgencyPrompt')}</p><div class="urgency-selection"><span id="ea-urgency-selection-mode"></span><button id="ea-urgency-use" type="button" class="urgency-use" onclick="EA_useRecommended()" hidden>${t('urgencyRestore')}</button></div><p class="urgency-helper">${t('urgencyHelper')}</p></div>`;
}
let EA_manualUrgency=false;
let EA_suggestion={level:'medium',reason:'urgencyRuleSelect',ready:false};
const EA_previousReportPage=reportPage;
reportPage=function(){
  EA_manualUrgency=false;
  EA_suggestion={level:'medium',reason:'urgencyRuleSelect',ready:false};
  const markup=EA_previousReportPage();
  const anchor='<div class="form-group"><label class="form-label" for="issue-description">';
  if(!markup.includes(anchor))return markup;
  return markup.replace(anchor,EA_recommendationCard()+anchor);
};
function EA_refreshUrgency(){
  const type=document.getElementById('issue-type')?.value;
  const loc=document.getElementById('issue-location')?.value;
  const selected=document.getElementById('issue-priority');
  const root=document.getElementById('ea-urgency-adviser');
  if(!selected||!root)return;
  EA_suggestion=EA_assessUrgency(type,loc);
  if(EA_suggestion.ready&&!EA_manualUrgency)selected.value=EA_suggestion.level;
  const chip=document.getElementById('ea-urgency-recommend-chip');
  chip.innerHTML=EA_suggestion.ready?EA_chip(EA_suggestion.level):'—';
  document.getElementById('ea-urgency-rationale').textContent=EA_suggestion.ready?t(EA_suggestion.reason):t('urgencyPrompt');
  const mode=document.getElementById('ea-urgency-selection-mode');
  const manual=EA_manualUrgency&&selected.value!==EA_suggestion.level;
  mode.textContent=EA_suggestion.ready?`${t(manual?'urgencyManual':'urgencyAuto')}: ${t(selected.value)}`:'';
  document.getElementById('ea-urgency-use').hidden=!manual;
  root.classList.toggle('is-manual',manual);
}
function EA_useRecommended(){
  const control=document.getElementById('issue-priority');
  if(!control||!EA_suggestion.ready)return;
  EA_manualUrgency=false;
  control.value=EA_suggestion.level;
  EA_refreshUrgency();
}
document.addEventListener('change',event=>{
  if(['issue-type','issue-location'].includes(event.target?.id))EA_refreshUrgency();
  if(event.target?.id==='issue-priority'){
    EA_manualUrgency=true; EA_refreshUrgency();
  }
});
// Enhance organiser dialogue with an independent, editable final priority.
function EA_organiserPriorityMarkup(r){
  const assessment=r.suggestedUrgency&&EA_URGENCY_VALUES.includes(r.suggestedUrgency)?{level:r.suggestedUrgency,reason:r.urgencyReasonCode}:{...EA_assessUrgency(r.category,r.loc)};
  return `<div class="urgency-review" id="ea-priority-review"><div class="urgency-review-heading">${ic('shield',16)}<strong>${t('urgencyReviewTitle')}</strong></div><div class="urgency-review-comparison"><div><small>${t('urgencySuggested')}</small>${EA_chip(assessment.level)}</div><div><small>${t('urgencySelected')}</small>${EA_chip(r.urgency)}</div></div><p class="tiny-note">${t(assessment.reason||'urgencyRuleStandard')}</p><div class="form-group"><label class="form-label" for="ea-organiser-priority">${t('urgencyFinal')}</label><select class="form-control" id="ea-organiser-priority">${EA_URGENCY_VALUES.map(v=>`<option value="${v}" ${r.urgency===v?'selected':''}>${esc(t(v))}</option>`).join('')}</select></div><p class="tiny-note">${t('urgencyReviewNote')}</p><div class="urgency-review-status">${ic(r.urgencyConfirmed?'check':'clock',14)} ${t(r.urgencyConfirmed?'urgencyRecorded':'urgencyAwaiting')}</div></div>`;
}
const EA_previousReview=V3_review;
V3_review=function(id){
  EA_previousReview(id);
  const r=reports.find(x=>x.id===id);
  if(!r||r.verification==='rejected'||r.status==='Resolved')return;
  const reference=document.getElementById('v3-review-note');
  if(reference){
    // Insert before the follow-up note. Both pending and verified state dialogs include one.
    reference.closest('.form-group').insertAdjacentHTML('beforebegin',EA_organiserPriorityMarkup(r));
  }
};
function EA_recordOrganiserPriority(r){
  const control=document.getElementById('ea-organiser-priority');
  if(!r||!control)return;
  const priority=control.value;
  if(!EA_URGENCY_VALUES.includes(priority))return;
  const changed=r.urgency!==priority||!r.urgencyConfirmed;
  r.urgency=priority;
  r.urgencyConfirmed=true;
  r.urgencyReviewedAt=V3_now();
  if(changed)r.history.push(V3_event('urgencyReviewEvent','Organiser',t('urgencyConfirmedMessage')+': '+t(priority)));
}
const EA_previousVerifyDecision=V3_verifyDecision;
V3_verifyDecision=function(decision){
  const r=reports.find(x=>x.id===selectedTicket);
  if(decision==='verified'&&r?.verification==='pending')EA_recordOrganiserPriority(r);
  EA_previousVerifyDecision(decision);
};
const EA_previousAssign=V3_assign;
V3_assign=function(){
  const r=reports.find(x=>x.id===selectedTicket);
  // Do not change any data if assignment will be refused.
  if(r?.verification==='verified'&&document.getElementById('v3-assign')?.value!=='Unassigned')EA_recordOrganiserPriority(r);
  EA_previousAssign();
};
const EA_previousConfirmResolved=V3_confirmResolved;
V3_confirmResolved=function(){
  const r=reports.find(x=>x.id===selectedTicket);
  if(r?.verification==='verified'&&r.status==='Ready for review')EA_recordOrganiserPriority(r);
  EA_previousConfirmResolved();
};
const EA_previousTrackCard=V3_trackCard;
V3_trackCard=function(r,compact=false){
  return EA_previousTrackCard(r,compact).replace('<div class="v3-chip-stack">',`<div class="v3-chip-stack">${EA_chip(r.urgency)}`);
};
const EA_previousTrack=V3_viewTracking;
V3_viewTracking=function(id){
  EA_previousTrack(id);
  const r=reports.find(x=>x.id===id);
  if(!r)return;
  const modalElement=document.querySelector('#modal-root .modal');
  const steps=modalElement?.querySelector('.v3-timeline');
  if(steps){
    const suggestion=r.suggestedUrgency||EA_assessUrgency(r.category,r.loc).level;
    steps.insertAdjacentHTML('beforebegin',`<div class="urgency-track-summary"><div>${t('urgencySuggested')}: ${EA_chip(suggestion)}</div><div>${t(r.urgencyConfirmed?'urgencyFinal':'urgencySelected')}: ${EA_chip(r.urgency)}</div></div>`);
  }
};
// The tracker page renders report references and urgency; the dashboard adds rank and counts.
const EA_previousDashboard=V3_dashboard;
V3_dashboard=function(){
  let html=EA_previousDashboard();
  const activeHigh=reports.filter(r=>EA_activeRank(r)&&r.urgency==='high').length;
  const panel=`<div class="urgency-dashboard-note">${ic('alert',17)} <strong>${activeHigh} ${t('urgencyActiveHigh')}</strong><span>${t('urgencySort')}</span></div>`;
  html=html.replace('<div class="dash-layout">',panel+'<div class="dash-layout">');
  // Present colour-coded urgency alongside incident title, including status distinction.
  return html;
};
const EA_previousAnalytics=V3_analyticsPage;
V3_analyticsPage=function(){
  let html=EA_previousAnalytics();
  const levels=['high','medium','low'].map(x=>({label:t(x),count:reports.filter(r=>r.urgency===x).length}));
  const chart=`<section class="card pad"><h2 class="section-head">${t('urgencyAnalyticTitle')}</h2><p class="subnote">${t('urgencyHelper')}</p>${V3_barChart(levels)}</section>`;
  return html.replace('<div class="v3-analytics-grid">','<div class="v3-analytics-grid">'+chart);
};
// Existing saved reports from earlier releases still load; missing smart metadata is computed
// for display only and is never silently submitted or reclassified.
