// ============================================================
// GOOGLE APPS SCRIPT — Karate 360 Backend
// ============================================================
// ISTRUZIONI SETUP:
// 1. Crea un nuovo Google Sheet (https://sheets.new)
// 2. Rinomina il foglio in "Registrazioni"
// 3. Nella riga 1, metti le intestazioni:
//    A1: ID | B1: Nome | C1: Telefono | D1: Slot | E1: Note | F1: Data
// 4. Vai su Estensioni > Apps Script
// 5. Cancella tutto e incolla QUESTO codice
// 6. Fai Deploy > Nuova distribuzione
//    - Tipo: App web
//    - Esegui come: Me
//    - Chi ha accesso: Chiunque
// 7. Copia l'URL e incollalo in config.js del progetto
// ============================================================

const SHEET_NAME = 'Registrazioni';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const action = e.parameter.action || 'read';

    if (action === 'write') {
      return writeData(e, headers);
    } else if (action === 'delete') {
      return deleteData(e, headers);
    } else {
      return readData(headers);
    }
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function writeData(e, headers) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  let data;
  if (e.postData) {
    data = JSON.parse(e.postData.contents);
  } else {
    data = e.parameter;
  }

  const id = Utilities.getUuid();
  const now = new Date().toISOString();

  sheet.appendRow([
    id,
    data.name || '',
    data.phone || '',
    data.slots || '',
    data.notes || '',
    now
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true, id: id }))
    .setMimeType(ContentService.MimeType.JSON);
}

function readData(headers) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, registrations: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const registrations = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    registrations.push({
      id: row[0],
      name: row[1],
      phone: row[2],
      slots: row[3] ? row[3].split(',').map(function(s) { return s.trim(); }) : [],
      notes: row[4],
      timestamp: row[5]
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify({ success: true, registrations: registrations }))
    .setMimeType(ContentService.MimeType.JSON);
}

function deleteData(e, headers) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const idToDelete = e.parameter.id;

  if (!idToDelete) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'ID mancante' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === idToDelete) {
      sheet.deleteRow(i + 1);
      break;
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
