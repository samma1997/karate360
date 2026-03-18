// ============================================
// CONFIGURAZIONE — Fondamenti del Karate
// ============================================
// Sostituisci con l'URL del tuo Google Apps Script
// (vedi google-apps-script.js per le istruzioni)
// ============================================

const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

// Helpers per il backend
async function apiRead() {
  if (API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
    // Demo mode — usa localStorage
    var raw = localStorage.getItem('karate360_data');
    return raw ? JSON.parse(raw) : { registrations: [], lessons: [] };
  }
  var res = await fetch(API_URL + '?action=read');
  return await res.json();
}

async function apiAddRegistration(reg) {
  if (API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
    var data = await apiRead();
    data.registrations.push(reg);
    localStorage.setItem('karate360_data', JSON.stringify(data));
    return { success: true };
  }
  var res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reg)
  });
  return await res.json();
}

async function apiSaveAll(data) {
  if (API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
    localStorage.setItem('karate360_data', JSON.stringify(data));
    return { success: true };
  }
  var res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _fullReplace: true, data: data })
  });
  return await res.json();
}

async function apiDelete(id) {
  if (API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
    var data = await apiRead();
    data.registrations = data.registrations.filter(function(r) { return r.id !== id; });
    localStorage.setItem('karate360_data', JSON.stringify(data));
    return { success: true };
  }
  var res = await fetch(API_URL + '?action=delete&id=' + encodeURIComponent(id));
  return await res.json();
}
