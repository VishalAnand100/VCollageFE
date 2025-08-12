import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PyschometricInstructionComponent } from './pyschometric-Instruction.component';

describe('PyschometricInstructionComponent', () => {
  let component: PyschometricInstructionComponent;
  let fixture: ComponentFixture<PyschometricInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PyschometricInstructionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PyschometricInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
