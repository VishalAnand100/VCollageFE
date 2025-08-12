import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AssessmentService,
  AssessmentSubmissionDto,
  Result,
  StudentDto,
} from '@ss/assessment';
import { BehaviorSubject, take } from 'rxjs';

@Component({
  selector: 'app-assessment-entry',
  templateUrl: './entry.component.html',
})
export class RemoteEntryComponent implements OnInit {
  preAssessmentFormSubmitted$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  studentInfo!: StudentDto;
  ASSESSMENT_KEY = 'assessment-key';
  assessment!: AssessmentSubmissionDto;
  showSubmittedModel = false;
  result!: Result;

  assessmentInstructionSectionToView:
    | 'aptitude'
    | 'sei'
    | 'psychometric'
    | 'adversity'
    | 'interests_and_preferences' = 'aptitude';

  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const student_id = params['student_id'];
      this.assessmentService.getStudentById(student_id).subscribe((student) => {
        this.studentInfo = student;
      });
    });
  }

  preAssessmentFormSubmitted(studentInfo: StudentDto): void {
    this.assessmentService
      .assessmentStartOrResumeAssessmentPost(studentInfo)
      .subscribe((assessmentDto) => {
        if (assessmentDto?.id && !assessmentDto.isSubmitted) {
          localStorage.setItem(this.ASSESSMENT_KEY, assessmentDto.id);
          this.preAssessmentFormSubmitted$.next(true);
          this.assessment = assessmentDto;
        } else {
          this.showSubmittedModel = true;
          if (assessmentDto) this.assessment = assessmentDto;
          localStorage.removeItem(this.ASSESSMENT_KEY);
        }
      });
  }

  onAssessmentCompleted(): void {
    this.assessmentService
      .getAssessmentResult(this.assessment.id)
      .pipe(take(1))
      .subscribe((result) => {
        this.result = result;
        this.router.navigate([
          `/assessment/congratulation-report/${this.assessment.id}`,
        ]);
      });
  }

  goBack(): void {
    window.location.href = 'https://simplifyingskills.com/';
  }

  showResult(id: string): void {
    this.assessmentService.isAssessmentPaid(id).subscribe((response) => {
      if (response.isPaid) {
        this.router.navigate([`assessment/thank-you/${id}`]);
      } else {
        this.router.navigate([`assessment/sample-report/${id}`]);
      }
    });
  }
  goToDashboard() {
    this.router.navigate([`/login`]);
  }
}
