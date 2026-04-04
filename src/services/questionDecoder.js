const textarea = typeof document !== 'undefined' ? document.createElement('textarea') : null;

export function decodeHTML(html) {
  if (!textarea) return html;
  textarea.innerHTML = html;
  return textarea.value;
}
