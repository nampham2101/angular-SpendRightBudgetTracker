export const LANG_STORAGE_KEY = 'lang';

export function readStoredLang(): string {
  if (typeof localStorage === 'undefined') {
    return 'en';
  }
  return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
}
