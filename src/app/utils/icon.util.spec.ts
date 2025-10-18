import { iconKeyFromLeg, getLegCode, getLineType } from './icon.util';
import { Leg } from '../interfaces/routeResponse';

describe('icon.util', () => {
  describe('iconKeyFromLeg', () => {
    it('should return walk for pedestrian leg', () => {
      const leg = { type_name: 'Trajet à pied' } as Leg;
      expect(iconKeyFromLeg(leg)).toBe('walk');
    });

    it('should return tram for tram leg', () => {
      const leg = { type_name: 'Tram' } as Leg;
      expect(iconKeyFromLeg(leg)).toBe('tram');
    });

    it('should return bus for bus leg', () => {
      const leg = { type_name: 'Autobus' } as Leg;
      expect(iconKeyFromLeg(leg)).toBe('bus');
    });

    it('should return product.ic for IC trains', () => {
      const leg = { type_name: 'Train', '*G': 'IC', '*L': '5' } as any;
      expect(iconKeyFromLeg(leg)).toBe('product.ic');
    });

    it('should return product.ir for IR trains', () => {
      const leg = { type_name: 'Train', '*G': 'IR', '*L': '15' } as any;
      expect(iconKeyFromLeg(leg)).toBe('product.ir');
    });

    it('should return product.re for RE trains', () => {
      const leg = { type_name: 'Train', '*G': 'RE', '*L': '33' } as any;
      expect(iconKeyFromLeg(leg)).toBe('product.re');
    });

    it('should return product.s for S-Bahn', () => {
      const leg = { type_name: 'Train', '*G': 'S', '*L': '1' } as any;
      expect(iconKeyFromLeg(leg)).toBe('product.s');
    });

    it('should return train as fallback', () => {
      const leg = { type_name: 'Train' } as Leg;
      expect(iconKeyFromLeg(leg)).toBe('train');
    });
  });

  describe('getLegCode', () => {
    it('should combine *G and *L', () => {
      const leg = { '*G': 'IC', '*L': '5' } as any;
      expect(getLegCode(leg)).toBe('IC5');
    });

    it('should handle missing values', () => {
      const leg = {} as Leg;
      expect(getLegCode(leg)).toBe('');
    });
  });

  describe('getLineType', () => {
    it('should identify walk', () => {
      const leg = { type_name: 'Trajet à pied' } as Leg;
      expect(getLineType(leg)).toBe('walk');
    });

    it('should identify tram', () => {
      const leg = { type_name: 'Tram' } as Leg;
      expect(getLineType(leg)).toBe('tram');
    });

    it('should identify bus', () => {
      const leg = { type_name: 'Autobus' } as Leg;
      expect(getLineType(leg)).toBe('bus');
    });

    it('should default to train', () => {
      const leg = { type_name: 'Train' } as Leg;
      expect(getLineType(leg)).toBe('train');
    });
  });
});
