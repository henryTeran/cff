import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load default settings', () => {
    const settings = service.getSettings();
    expect(settings.alert.minDelayMin).toBe(5);
    expect(settings.ui.fontScale).toBe(1.0);
  });

  it('should save and load alert preferences', () => {
    service.updateAlertPrefs({ minDelayMin: 10, lifts: true });
    const prefs = service.getAlertPrefs();
    expect(prefs.minDelayMin).toBe(10);
    expect(prefs.lifts).toBe(true);
  });

  it('should persist settings to localStorage', () => {
    service.updateUiPrefs({ fontScale: 1.2, highContrast: true });
    const stored = localStorage.getItem('cff-app-settings');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.ui.fontScale).toBe(1.2);
  });
});
