import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type Translations = Record<string, string>;

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLang = 'fr';
  private translations: Translations = {};

  private langSubject = new BehaviorSubject<string>('fr');
  public lang$: Observable<string> = this.langSubject.asObservable();

  constructor() {
    this.loadLanguage(this.currentLang);
  }

  async loadLanguage(lang: string): Promise<void> {
    try {
      const response = await fetch(`/i18n/messages.${lang}.json`);
      this.translations = await response.json();
      this.currentLang = lang;
      this.langSubject.next(lang);
    } catch (error) {
      console.error(`Failed to load language: ${lang}`, error);
    }
  }

  t(key: string, fallback?: string): string {
    return this.translations[key] || fallback || key;
  }

  getCurrentLang(): string {
    return this.currentLang;
  }

  async setLanguage(lang: string): Promise<void> {
    await this.loadLanguage(lang);
  }
}
