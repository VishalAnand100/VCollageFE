import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-multiple-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiple-questions.component.html',
  styleUrl: './multiple-questions.component.scss'
})
export class MultipleQuestionsComponent {

    constructor(private route: ActivatedRoute) {}


    questions = [
      {
        id: 'q1',
        correctOption: 'option-1',
        options: [
          { id: 'option-1', optionText: 'Paris' },
          { id: 'option-2', optionText: 'London' },
          { id: 'option-3', optionText: 'Berlin' },
          { id: 'option-4', optionText: 'Madrid' }
        ],
        questionText: 'What is the capital of France?',
        tags: { tag1: 'Geography' }
      },
      {
        id: 'q2',
        correctOption: 'option-3',
        options: [
          { id: 'option-1', optionText: '2' },
          { id: 'option-2', optionText: '3' },
          { id: 'option-3', optionText: '4' },
          { id: 'option-4', optionText: '5' }
        ],
        questionText: 'What is 2 + 2?',
        tags: { tag1: 'Math' }
      },
      {
        id: 'q3',
        correctOption: 'option-2',
        options: [
          { id: 'option-1', optionText: 'Red' },
          { id: 'option-2', optionText: 'Blue' },
          { id: 'option-3', optionText: 'Green' },
          { id: 'option-4', optionText: 'Yellow' }
        ],
        questionText: 'What color is the sky?',
        tags: { tag1: 'Science' }
      },
      {
        id: 'q4',
        correctOption: 'option-1',
        options: [
          { id: 'option-1', optionText: 'Mercury' },
          { id: 'option-2', optionText: 'Mars' },
          { id: 'option-3', optionText: 'Earth' },
          { id: 'option-4', optionText: 'Venus' }
        ],
        questionText: 'Which planet is closest to the sun?',
        tags: { tag1: 'Astronomy' }
      },
      {
        id: 'q5',
        correctOption: 'option-4',
        options: [
          { id: 'option-1', optionText: 'Shakespeare' },
          { id: 'option-2', optionText: 'Charles Dickens' },
          { id: 'option-3', optionText: 'Jane Austen' },
          { id: 'option-4', optionText: 'William Wordsworth' }
        ],
        questionText: 'Who is known as the father of English poetry?',
        tags: { tag1: 'Literature' }
      },
      {
        id: 'q6',
        correctOption: 'option-3',
        options: [
          { id: 'option-1', optionText: 'H2O' },
          { id: 'option-2', optionText: 'CO2' },
          { id: 'option-3', optionText: 'O2' },
          { id: 'option-4', optionText: 'N2' }
        ],
        questionText: 'What is the chemical symbol for Oxygen?',
        tags: { tag1: 'Chemistry' }
      }
    ];
    selectedOptions: { [key: string]: string } = {};


    getOptionLabel(index: number): string {
      return String.fromCharCode(65 + index); // A=65, B=66, C=67, etc.
    }
    
    // ✅ Function to handle option selection
    selectOption(questionId: string, optionId: string) {
      this.selectedOptions[questionId] = optionId;
    }
}
