import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private permissionGranted = false;

  constructor(private router: Router) {
    this.checkPermission();
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    }

    return false;
  }

  private checkPermission(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      this.permissionGranted = true;
    }
  }

  async showNotification(title: string, body: string, data?: any): Promise<void> {
    if (!this.permissionGranted) {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn('Notification permission not granted');
        return;
      }
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'cff-disruption',
        requireInteraction: true,
        data
      });

      notification.onclick = () => {
        window.focus();
        this.router.navigate(['/result']);
        notification.close();
      };
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  get hasPermission(): boolean {
    return this.permissionGranted;
  }

  get isSupported(): boolean {
    return 'Notification' in window;
  }
}
