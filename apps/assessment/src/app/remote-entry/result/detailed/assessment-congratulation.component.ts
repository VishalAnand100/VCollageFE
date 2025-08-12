import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-assessment-congratulation',
  templateUrl: './assessment-congratulation.component.html',
  styleUrl: './assessment-congratulation.component.scss',
})
export class AssessmentCongratulationComponent implements OnInit {
  assessmentId!: string;
  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assessmentId = id;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Assessment ID not found in route parameters',
      });
    }
  }
  goToReport() {
    this.router.navigate([`assessment/thank-you/${this.assessmentId}`]);
  }

  exploreNextSteps() {
    this.router.navigate([`/login`]);
  }
  exitAssessment() {
        window.location.href = 'https://simplifyingskills.com/';

  }
}
