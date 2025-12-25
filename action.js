// src/actions.js
import api from './api.js';

// 1) Register
export async function register({ username, email, password, full_name }) {
  return api.request('/auth/register', {
    method: 'POST',
    body: { username, email, password, full_name }
  });
}

// 2) Login -> lưu token
export async function login({ usernameOrEmail, password }) {
  const data = await api.request('/auth/login', {
    method: 'POST',
    body: { usernameOrEmail, password }
  });
  if (data.token) api.setToken(data.token);
  return data;
}

// 3) Get current user profile
export async function getProfile() {
  return api.request('/auth/me', { auth: true });
}

// 4) Get public stories
export async function getStories(q = '') {
  const path = q ? `/stories?q=${encodeURIComponent(q)}` : '/stories';
  return api.request(path);
}

// 5) Create story (admin-only)
export async function createStory({ title, author, summary, status = 'Đang tiến hành', genre_ids = [] }) {
  return api.request('/stories', {
    method: 'POST',
    auth: true,
    body: { title, author, summary, status, genre_ids }
  });
}

// 6) Add favorite (user)
export async function addFavorite(story_id) {
  return api.request('/favorites', {
    method: 'POST',
    auth: true,
    body: { story_id }
  });
}

// 7) Add rating (user)
export async function addRating({ story_id, score, comment }) {
  return api.request('/ratings', {
    method: 'POST',
    auth: true,
    body: { story_id, score, comment }
  });
}

// 8) Get chapters of story
export async function getChapters(storyId) {
  return api.request(`/stories/${storyId}/chapters`);
}

// 9) Create chapter (admin or creator)
export async function createChapter({ story_id, chapter_number, title, content }) {
  return api.request('/chapters', {
    method: 'POST',
    auth: true,
    body: { story_id, chapter_number, title, content }
  });
}
