import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AlertPrefs {
  minDelayMin: number;
  avoidLines: string[];
  lifts: boolean;
}

export interface UiPrefs {
  fontScale: number;
  highContrast: boolean;
  theme: 'system' | 'light' | 'dark';
}

export interface AppSettings {
  alert: AlertPrefs;
  ui: UiPrefs;
}

const DEFAULT_SETTINGS: AppSettings = {
  alert: {
    minDelayMin: 5,
    avoidLines: [],
    lifts: false
  },
  ui: {
    fontScale: 1.0,
    highContrast: false,
    theme: 'system'
  }
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly STORAGE_KEY = 'cff-app-settings';

  private settingsSubject = new BehaviorSubject<AppSettings>(this.loadSettings());
  public settings$: Observable<AppSettings> = this.settingsSubject.asObservable();

  constructor() {
    this.applyUiSettings(this.settingsSubject.value.ui);
  }

  private loadSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          alert: { ...DEFAULT_SETTINGS.alert, ...parsed.alert },
          ui: { ...DEFAULT_SETTINGS.ui, ...parsed.ui }
        };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return DEFAULT_SETTINGS;
  }

  private saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
      this.settingsSubject.next(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  getSettings(): AppSettings {
    return this.settingsSubject.value;
  }

  getAlertPrefs(): AlertPrefs {
    return this.settingsSubject.value.alert;
  }

  getUiPrefs(): UiPrefs {
    return this.settingsSubject.value.ui;
  }

  updateAlertPrefs(prefs: Partial<AlertPrefs>): void {
    const current = this.settingsSubject.value;
    const updated = {
      ...current,
      alert: { ...current.alert, ...prefs }
    };
    this.saveSettings(updated);
  }

  updateUiPrefs(prefs: Partial<UiPrefs>): void {
    const current = this.settingsSubject.value;
    const updated = {
      ...current,
      ui: { ...current.ui, ...prefs }
    };
    this.saveSettings(updated);
    this.applyUiSettings(updated.ui);
  }

  private applyUiSettings(ui: UiPrefs): void {
    const root = document.documentElement;

    root.style.fontSize = `${ui.fontScale * 16}px`;

    if (ui.highContrast) {
      root.classList.add('contrast-more');
    } else {
      root.classList.remove('contrast-more');
    }

    if (ui.theme === 'dark') {
      root.classList.add('dark');
    } else if (ui.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }

  resetToDefaults(): void {
    this.saveSettings(DEFAULT_SETTINGS);
    this.applyUiSettings(DEFAULT_SETTINGS.ui);
  }
}
