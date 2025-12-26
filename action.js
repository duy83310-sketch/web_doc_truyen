import api from "./api.js";

// 1) Register
export async function register({ username, email, password, full_name }) {
  return api.request("/auth/register", {
    method: "POST",
    body: { username, email, password, full_name },
  });
}

// 2) Login
export async function login({ usernameOrEmail, password }) {
  const data = await api.request("/auth/login", {
    method: "POST",
    body: { usernameOrEmail, password },
  });
  if (data.token) api.setToken(data.token);
  return data;
}

// 3) Get Profile
export async function getProfile() {
  return api.request("/auth/me", { auth: true });
}

// 4) Get Stories (CẬP NHẬT: Xử lý response mới)
export async function getStories(q = "") {
  const path = q ? `/stories?q=${encodeURIComponent(q)}` : "/stories";
  const res = await api.request(path);
  // Backend mới trả về { data, pagination }, trả về data để tương thích code cũ
  return res.data ? res.data : res;
}

// 5) Create Story (CẬP NHẬT: Dùng FormData để upload ảnh)
export async function createStory({
  title,
  author,
  summary,
  status = "Đang tiến hành",
  genre_ids = [],
}) {
  // Vì backend yêu cầu upload ảnh, ta phải dùng FormData
  // Ở môi trường test action.js này ta không có file thật, nên chỉ gửi text
  // Backend đã thiết kế để file là optional (nếu không gửi file thì cover_image_url = null)

  const formData = new FormData();
  formData.append("title", title);
  formData.append("author", author);
  formData.append("summary", summary);
  formData.append("status", status);

  // Xử lý mảng genre_ids
  if (Array.isArray(genre_ids)) {
    genre_ids.forEach((id) => formData.append("genre_ids", id));
  }

  // Lưu ý: api.js cần được update để không tự động set Content-Type là json nếu body là FormData
  // (Đã kiểm tra api.js cũ của bạn, nó có dòng "if (body && !(body instanceof FormData))", nên code này sẽ chạy đúng)

  return api.request("/stories", {
    method: "POST",
    auth: true,
    body: formData,
  });
}

// 6) Add favorite
export async function addFavorite(story_id) {
  return api.request("/favorites", {
    method: "POST",
    auth: true,
    body: { story_id },
  });
}

// 7) Add rating
export async function addRating({ story_id, score, comment }) {
  return api.request("/ratings", {
    method: "POST",
    auth: true,
    body: { story_id, score, comment },
  });
}

// 8) Get chapters
export async function getChapters(storyId) {
  return api.request(`/stories/${storyId}/chapters`);
  // API này vẫn trả mảng chương như cũ nên không cần sửa
}
