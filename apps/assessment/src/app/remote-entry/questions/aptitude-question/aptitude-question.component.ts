import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import {
  AptitudeQuestionDto,
  AssessmentService,
  QuestionSubmissionStructureDto,
} from '@ss/assessment';
import { RadioButtonClickEvent } from 'primeng/radiobutton';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-aptitude-question',
  templateUrl: './aptitude-question.component.html',
  styleUrl: './aptitude-question.component.scss',
})
export class AptitudeQuestionComponent implements OnInit, OnDestroy {
  @Input()
  question!: AptitudeQuestionDto;
  selectedOption!: string;

  @Output()
  optionSelection = new EventEmitter<QuestionSubmissionStructureDto>();
  @Input()
  questionSubmission!: QuestionSubmissionStructureDto;

  sanitizedQuestionText!: SafeHtml; // Variable to store sanitized HTML

  imageSrc: string | null = null;

  private eventsSubscription: Subscription = new Subscription();
  @Input() events!: Observable<void>;

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  constructor(
    private readonly assessmentService: AssessmentService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (this.question && !(this.question.options?.length === 0)) {
      const questionId = this.question.id || ''; // Ensure a string is passed

      this.assessmentService
        .getAptitudeQuestion(questionId)
        .subscribe((question) => {
          this.question = question;
          this.sanitizedQuestionText = this.sanitizer.bypassSecurityTrustHtml(
            (question.questionText || '').replace(/\n/g, '<br>')
          );
          if (question.pictureData) {
            this.imageSrc = `data:image/png;base64,${question.pictureData}`;
          }

          this.question.options = Array.isArray(question.options)
            ? question.options
            : [];
        });
    }

    if (
      this.questionSubmission?.selectedOptionId ||
      this.questionSubmission?.selectedOptionId !==
        '00000000-0000-0000-0000-000000000000'
    )
      this.selectedOption = this.questionSubmission.selectedOptionId;

    this.eventsSubscription = this.events.subscribe(
      () => (this.selectedOption = '')
    );
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
