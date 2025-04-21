export function escapeHtml(text) {
  // Escape HTML special characters
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """)
    .replace(/'/g, "&#039;");
}

export function sanitizeInput(input) {
  // Basic sanitization by escaping HTML
  if (typeof input !== 'string') return '';
  return escapeHtml(input);
}
