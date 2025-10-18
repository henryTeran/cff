import {
  formatDate,
  formatTime,
  getDurationMinutes,
  formatDuration,
  formatDurationFromDates,
  parseTimeInput
} from './date-time.util';

describe('date-time.util', () => {
  describe('formatDate', () => {
    it('should format date as dd.MM.yyyy', () => {
      const date = new Date('2025-10-18T14:30:00');
      expect(formatDate(date)).toBe('18.10.2025');
    });

    it('should handle string input', () => {
      expect(formatDate('2025-01-05T10:00:00')).toBe('05.01.2025');
    });
  });

  describe('formatTime', () => {
    it('should format time as HH:mm', () => {
      const date = new Date('2025-10-18T14:30:00');
      expect(formatTime(date)).toBe('14:30');
    });

    it('should pad single digits', () => {
      const date = new Date('2025-10-18T09:05:00');
      expect(formatTime(date)).toBe('09:05');
    });
  });

  describe('getDurationMinutes', () => {
    it('should calculate duration in minutes', () => {
      const start = new Date('2025-10-18T14:00:00');
      const end = new Date('2025-10-18T15:30:00');
      expect(getDurationMinutes(start, end)).toBe(90);
    });
  });

  describe('formatDuration', () => {
    it('should format hours and minutes', () => {
      expect(formatDuration(90)).toBe('1h 30min');
    });

    it('should format minutes only', () => {
      expect(formatDuration(45)).toBe('45min');
    });

    it('should handle zero minutes', () => {
      expect(formatDuration(120)).toBe('2h 0min');
    });
  });

  describe('formatDurationFromDates', () => {
    it('should format duration from two dates', () => {
      const start = new Date('2025-10-18T14:00:00');
      const end = new Date('2025-10-18T14:45:00');
      expect(formatDurationFromDates(start, end)).toBe('45min');
    });
  });

  describe('parseTimeInput', () => {
    it('should parse valid time', () => {
      const result = parseTimeInput('14:30');
      expect(result).toEqual({ hours: 14, minutes: 30 });
    });

    it('should return null for invalid format', () => {
      expect(parseTimeInput('25:00')).toBeNull();
      expect(parseTimeInput('12:60')).toBeNull();
      expect(parseTimeInput('invalid')).toBeNull();
    });

    it('should handle single digit hours', () => {
      const result = parseTimeInput('9:30');
      expect(result).toEqual({ hours: 9, minutes: 30 });
    });
  });
});
