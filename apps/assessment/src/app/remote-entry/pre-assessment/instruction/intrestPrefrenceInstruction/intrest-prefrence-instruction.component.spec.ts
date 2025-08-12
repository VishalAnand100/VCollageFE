import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntrestPrefrenceInstructionComponent } from './intrest-prefrence-instruction.component';

describe('IntrestPrefrenceInstructionComponent', () => {
  let component: IntrestPrefrenceInstructionComponent;
  let fixture: ComponentFixture<IntrestPrefrenceInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntrestPrefrenceInstructionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IntrestPrefrenceInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
