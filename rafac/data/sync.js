export const FORM_KEY     = 'rafac_1701_formStatus';
export const ENQUIRY_KEY  = 'rafac_join_enquiries';

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
