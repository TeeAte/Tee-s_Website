export function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getCookie(request, name) {
  const cookieString = request.headers.get('Cookie');
  if (!cookieString) return null;
  const cookies = cookieString.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
}

export function setCookie(response, name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const cookieString = `${name}=${value}; expires=${expires}; path=/; HttpOnly; SameSite=Lax`;
  response.headers.append('Set-Cookie', cookieString);
}

export function isAuthenticated(request) {
  const token = getCookie(request, 'admin_token');
  return token === 'secret-admin-token';
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function errorResponse(message, status = 500) {
  return jsonResponse({ error: message, success: false }, status);
}
