// Backend API — Vercel Serverless Function
const API_URL = 'https://karate360-api.vercel.app/api/data';

async function apiRead() {
  var res = await fetch(API_URL);
  return await res.json();
}

async function apiAddRegistration(reg) {
  var res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _action: 'add', registration: reg })
  });
  return await res.json();
}

async function apiSaveAll(data) {
  var res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _action: 'save', data: data })
  });
  return await res.json();
}

async function apiDelete(id) {
  var res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _action: 'delete', id: id })
  });
  return await res.json();
}
