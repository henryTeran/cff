import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Connection, RouteResponse } from '../../interfaces/routeResponse';
import { NotificationsService } from '../notifications/notifications.service';

export interface DisruptionAlert {
  connection: Connection;
  message: string;
  alternatives: Connection[];
}

@Injectable({
  providedIn: 'root'
})
export class DisruptionsService {
  private pollingInterval = 45000;
  private pollingSubscription?: Subscription;
  private previousDisruptions = new Map<string, any>();

  private disruptionAlertSubject = new BehaviorSubject<DisruptionAlert | null>(null);
  public disruptionAlert$: Observable<DisruptionAlert | null> = this.disruptionAlertSubject.asObservable();

  private isMonitoringSubject = new BehaviorSubject<boolean>(false);
  public isMonitoring$: Observable<boolean> = this.isMonitoringSubject.asObservable();

  private lastSearchParams: { from: string; to: string; date: string; time: string; timeType: 'depart' | 'arrival' } | null = null;

  constructor(
    private apiService: ApiService,
    private notificationsService: NotificationsService
  ) {}

  startMonitoring(params: { from: string; to: string; date: string; time: string; timeType: 'depart' | 'arrival' }): void {
    this.lastSearchParams = params;
    this.stopMonitoring();

    this.isMonitoringSubject.next(true);

    this.pollingSubscription = interval(this.pollingInterval).subscribe(async () => {
      await this.checkForDisruptions();
    });
  }

  stopMonitoring(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
    this.isMonitoringSubject.next(false);
    this.previousDisruptions.clear();
  }

  private async checkForDisruptions(): Promise<void> {
    if (!this.lastSearchParams) return;

    try {
      const response = await this.apiService.route({
        ...this.lastSearchParams,
        num: 3
      });

      const newDisruptions = this.detectNewDisruptions(response);

      if (newDisruptions.length > 0) {
        await this.handleNewDisruptions(newDisruptions);
      }
    } catch (error) {
      console.error('Error checking disruptions:', error);
    }
  }

  private detectNewDisruptions(response: RouteResponse): Connection[] {
    const newlyDisrupted: Connection[] = [];

    response.connections.forEach((connection) => {
      const connectionId = this.getConnectionId(connection);
      const hasDisruption = connection.disruptions && Object.keys(connection.disruptions).length > 0;

      if (hasDisruption) {
        const previousDisruption = this.previousDisruptions.get(connectionId);

        if (!previousDisruption ||
            JSON.stringify(previousDisruption) !== JSON.stringify(connection.disruptions)) {
          newlyDisrupted.push(connection);
          this.previousDisruptions.set(connectionId, connection.disruptions);
        }
      } else {
        this.previousDisruptions.delete(connectionId);
      }
    });

    return newlyDisrupted;
  }

  private async handleNewDisruptions(disruptedConnections: Connection[]): Promise<void> {
    if (!this.lastSearchParams) return;

    const fullResponse = await this.apiService.route({
      ...this.lastSearchParams,
      num: 5
    });

    const alternatives = fullResponse.connections.filter(conn => {
      const hasNoDisruption = !conn.disruptions || Object.keys(conn.disruptions).length === 0;
      return hasNoDisruption;
    });

    const bestAlternative = this.findBestAlternative(alternatives);

    const alert: DisruptionAlert = {
      connection: disruptedConnections[0],
      message: this.getDisruptionMessage(disruptedConnections[0]),
      alternatives: bestAlternative ? [bestAlternative] : alternatives.slice(0, 2)
    };

    this.disruptionAlertSubject.next(alert);

    await this.notificationsService.showNotification(
      'Perturbation détectée',
      alert.message
    );
  }

  private findBestAlternative(connections: Connection[]): Connection | null {
    if (connections.length === 0) return null;

    return connections.reduce((best, current) => {
      if (!best) return current;

      const currentTime = new Date(current.departure).getTime();
      const bestTime = new Date(best.departure).getTime();

      if (currentTime < bestTime) return current;
      if (currentTime === bestTime && current.duration < best.duration) return current;

      return best;
    });
  }

  private getConnectionId(connection: Connection): string {
    return `${connection.departure}_${connection.arrival}_${connection.legs[0]?.line || ''}`;
  }

  private getDisruptionMessage(connection: Connection): string {
    if (!connection.disruptions) return 'Perturbation sur votre trajet';

    const disruption = Object.values(connection.disruptions)[0];
    if (disruption && typeof disruption === 'object' && 'texts' in disruption) {
      const texts = (disruption as any).texts;
      return texts?.M?.summary || texts?.S?.summary || 'Perturbation détectée sur votre connexion';
    }

    return 'Perturbation détectée sur votre connexion';
  }

  get isMonitoring(): boolean {
    return this.isMonitoringSubject.value;
  }
}
