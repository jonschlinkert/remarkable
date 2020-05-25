var textarea;

export function decodeEntity(name) {
  textarea = textarea || document.createElement('textarea');
  textarea.innerHTML = '&' + name + ';';
  return textarea.value;
}
