import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AptitudeInstructionComponent } from './aptitude-instruction.component';

describe('AptitudeInstructionComponent', () => {
  let component: AptitudeInstructionComponent;
  let fixture: ComponentFixture<AptitudeInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AptitudeInstructionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AptitudeInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
