import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-single-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-question.component.html',
  styleUrl: './single-question.component.scss',
})
export class SingleQuestionComponent {
  constructor(private route: ActivatedRoute) {}
  
  question = {
    id: 'id',
    correctOption: 'option-1',
    options: [
      { id: 'option-1', optionText: 'This is option 1' },
      { id: 'option-2', optionText: 'This is option 2' },
      { id: 'option-3', optionText: 'This is option 3' },
      { id: 'option-4', optionText: 'This is option 4' }
    ],
    questionText: 'This is a question that is hardcoded. Please select the best correct option according to your knowledge and understanding.',
    tags: {
      tag1: 'tag-1-value'
    }
  };

  selectedOption: string | null = null;

  selectOption(optionId: string) {
    this.selectedOption = optionId;
  }
  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index); // A=65, B=66, C=67, etc.
  }
}
