import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { Connection } from '../../interfaces/routeResponse';

const UI_ELEMENTS = [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonButtons];

@Component({
  selector: 'app-onboard',
  standalone: true,
  imports: [CommonModule, ...UI_ELEMENTS],
  template: `
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button (click)="goBack()" aria-label="Retour">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>À bord</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      @if (connection) {
        <ion-card>
          <ion-card-content>
            <h2>{{ trainNumber }}</h2>
            <p><strong>Destination:</strong> {{ destination }}</p>
            <p><strong>Prochaine halte:</strong> {{ nextStop }}</p>
            @if (carriage) {
              <p><strong>Voiture:</strong> {{ carriage }}</p>
            }
            @if (trainClass) {
              <p><strong>Classe:</strong> {{ trainClass }}</p>
            }
            <ion-button expand="block" (click)="readRoute()" aria-label="Lire l'itinéraire">
              <ion-icon name="volume-high-outline" slot="start"></ion-icon>
              Lire l'itinéraire
            </ion-button>
          </ion-card-content>
        </ion-card>
      } @else {
        <ion-card>
          <ion-card-content>
            <p>Aucune information disponible</p>
          </ion-card-content>
        </ion-card>
      }
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardComponent {
  connection?: Connection;
  trainNumber = '';
  destination = '';
  nextStop = '';
  carriage = '';
  trainClass = '';

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['connection']) {
      this.connection = navigation.extras.state['connection'];
      this.initializeOnboardInfo();
    }
  }

  private initializeOnboardInfo() {
    if (!this.connection) return;

    const firstLeg = this.connection.legs.find(leg => leg.type_name !== 'Trajet à pied');
    if (firstLeg) {
      this.trainNumber = `${firstLeg['*G'] ?? ''}${firstLeg['*L'] ?? ''}`;
      this.destination = firstLeg.terminal || '';
      this.nextStop = firstLeg.stops?.[0]?.name || firstLeg.exit?.name || '';
    }
  }

  readRoute() {
    const text = this.buildRouteDescription();
    this.speak(text);
  }

  private buildRouteDescription(): string {
    if (!this.connection) return '';

    let description = `Vous êtes à bord du train ${this.trainNumber} en direction de ${this.destination}.`;
    description += ` Prochaine halte: ${this.nextStop}.`;

    return description;
  }

  private speak(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-CH';
      speechSynthesis.speak(utterance);
    } else {
      alert('La synthèse vocale n\'est pas supportée par votre navigateur');
    }
  }

  goBack() {
    this.router.navigate(['/result']);
  }
}
