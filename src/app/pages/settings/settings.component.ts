import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonButtons, IonList, IonItem, IonLabel, IonToggle, IonRange, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { SettingsService, AlertPrefs, UiPrefs } from '../../services/storage/settings.service';
import { I18nService, SupportedLanguage } from '../../services/i18n/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

const UI_ELEMENTS = [
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonButton, IonIcon, IonButtons, IonList, IonItem, IonLabel,
  IonToggle, IonRange, IonSelect, IonSelectOption
];

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, ...UI_ELEMENTS],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  alertPrefs!: AlertPrefs;
  uiPrefs!: UiPrefs;
  currentLanguage: SupportedLanguage = 'fr';
  supportedLanguages: SupportedLanguage[] = [];

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private i18nService: I18nService
  ) {}

  ngOnInit() {
    this.loadSettings();
    this.currentLanguage = this.i18nService.getCurrentLang();
    this.supportedLanguages = this.i18nService.getSupportedLanguages();
  }

  private loadSettings() {
    const settings = this.settingsService.getSettings();
    this.alertPrefs = { ...settings.alert };
    this.uiPrefs = { ...settings.ui };
  }

  updateAlertPrefs() {
    this.settingsService.updateAlertPrefs(this.alertPrefs);
  }

  updateUiPrefs() {
    this.settingsService.updateUiPrefs(this.uiPrefs);
  }

  increaseFontSize() {
    if (this.uiPrefs.fontScale < 1.5) {
      this.uiPrefs.fontScale = Math.round((this.uiPrefs.fontScale + 0.1) * 10) / 10;
      this.updateUiPrefs();
    }
  }

  decreaseFontSize() {
    if (this.uiPrefs.fontScale > 0.8) {
      this.uiPrefs.fontScale = Math.round((this.uiPrefs.fontScale - 0.1) * 10) / 10;
      this.updateUiPrefs();
    }
  }

  resetSettings() {
    this.settingsService.resetToDefaults();
    this.loadSettings();
  }

  async onLanguageChange() {
    await this.i18nService.setLanguage(this.currentLanguage);
  }

  goBack() {
    this.router.navigate(['/search']);
  }
}
