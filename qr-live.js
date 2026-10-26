/* EventAccess V3 — actual scannable, location-aware GitHub Pages QR entries.
 * Location is selected by the URL; it is not inferred from GPS, indoor sensors, or a verified physical position.
 */
const EA_QR_URL = 'https://izzathykall.github.io/EventAccess/';
const EA_QR_STARTS = Object.freeze(['entrance', 'registration', 'hall']);
const EA_QR_IMAGES = Object.freeze({
  entrance: 'assets/qr-north-entrance.png',
  registration: 'assets/qr-registration.png',
  hall: 'assets/qr-main-hall.png'
});
function EA_locationUrl(id) {
  if (!EA_QR_STARTS.includes(id)) return EA_QR_URL;
  return EA_QR_URL + '?entry=' + encodeURIComponent(id) + '#map';
}
function EA_applyQrEntry() {
  const selected = new URLSearchParams(window.location.search).get('entry');
  if (!EA_QR_STARTS.includes(selected)) return;
  // Visitors arrive in Attendee mode even if this device previously viewed the organiser dashboard.
  V3_role = 'attendee';
  savePreference('ea3_role', 'attendee');
  qrChoice = selected;
  chosen = selected;
  start = selected;
  dest = 'toilet';
  currentRoute = null;
  V3_qr = selected;
  V3_floor = V3_LOCATION_FLOOR(selected);
  // A normal hash works with static hosting, including the /EventAccess/ project subpath.
  if (location.hash !== '#map') location.hash = '#map';
  render();
}
function EA_qrName(id) {
  return V3_labelLoc(id);
}
// The HTTPS links are real, while venue position itself remains a labelled simulation.
i18n.en.qrConcept = 'Venue QR Codes';
i18n.ms.qrConcept = 'Kod QR Lokasi';
// Replace the earlier concept-only modal with a real, location-specific QR and direct link.
drawQr = function EA_drawLiveQr() {
  const id = EA_QR_STARTS.includes(qrChoice) ? qrChoice : 'entrance';
  const url = EA_locationUrl(id);
  const malay = language === 'ms';
  const label = EA_qrName(id);
  const description = malay
    ? 'Imbas kod ini menggunakan kamera telefon. Ia membuka laman GitHub Pages dan memilih lokasi permulaan contoh secara automatik.'
    : 'Scan this code using your phone camera. It opens the GitHub Pages site and automatically selects the example starting location.';
  const note = malay
    ? 'Lokasi ini ialah simulasi berdasarkan QR yang diimbas, bukan kedudukan GPS sebenar.'
    : 'The QR determines a simulated starting position, not a real GPS or indoor location.';
  modal(`<div class="modal-head"><div><div class="kicker">${ic('qr',15)} ${malay?'AKSES QR SEBENAR':'LIVE WEBSITE QR'}</div><h3>${malay?'Kod QR Lokasi EventAccess':'EventAccess location QR'}</h3></div><button class="close-btn" aria-label="${t('close')}" onclick="closeModal()">${ic('close')}</button></div>
    <div class="qr-live-body"><p class="modal-desc">${description}</p>
      <strong class="qr-live-place">${ic('pin',17)} ${esc(label)}</strong>
      <img class="qr-code" src="${EA_QR_IMAGES[id]}" alt="${esc(label)} — ${malay?'kod QR pautan laman EventAccess':'QR linking to the EventAccess website'}" />
      <p class="subnote">${malay?'Pilih lokasi QR:':'Choose QR placement:'}</p>
      <div class="qr-choices">${EA_QR_STARTS.map(k=>`<button class="${id===k?'selected':''}" onclick="qrChoice='${k}';drawQr()">${esc(EA_qrName(k))}</button>`).join('')}</div>
      <a class="qr-live-link" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>
      <div class="qr-live-actions"><a class="btn btn-outline" href="${EA_QR_IMAGES[id]}" download="EventAccess-QR-${id}.png">${ic('qr',16)} ${malay?'Simpan QR':'Save QR'}</a>
        <a class="btn btn-main" href="${url}" target="_blank" rel="noopener noreferrer">${ic('arrow',16)} ${malay?'Buka pautan sebenar':'Open location URL'}</a>
        <button class="btn btn-soft" onclick="startQrJourney()">${malay?'Simulasi dalam laman':'Preview in current page'}</button></div>
      <p class="tiny-note">${note}</p>
    </div>`);
};
EA_applyQrEntry();
render();
