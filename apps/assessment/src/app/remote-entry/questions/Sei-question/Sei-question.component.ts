import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  AssessmentService,
  QuestionSubmissionStructureDto,
  SeiQuestionDto,
} from '@ss/assessment';
import { RadioButtonClickEvent } from 'primeng/radiobutton';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-sei-question',
  templateUrl: './Sei-question.component.html',
  styleUrl: './Sei-question.component.scss',
})
export class SeiQuestionComponent implements OnInit, OnDestroy {
  @Input()
  question!: SeiQuestionDto;
  selectedOption!: string;

  @Output()
  optionSelection = new EventEmitter<QuestionSubmissionStructureDto>();

  @Input()
  questionSubmission!: QuestionSubmissionStructureDto;
  private eventsSubscription: Subscription = new Subscription();
  @Input() events!: Observable<void>;
  sanitizedQuestionText!: SafeHtml; // Variable to store sanitized HTML
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  constructor(
    private readonly assessmentService: AssessmentService,
    private sanitizer: DomSanitizer,private renderer: Renderer2

  ) {}
  ngOnInit() {
    if (this.question && !(this.question.options?.length === 0)) {
      const questionId = this.question.id || ''; // Ensure a string is passed

      this.assessmentService
        .getSeiQuestion(questionId)
        .subscribe((question) => {
          this.question = question;
          this.sanitizedQuestionText = this.sanitizer.bypassSecurityTrustHtml(
            question.questionText || ''
          );
        });
    }

    if (this.questionSubmission?.selectedOptionId)
      this.selectedOption = this.questionSubmission.selectedOptionId;

    this.eventsSubscription = this.events.subscribe(
      () => (this.selectedOption = '')
    );
  }
  changeSelection(event: RadioButtonClickEvent) {
    const assessmentId = localStorage.getItem('assessment-key');

    if (assessmentId && this.question.id) {
      const submission = {
        assessmentId: assessmentId,
        questionId: this.question.id,
        selectedOptionId: event.value,
      };

      this.optionSelection.emit(submission);
    }
  }

  selectOption(optionId: string) {
    this.selectedOption = optionId;
    const assessmentId = localStorage.getItem('assessment-key');

    if (assessmentId && this.question.id) {
      const submission = {
        assessmentId: assessmentId,
        questionId: this.question.id,
        selectedOptionId: this.selectedOption,
      };

      this.optionSelection.emit(submission);
    }
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index); // A=65, B=66, C=67, etc.
  }
}
