// src/api.js
// simple fetch wrapper with JWT handling (localStorage)
const API_BASE = '/api'; // hoặc 'http://localhost:3000/api' nếu khác origin

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function clearToken() {
  localStorage.removeItem('token');
}

async function request(path, { method = 'GET', body = null, auth = false } = {}) {
  const headers = {};
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (!token) throw new Error('No token stored');
    headers['Authorization'] = 'Bearer ' + token;
  }

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body
  });

  const text = await res.text();
  const isJson = (() => {
    try { JSON.parse(text); return true; } catch (e) { return false; }
  })();
  const data = isJson ? JSON.parse(text) : text;

  if (!res.ok) {
    const err = new Error(data?.error || res.statusText || 'Request error');
    err.status = res.status;
    err.response = data;
    throw err;
  }
  return data;
}

export default { request, getToken, setToken, clearToken };
