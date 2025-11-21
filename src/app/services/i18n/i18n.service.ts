import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type Translations = Record<string, string>;
export type SupportedLanguage = 'en' | 'fr' | 'de' | 'it' | 'es';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly STORAGE_KEY = 'cff-app-language';
  private readonly SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'fr', 'de', 'it', 'es'];
  private readonly DEFAULT_LANGUAGE: SupportedLanguage = 'fr';

  private currentLang: SupportedLanguage;
  private translations: Translations = {};

  private langSubject: BehaviorSubject<SupportedLanguage>;
  public lang$: Observable<SupportedLanguage>;

  constructor() {
    this.currentLang = this.detectInitialLanguage();
    this.langSubject = new BehaviorSubject<SupportedLanguage>(this.currentLang);
    this.lang$ = this.langSubject.asObservable();
    this.loadLanguage(this.currentLang);
  }

  private detectInitialLanguage(): SupportedLanguage {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored && this.isValidLanguage(stored)) {
      return stored as SupportedLanguage;
    }

    const browserLang = navigator.language.split('-')[0].toLowerCase();
    if (this.isValidLanguage(browserLang)) {
      return browserLang as SupportedLanguage;
    }

    return this.DEFAULT_LANGUAGE;
  }

  private isValidLanguage(lang: string): boolean {
    return this.SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
  }

  async loadLanguage(lang: SupportedLanguage): Promise<void> {
    try {
      const response = await fetch(`/i18n/messages.${lang}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      this.translations = await response.json();
      this.currentLang = lang;
      this.langSubject.next(lang);
    } catch (error) {
      console.error(`Failed to load language: ${lang}`, error);
      if (lang !== this.DEFAULT_LANGUAGE) {
        await this.loadLanguage(this.DEFAULT_LANGUAGE);
      }
    }
  }

  t(key: string, fallback?: string): string {
    return this.translations[key] || fallback || key;
  }

  getCurrentLang(): SupportedLanguage {
    return this.currentLang;
  }

  getSupportedLanguages(): SupportedLanguage[] {
    return [...this.SUPPORTED_LANGUAGES];
  }

  async setLanguage(lang: SupportedLanguage): Promise<void> {
    if (!this.isValidLanguage(lang)) {
      console.warn(`Unsupported language: ${lang}`);
      return;
    }
    localStorage.setItem(this.STORAGE_KEY, lang);
    await this.loadLanguage(lang);
  }
}
