import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  AssessmentQuestionDto,
  AssessmentService,
  AssessmentSubmissionDto,
} from '@ss/assessment';

import { Subject, Subscription } from 'rxjs';
import { AssessmentBase } from '../assessment-base.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-aptitude-assessment',
  templateUrl: './aptitude-assessment.component.html',
  styleUrls: ['./aptitude-assessment.component.scss'],
})
export class AptitudeAssessmentComponent
  extends AssessmentBase
  implements OnInit, OnDestroy
{
  @Input()
  assessmentSubmission!: AssessmentSubmissionDto;

  @Output()
  assessmentSubmissionChange = new Subject<AssessmentSubmissionDto>();

  @Output()
  sectionSubmitted = new Subject<string>();

  override timerDisplay = '';
  override selectedPage = 0; // Current question index
  override currentQuestionId = ''; // Current question ID

  override subscriptions: Subscription[] = [];
  override timerInterval!: any;
  override showAssessment = false;
  override questions: AssessmentQuestionDto[] = [];
  remainingTime: number = 30 * 60;
  clearOptionEventSubject: Subject<void> = new Subject<void>();
  lastSavedTime!: Date;
  showSidebar = false;
  private CURRENT_SECTION = 'aptitude';
  constructor(
    readonly assessmentService: AssessmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.showAssessment = false;

    if (this.assessmentSubmission.aptitudeStarted) {
      this.initTimers();
    }
    this.questions = this.assessmentSubmission.questions.filter(
      (q) => q.questionType === 'aptitude'
    );
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startSections(): void {
    this.startSection();
  }
submitSection() {
    const allQuestionsAnswered = this.questions.every((question) =>
      this.assessmentSubmission.questionSubmissions.some(
        (submission) =>
          submission.questionId === question.id &&
          submission.selectedOptionId !== ''
      )
    );

    if (
      !allQuestionsAnswered &&
      this.assessmentSubmission.timeRemainingInSeconds &&
      this.remainingTime > 0
    ) {
      // Display Toast alert in center
      this.messageService.add({
        severity: 'error',
        summary: 'Submission Error',
        detail: 'Please answer all the questions before submitting.',
        life: 3000, // Duration in milliseconds (3 seconds)
        sticky: true,
      });
      this.showSidebar = true;
      return; // Exit the method if not all questions are answered
    }
    if (this.assessmentSubmission.flaggedQuestions.length > 0) {
      this.confirmationService.confirm({
        message:
          'You have some flagged questions. Are you sure that you want to proceed? Click Yes to Submit, No to go back and review.',
        header: 'Flagged Questions',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          // this.messageService.add({
          //   severity: 'info',
          //   summary: 'Confirmed',
          //   detail: 'Submitting Aptitude Section',
          // });
          this.assessmentSubmission.flaggedQuestions.length = 0;
        },
        reject: () => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Review',
            detail: 'Please Review Questions',
            life: 3000,
          });
          return;
        },
      });
    }
    if (
      !allQuestionsAnswered &&
      this.assessmentSubmission.timeRemainingInSeconds &&
      this.remainingTime <= 0
    ) {
      // Display Toast alert in center
      this.messageService.add({
        severity: 'error',
        summary: 'Submission Error',
        detail: 'time is up',
        life: 9000, // Duration in milliseconds (3 seconds)
        sticky: true,
      });
      this.assessmentSubmission.aptitudeSubmitted = true;
      this.updateAssessment();
      this.assessmentService
        .updateAssessmentPost(this.assessmentSubmission)
        .subscribe(() => {
          this.sectionSubmitted.next('aptitude');
          this.sectionSubmitted.complete();
        });
      return; // Exit the method if not all questions are answered
    }
     else {
      this.confirmationService.confirm({
        message:
         'Are you Sure you want to submit', //'Submit Aptitude Section? And navigate to next section.',
        header: 'Submit Aptitude ',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'Submit Aptitude Section? And Navigate to next section.',
          });
          this.assessmentSubmission.aptitudeSubmitted = true;
          this.updateAssessment();
          this.assessmentService
            .updateAssessmentPost(this.assessmentSubmission)
            .subscribe(() => {
              this.sectionSubmitted.next('aptitude');
              this.sectionSubmitted.complete();

             // this.router.navigate([`/register`]);

            });
        },
        reject: () => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Review',
            detail: 'Please Review Questions',
            life: 3000,
          });
          return;
        },
      });
    
    }
  }

  initTimers() {
    if (
      this.assessmentSubmission.aptitudeStarted &&
      !this.assessmentSubmission.aptitudeSubmitted
    ) {
      this.remainingTime =
        this.assessmentSubmission.timeRemainingInSeconds ?? 30 * 60;
      this.timerDisplay = this.formatTime(this.remainingTime);
    } else if (this.assessmentSubmission.aptitudeSubmitted) {
      this.remainingTime = 0;
      this.sectionSubmitted.next(this.CURRENT_SECTION);
      this.sectionSubmitted.complete();
    }
  }

  override startSection(): void {
    this.assessmentSubmission.aptitudeStarted = true;
    this.assessmentSubmission.timeRemainingInSeconds = this.remainingTime;
    this.selectUnattemptedQuestion();
    this.updateAssessment();
    this.initTimers();
    this.showAssessment = true;
    this.startTimer();
  }

  getProgressBarValue() {
    const attemptedQuestions = this.questions.filter((q) =>
      this.assessmentSubmission.questionSubmissions.some(
        (qs) => qs.questionId === q.id && qs.selectedOptionId != ''
      )
    );
    return (
      (attemptedQuestions.length / this.questions.length) *
      100
    ).toPrecision(2);
  }
}
