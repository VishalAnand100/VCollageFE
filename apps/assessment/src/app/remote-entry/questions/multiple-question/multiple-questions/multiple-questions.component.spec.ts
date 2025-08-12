import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleQuestionsComponent } from './multiple-questions.component';

describe('MultipleQuestionsComponent', () => {
  let component: MultipleQuestionsComponent;
  let fixture: ComponentFixture<MultipleQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
