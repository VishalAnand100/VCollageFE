import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdversityInstructionComponent } from './adversity-instruction.component';

describe('AdversityInstructionComponent', () => {
  let component: AdversityInstructionComponent;
  let fixture: ComponentFixture<AdversityInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdversityInstructionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdversityInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
