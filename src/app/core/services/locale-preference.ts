import { computed, Injectable, signal } from '@angular/core';
import { LANG_STORAGE_KEY, readStoredLang } from '../i18n/lang-storage';

@Injectable({ providedIn: 'root' })
export class LocalePreferenceService {
  readonly activeLang = signal<string>(readStoredLang());

  readonly currencyCode = computed(() =>
    this.activeLang() === 'vi' ? 'VND' : 'USD',
  );

  readonly numberLocale = computed(() =>
    this.activeLang() === 'vi' ? 'vi-VN' : 'en-US',
  );

  setLang(lang: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
    this.activeLang.set(lang);
  }
}
