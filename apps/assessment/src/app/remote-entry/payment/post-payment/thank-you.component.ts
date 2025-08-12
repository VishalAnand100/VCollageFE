import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService, StudentDto } from '@ss/assessment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.scss',
})
export class ThankYouComponent implements OnInit {
  assessmentId!: string | null;
  studentDto!: StudentDto;
  constructor(
    private route: ActivatedRoute,
    private assessmentService: AssessmentService,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.assessmentId = params.get('id');
      if (this.assessmentId) {
        this.assessmentService
          .getStudentAssessmentByAssessmentId(this.assessmentId)
          .subscribe({
            next: (studentDto: StudentDto) => {
              this.studentDto = studentDto;
            },
            error: (error) => {
              console.error('Error fetching payment order', error);
            },
          });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Assessment ID not found',
        });
      }
    });
  }
}
