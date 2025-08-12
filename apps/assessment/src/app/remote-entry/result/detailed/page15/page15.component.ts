import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page15',
  templateUrl: './page15.component.html',
  styleUrl: './page15.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page15Component implements OnInit {
  @Input()
  detailedReport!: DetailAssessmentResult;

  @Input()
  topAptiCategoryWiseScoresDisplay = '';

  riasecReasoning: SafeHtml[] = [];
  datReasoning: SafeHtml[] = [];
  oceanReasoning: SafeHtml[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.detailedReport.careerMapping) {
      this.riasecReasoning = Object.values(
        this.detailedReport.careerMapping?.riasecMappingReasoning
      ).map((value) => this.sanitizer.bypassSecurityTrustHtml(value));

      this.datReasoning = Object.values(
        this.detailedReport.careerMapping?.datMappingReasoning
      ).map((value) => this.sanitizer.bypassSecurityTrustHtml(value));

      this.oceanReasoning =Object.values(
        this.detailedReport.careerMapping?.oceanMappingReasoning
      ).map((value) => this.sanitizer.bypassSecurityTrustHtml(value));
    }
  }
}
