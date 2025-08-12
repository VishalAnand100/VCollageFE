import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeiInstructionComponent } from './seiInstruction.component';

describe('SeiInstructionComponent', () => {
  let component: SeiInstructionComponent;
  let fixture: ComponentFixture<SeiInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeiInstructionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeiInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
