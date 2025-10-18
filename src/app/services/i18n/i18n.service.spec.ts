import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return key if translation not found', () => {
    expect(service.t('non.existent.key')).toBe('non.existent.key');
  });

  it('should return fallback if provided and key not found', () => {
    expect(service.t('non.existent.key', 'Fallback')).toBe('Fallback');
  });
});
