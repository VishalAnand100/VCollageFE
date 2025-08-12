import {
  AssessmentQuestionDto,
  AssessmentService,
  AssessmentSubmissionDto,
  QuestionSubmissionStructureDto,
} from '@ss/assessment';
import { Subject, Subscription } from 'rxjs';

export abstract class AssessmentBase {
  abstract remainingTime: number;
  abstract assessmentService: AssessmentService;
  abstract assessmentSubmission: AssessmentSubmissionDto;
  showAssessment = false;
  abstract lastSavedTime: Date;
  questions: AssessmentQuestionDto[] = [];
  timerDisplay = '';
  selectedPage = 0; // Current question index
  currentQuestionId = ''; // Current question ID
  abstract clearOptionEventSubject: Subject<void>;
  subscriptions: Subscription[] = [];
  abstract timerInterval: any;
  fiveMinutesWarningShown = false;

  startTimer() {
    this.stopTimer(); // Ensure no duplicate timers
    this.timerInterval = setInterval(() => {
      if (this.remainingTime <= 0) {
        this.stopTimer();
        this.submitSection();
      } else if (
        this.remainingTime === 5 * 60 &&
        !this.fiveMinutesWarningShown
      ) {
        alert('You have 5 minutes left');
        this.fiveMinutesWarningShown = true;
      }
      this.remainingTime--;
      this.timerDisplay = this.formatTime(this.remainingTime);
      this.assessmentService
        .updateAssessmentTimerPost(
          this.assessmentSubmission.id,
          this.remainingTime
        )
        .subscribe();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  abstract submitSection(): void;

  abstract startSection(): void;

  getQuestionSubmission(question: {
    id: string;
  }): QuestionSubmissionStructureDto {
    // Check if a submission already exists for this question
    let submission = this.assessmentSubmission.questionSubmissions.find(
      (qs) => qs.questionId === question.id
    );

    // If no submission exists, create a new one
    if (!submission) {
      submission = {
        assessmentId: this.assessmentSubmission.id,
        questionId: question.id,
        selectedOptionId: '', // No option selected initially
      };
      this.assessmentSubmission.questionSubmissions.push(submission);
    }

    return submission;
  }

  updateQuestionSubmission(submission: QuestionSubmissionStructureDto): void {
    const existingSubmissionIndex =
      this.assessmentSubmission.questionSubmissions.findIndex(
        (qs) => qs.questionId === submission.questionId
      );

    if (existingSubmissionIndex !== -1) {
      // Update existing submission
      this.assessmentSubmission.questionSubmissions[
        existingSubmissionIndex
      ].selectedOptionId = submission.selectedOptionId;
    } else {
      // Add new submission
      this.assessmentSubmission.questionSubmissions.push(submission);
    }

    this.assessmentService.questionSubmissionPost(submission);
  }

  updateAssessment() {
    this.assessmentSubmission.timeRemainingInSeconds = this.remainingTime;
    this.assessmentService
      .updateAssessmentPost(this.assessmentSubmission)
      .subscribe(() => {
        this.lastSavedTime = new Date();
      });
  }

  clearSelection() {
    const questionId = this.questions[this.selectedPage].id;
    const question = this.assessmentSubmission.questionSubmissions.find(
      (q) => q.questionId === questionId
    );
    if (question) {
      question.selectedOptionId = '';
      this.clearOptionEventSubject.next();
      this.updateAssessment();
    }
  }

  navigateToPreviousQuestion() {
    if (this.selectedPage > 0) {
      this.selectedPage--;
      this.currentQuestionId = this.questions[this.selectedPage].id;
    }
  }

  toggleFlagForLater(): void {
    // Toggle the "Flag for Review" status for a question
    if (
      this.assessmentSubmission.flaggedQuestions.includes(
        this.currentQuestionId
      )
    ) {
      this.assessmentSubmission.flaggedQuestions =
        this.assessmentSubmission.flaggedQuestions.filter(
          (q) => q !== this.currentQuestionId
        );
    } else {
      this.assessmentSubmission.flaggedQuestions.push(this.currentQuestionId);
      this.assessmentService
        .postFlagQuestion({
          assessmentId: this.assessmentSubmission.id,
          questionId: this.currentQuestionId,
        })
        .subscribe();
    }
  }

  isQuestionFlagged(questionId: string): boolean {
    return this.assessmentSubmission.flaggedQuestions.includes(questionId);
  }

  checkIfQuestionIsAnswereds(): boolean {
    const questionId = this.questions[this.selectedPage]?.id;
    const question = this.assessmentSubmission?.questionSubmissions?.find(
      (q) => q.questionId === questionId
    );

    return !question?.selectedOptionId; // Returns false if selectedOptionId exists, otherwise true
  }

  isLastQuestion(): boolean {
    return this.selectedPage === this.questions.length - 1;
  }

  navigateToNextQuestion() {
    if (this.selectedPage < this.questions.length - 1) {
      this.selectedPage++;
      this.currentQuestionId = this.questions[this.selectedPage].id;
    }
  }

  isQuestionAttempted(questionId: string): boolean {
    return this.assessmentSubmission.questionSubmissions.some(
      (submission) =>
        submission.questionId === questionId &&
        submission.selectedOptionId !== ''
    );
  }

  navigateToQuestion(index: number): void {
    this.selectedPage = index;
    this.currentQuestionId =
      this.assessmentSubmission.questions[this.selectedPage].id;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  selectUnattemptedQuestion(): void {
    const unattemptedQuestion = this.questions.find(
      (q) =>
        !this.assessmentSubmission.questionSubmissions.some(
          (qs) => qs.questionId === q.id
        )
    );
    if (unattemptedQuestion) {
      this.selectedPage = this.questions.indexOf(unattemptedQuestion);
      this.currentQuestionId = unattemptedQuestion.id;
    }
  }

  enableNextButton(): boolean {
    const id = this.questions[this.selectedPage].id;
    if (id) {
      const isQuestionAttempted =
        this.assessmentSubmission.questionSubmissions.filter(
          (x) => x.questionId === id
        );
      if (isQuestionAttempted && isQuestionAttempted.length > 0) {
        return isQuestionAttempted[0].selectedOptionId !== '';
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
