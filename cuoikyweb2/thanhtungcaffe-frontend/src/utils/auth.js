import { jwtDecode } from "jwt-decode";

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function getUsername() {
  const token = getToken();
  if (!token) return null;
  try {
    const d = jwtDecode(token);
    return d.sub || d.username || d.user || null;
  } catch {
    return null;
  }
}

export function getUserRole() {
  const token = getToken();
  if (!token) return null;
  try {
    const d = jwtDecode(token);
    return d.role || d.roles || d.authorities || null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  removeToken();
  window.location.href = "/login";
}
