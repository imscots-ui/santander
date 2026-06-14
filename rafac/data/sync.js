export const FORM_KEY    = 'rafac_1701_formStatus';
export const DETAIL_KEY  = 'rafac_1701_formDetail';
export const ENQUIRY_KEY = 'rafac_join_enquiries';

// --- Overall status (signed/sent/unsent) per event+cadet ---
export function getFormStatus() {
  try { return JSON.parse(localStorage.getItem(FORM_KEY) || '{}'); } catch { return {}; }
}
export function setFormStatus(eventId, cadetId, status) {
  const all = getFormStatus();
  if (!all[eventId]) all[eventId] = {};
  all[eventId][cadetId] = status;
  localStorage.setItem(FORM_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent('rafac-form-update', { detail: { eventId, cadetId, status } }));
}

// --- Per-form detail (tg21 / tg23 / flying) per event+cadet ---
export function getFormDetail() {
  try { return JSON.parse(localStorage.getItem(DETAIL_KEY) || '{}'); } catch { return {}; }
}
export function submitForm(eventId, cadetId, formType, data) {
  const all = getFormDetail();
  if (!all[eventId]) all[eventId] = {};
  if (!all[eventId][cadetId]) all[eventId][cadetId] = {};
  all[eventId][cadetId][formType] = {
    signed: true,
    signedAt: new Date().toISOString(),
    ...data,
  };
  localStorage.setItem(DETAIL_KEY, JSON.stringify(all));
  // Mirror to overall status if all required forms for this event are done
  window.dispatchEvent(new CustomEvent('rafac-form-update', { detail: { eventId, cadetId, formType } }));
}
export function getFormDetail1(eventId, cadetId) {
  return getFormDetail()[eventId]?.[cadetId] || {};
}

// --- Web enquiries ---
export function getWebEnquiries() {
  try { return JSON.parse(localStorage.getItem(ENQUIRY_KEY) || '[]'); } catch { return []; }
}
export function pushWebEnquiry(enquiry) {
  const existing = getWebEnquiries();
  existing.push(enquiry);
  localStorage.setItem(ENQUIRY_KEY, JSON.stringify(existing));
  window.dispatchEvent(new CustomEvent('rafac-join-enquiry', { detail: enquiry }));
}
export function clearWebEnquiries() {
  localStorage.removeItem(ENQUIRY_KEY);
}
