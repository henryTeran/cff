import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonLabel, IonChip, IonBadge, IonButtons } from '@ionic/angular/standalone';
import { RouteResponse, Connection } from '../../interfaces/routeResponse';
import { DisruptionsService, DisruptionAlert } from '../../services/disruptions/disruptions.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { SbbModeIconComponent } from '../../components/sbb-mode-icon/sbb-mode-icon.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Subscription } from 'rxjs';

const UI_ELEMENTS = [
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonChip,
  IonBadge,
  IonButtons
];

@Component({
  selector: 'app-result-page',
  standalone: true,
  imports: [CommonModule, ...UI_ELEMENTS, SbbModeIconComponent, TranslatePipe],
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.scss']
})
export class ResultPageComponent implements OnInit, OnDestroy {
  public searchResult?: RouteResponse;
  public connections: Connection[] = [];
  public searchParams?: any;
  public isMonitoring = false;
  public disruptionAlert?: DisruptionAlert | null;

  private disruptionSubscription?: Subscription;
  private monitoringSubscription?: Subscription;

  constructor(
    private router: Router,
    private disruptionsService: DisruptionsService,
    private notificationsService: NotificationsService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.searchResult = navigation.extras.state['searchResult'];
      this.searchParams = navigation.extras.state['searchParams'];
      this.connections = this.searchResult?.connections || [];
    }
  }

  ngOnInit() {
    this.disruptionSubscription = this.disruptionsService.disruptionAlert$.subscribe(
      alert => {
        this.disruptionAlert = alert;
      }
    );

    this.monitoringSubscription = this.disruptionsService.isMonitoring$.subscribe(
      isMonitoring => {
        this.isMonitoring = isMonitoring;
      }
    );
  }

  ngOnDestroy() {
    this.disruptionSubscription?.unsubscribe();
    this.monitoringSubscription?.unsubscribe();
  }

  async toggleMonitoring() {
    if (!this.searchParams) return;

    if (this.isMonitoring) {
      this.disruptionsService.stopMonitoring();
    } else {
      const hasPermission = await this.notificationsService.requestPermission();
      if (hasPermission) {
        this.disruptionsService.startMonitoring(this.searchParams);
      } else {
        alert('Veuillez activer les notifications pour recevoir les alertes de perturbations');
      }
    }
  }

  goBack() {
    this.disruptionsService.stopMonitoring();
    this.router.navigate(['/search']);
  }

  getDuration(connection: Connection): string {
    const minutes = Math.round(connection.duration / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  }

  getTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  hasDisruptions(connection: Connection): boolean {
    return !!(connection.disruptions && Object.keys(connection.disruptions).length > 0);
  }

  getLegCode(leg: any): string {
    return `${leg['*G'] ?? ''}${leg['*L'] ?? ''}`;
  }

  dismissAlert() {
    this.disruptionAlert = null;
  }
}
