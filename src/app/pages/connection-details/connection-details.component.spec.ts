import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectionDetailsComponent } from './connection-details.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ConnectionDetailsComponent', () => {
  let component: ConnectionDetailsComponent;
  let fixture: ComponentFixture<ConnectionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ index: 0 })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
