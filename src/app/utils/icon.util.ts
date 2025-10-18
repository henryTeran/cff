import { Leg } from '../interfaces/routeResponse';
import { SbbIconKey } from '../shared/sbb-icons';

export function iconKeyFromLeg(leg: Leg): SbbIconKey {
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

export function getLegCode(leg: Leg): string {
  return `${leg['*G'] ?? ''}${leg['*L'] ?? ''}`;
}

export function getLineType(leg: Leg): 'train' | 'tram' | 'bus' | 'walk' {
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

  return 'train';
}
