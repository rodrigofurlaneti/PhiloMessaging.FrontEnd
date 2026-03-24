/**
 * Gerador de UUID v4 usando a Web Crypto API nativa do browser.
 * Substitui o pacote 'uuid' sem nenhuma dependência externa.
 * Compatível com todos os browsers modernos (Chrome 92+, Firefox 95+, Safari 15.4+).
 */
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback para browsers mais antigos
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
