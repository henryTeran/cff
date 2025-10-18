import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbbModeIconComponent } from './sbb-mode-icon.component';

describe('SbbModeIconComponent', () => {
  let component: SbbModeIconComponent;
  let fixture: ComponentFixture<SbbModeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbbModeIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SbbModeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
