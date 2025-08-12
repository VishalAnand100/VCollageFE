import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlansGrowComponent } from './plans-grow.component';

describe('PlansGrowComponent', () => {
  let component: PlansGrowComponent;
  let fixture: ComponentFixture<PlansGrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlansGrowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlansGrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
