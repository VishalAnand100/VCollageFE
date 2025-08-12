import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  AssessmentQuestionDto,
  AssessmentService,
  AssessmentSubmissionDto,
} from '@ss/assessment';

import { combineLatest, Subject, Subscription } from 'rxjs';
import { AssessmentBase } from '../assessment-base.component';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-personality-assessment',
  templateUrl: './personality-assessment.component.html',
  styleUrls: ['./personality-assessment.component.scss'],
})
export class PersonalityAssessmentComponent
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

  override timerInterval!: any;
  override subscriptions: Subscription[] = [];

  override showAssessment = false;
  override questions: AssessmentQuestionDto[] = [];
  remainingTime: number = 20 * 60;
  clearOptionEventSubject: Subject<void> = new Subject<void>();
  lastSavedTime!: Date;
  showSidebar = false;
  private CURRENT_SECTION = 'personality';
  currentQuestionType$ = new Subject<string>();
  prevQuestionType$ = new Subject<string>();
  currentSectionName = 'interests_and_preferences';

  constructor(
    readonly assessmentService: AssessmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    super();
  }

  ngOnInit(): void {
    const questionCategoryObservable = combineLatest(
      this.currentQuestionType$,
      this.prevQuestionType$
    );

    questionCategoryObservable.subscribe(([currentCategory, prevCategory]) => {
      if (currentCategory !== prevCategory) {
        if (currentCategory === 'interests_and_preferences') {
          this.currentSectionName = currentCategory;
          this.showAssessment = false;
          this.stopTimer();
        }
      }
    });
    if (this.assessmentSubmission.personalityStarted) {
      this.initTimers();
    }
    this.questions = this.assessmentSubmission.questions.filter(
      (q) => q.questionType !== 'aptitude'
    );
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  submitSection() {
    const allQuestionsAnswered = this.questions.every((question) =>
      this.assessmentSubmission.questionSubmissions.some(
        (submission) =>
          submission.questionId === question.id &&
          submission.selectedOptionId !== ''
      )
    );
    if (!allQuestionsAnswered) {
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
        },
      });
      return;
    }
    else{
      this.confirmationService.confirm({
        message:
          'Submit Personality Section',
        header: 'Submit Personality',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'Submit Personality Section',
          });
          this.assessmentSubmission.personalitySubmitted = true;
          this.updateAssessment();
          this.assessmentService
            .assessmentCompleteEventPost(this.assessmentSubmission.id)
            .subscribe();
          this.assessmentService
            .updateAssessmentPost(this.assessmentSubmission)
            .subscribe(() => {
              this.sectionSubmitted.next('personality');
              this.sectionSubmitted.complete();
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
      this.assessmentSubmission.personalityStarted &&
      !this.assessmentSubmission.personalitySubmitted
    ) {
      this.remainingTime =
        this.assessmentSubmission.timeRemainingInSeconds ?? 20 * 60;
      this.timerDisplay = this.formatTime(this.remainingTime);
    } else if (this.assessmentSubmission.personalitySubmitted) {
      this.remainingTime = 0;
      this.sectionSubmitted.next(this.CURRENT_SECTION);
      this.sectionSubmitted.complete();
    }
  }

  override startSection(): void {
    this.assessmentSubmission.personalityStarted = true;
    this.assessmentSubmission.timeRemainingInSeconds = this.remainingTime;
    this.selectUnattemptedQuestion();
    this.updateAssessment();
    this.initTimers();
    this.showAssessment = true;
    this.startTimer();
  }

  resumeSection() {
    this.showAssessment = true;
    this.startSection();
  }

  getProgressBarValue() {
    const attemptedQuestions = this.questions.filter((q) =>
      this.assessmentSubmission.questionSubmissions.some(
        (qs) => qs.questionId === q.id
      )
    );
    return (
      (attemptedQuestions.length / this.questions.length) *
      100
    ).toPrecision(2);
  }

  override navigateToNextQuestion(): void {
    super.navigateToNextQuestion();
    this.currentQuestionType$.next(
      this.questions[this.selectedPage].questionType
    );
    this.prevQuestionType$.next(
      this.questions[this.selectedPage - 1].questionType
    );
  }
}
