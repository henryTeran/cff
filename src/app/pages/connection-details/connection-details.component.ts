import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonLabel, IonButtons, IonList, IonItem } from '@ionic/angular/standalone';
import { Connection } from '../../interfaces/routeResponse';
import { SbbModeIconComponent } from '../../components/sbb-mode-icon/sbb-mode-icon.component';
import { formatTime, formatDurationFromDates } from '../../utils/date-time.util';
import { getLegCode } from '../../utils/icon.util';

const UI_ELEMENTS = [
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
  IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol,
  IonLabel, IonButtons, IonList, IonItem
];

@Component({
  selector: 'app-connection-details',
  standalone: true,
  imports: [CommonModule, ...UI_ELEMENTS, SbbModeIconComponent],
  templateUrl: './connection-details.component.html',
  styleUrls: ['./connection-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionDetailsComponent implements OnInit {
  connection?: Connection;
  connectionIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['connection']) {
      this.connection = navigation.extras.state['connection'];
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.connectionIndex = +params['index'] || 0;

      if (!this.connection) {
        const searchResult = history.state.searchResult;
        if (searchResult?.connections?.[this.connectionIndex]) {
          this.connection = searchResult.connections[this.connectionIndex];
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/result']);
  }

  getTime(date: Date | string): string {
    return formatTime(date);
  }

  getDuration(start: Date, end: Date): string {
    return formatDurationFromDates(start, end);
  }

  getLegCode(leg: any): string {
    return getLegCode(leg);
  }

  getOccupancyLabel(occupancy: string): string {
    const labels: Record<string, string> = {
      'low': 'Faible',
      'medium': 'Moyenne',
      'high': 'Élevée'
    };
    return labels[occupancy] || occupancy;
  }
}
