import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { SbbIconKey } from '../../shared/sbb-icons';
import { Leg } from '../../interfaces/routeResponse';

@Component({
  selector: 'app-sbb-mode-icon',
  standalone: true,
  imports: [CommonModule, IonIcon],
  template: `
    <div [style.width.px]="size" [style.height.px]="size" class="sbb-icon-container">
      <ion-icon [name]="ionIconName" [style.font-size.px]="size"></ion-icon>
    </div>
  `,
  styles: [`
    .sbb-icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class SbbModeIconComponent {
  @Input() leg?: Leg;
  @Input() typeName?: string;
  @Input() lineCode?: string;
  @Input() size: number = 36;

  get iconKey(): SbbIconKey {
    if (this.leg) {
      return this.getIconKeyFromLeg(this.leg);
    }

    if (this.typeName) {
      return this.getIconKeyFromType(this.typeName, this.lineCode || '');
    }

    return 'train';
  }

  get ionIconName(): string {
    const iconMap: Record<SbbIconKey, string> = {
      'train': 'train-outline',
      'tram': 'subway-outline',
      'bus': 'bus-outline',
      'walk': 'walk-outline',
      'product.ic': 'train',
      'product.ir': 'train',
      'product.re': 'train',
      'product.s': 'subway'
    };

    return iconMap[this.iconKey];
  }

  private getIconKeyFromLeg(leg: Leg): SbbIconKey {
    const typeName = (leg.type_name || '').toLowerCase();

    if (typeName.includes('pied') || typeName.includes('walk')) {
      return 'walk';
    }

    if (typeName.includes('tram')) {
      return 'tram';
    }

    if (typeName.includes('bus') || typeName.includes('autobus')) {
      return 'bus';
    }

    const code = ((leg['*G'] ?? '') + (leg['*L'] ?? '')).toUpperCase();

    if (/^IC/.test(code)) {
      return 'product.ic';
    }

    if (/^IR/.test(code)) {
      return 'product.ir';
    }

    if (/^RE/.test(code)) {
      return 'product.re';
    }

    if (/^S\d+/.test(code)) {
      return 'product.s';
    }

    return 'train';
  }

  private getIconKeyFromType(typeName: string, lineCode: string): SbbIconKey {
    const typeNameLower = typeName.toLowerCase();

    if (typeNameLower.includes('pied') || typeNameLower.includes('walk')) {
      return 'walk';
    }

    if (typeNameLower.includes('tram')) {
      return 'tram';
    }

    if (typeNameLower.includes('bus') || typeNameLower.includes('autobus')) {
      return 'bus';
    }

    const codeUpper = lineCode.toUpperCase();

    if (/^IC/.test(codeUpper)) {
      return 'product.ic';
    }

    if (/^IR/.test(codeUpper)) {
      return 'product.ir';
    }

    if (/^RE/.test(codeUpper)) {
      return 'product.re';
    }

    if (/^S\d+/.test(codeUpper)) {
      return 'product.s';
    }

    return 'train';
  }
}
