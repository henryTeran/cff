import { TestBed } from '@angular/core/testing';
import { DisruptionsService } from './disruptions.service';

describe('DisruptionsService', () => {
  let service: DisruptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisruptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
