import { Component, EventEmitter, Input, Output, OnInit,Renderer2, OnDestroy } from '@angular/core';
import {
  AssessmentService,
  AssessmentSubmissionDto,
  StudentDto,
} from '@ss/assessment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss'],
})
export class AssessmentComponent implements OnInit, OnDestroy {
  @Input() assessmentInput!: AssessmentSubmissionDto;
  @Output() assessmentSubmitted = new EventEmitter<boolean>();
  @Input() studentInfo!: StudentDto;

  currentSection!: 'aptitude' | 'personality';
  constructor(private readonly assessmentService: AssessmentService,private renderer: Renderer2,    private messageService: MessageService
  
  ) {}

  ngOnInit(): void {   
    this.assessmentService
      .resumeAssessmentPost(this.assessmentInput.id)
      .subscribe((assessmentDto) => {
        if (assessmentDto) {
          this.assessmentInput = assessmentDto;
        }
      });
  }
  ngOnDestroy(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.removeStyle(topbar, 'visibility');
    }
  }

  onSectionSubmission($event: string): void {
    if ($event === 'aptitude') {
      this.currentSection = 'personality';
      this.assessmentInput.currentSection = 'personality';
      this.assessmentService
        .updateAssessmentPost(this.assessmentInput)
        .subscribe();
    } else {
      this.assessmentInput.personalitySubmitted = true;
      this.assessmentInput.isSubmitted = true;
      this.assessmentService
        .updateAssessmentPost(this.assessmentInput)
        .subscribe(() => {
          this.assessmentSubmitted.emit(true);
        });
    }
  }
  shouldStartAptitudeSection(): boolean {
    return (
      !this.assessmentInput.aptitudeSubmitted ||
      !(this.assessmentInput.currentSection === 'personality')
    );
  }

  shouldStartPersonalitySection(): boolean {
    return (
      this.assessmentInput.aptitudeSubmitted &&
      this.assessmentInput.currentSection === 'personality'
    );
  }
}
