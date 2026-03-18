// ============================================================
// GOOGLE APPS SCRIPT — Fondamenti del Karate
// ============================================================
// SETUP (2 minuti):
//
// 1. Vai su https://script.google.com
// 2. Clicca "Nuovo progetto"
// 3. Cancella tutto il codice che c'è
// 4. Incolla TUTTO questo codice
// 5. Clicca "Esegui" (la prima volta chiede permessi — accetta tutto)
// 6. Clicca "Deploy" (in alto a destra) → "Nuova distribuzione"
//    - Tipo: "App web"
//    - Esegui come: "Me"
//    - Chi ha accesso: "Chiunque"
// 7. Clicca "Esegui il deployment"
// 8. COPIA l'URL che ti dà
// 9. Incolla quell'URL nel file config.js del progetto
//
// FATTO! Il backend è attivo.
// ============================================================

// Lo script usa lo Script Properties come database (niente fogli Google necessari)

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'read';

  if (action === 'read') {
    return readData();
  } else if (action === 'delete') {
    return deleteData(e.parameter.id);
  }

  return jsonResponse({ error: 'Azione non valida' });
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    if (body._fullReplace) {
      // Full data replacement (used by dashboard)
      PropertiesService.getScriptProperties().setProperty('data', JSON.stringify(body.data));
      return jsonResponse({ success: true });
    }

    // Add new registration
    var data = getData();
    if (!data.registrations) data.registrations = [];
    data.registrations.push(body);
    saveData(data);

    return jsonResponse({ success: true, id: body.id });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function getData() {
  var raw = PropertiesService.getScriptProperties().getProperty('data');
  if (!raw) return { registrations: [], lessons: [] };
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { registrations: [], lessons: [] };
  }
}

function saveData(data) {
  PropertiesService.getScriptProperties().setProperty('data', JSON.stringify(data));
}

function readData() {
  return jsonResponse(getData());
}

function deleteData(id) {
  if (!id) return jsonResponse({ error: 'ID mancante' });
  var data = getData();
  data.registrations = (data.registrations || []).filter(function(r) { return r.id !== id; });
  saveData(data);
  return jsonResponse({ success: true });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
