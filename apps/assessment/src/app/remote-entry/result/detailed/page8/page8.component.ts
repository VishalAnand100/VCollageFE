import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CategoryScore, DetailAssessmentResult } from '@ss/assessment';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-page8',
  templateUrl: './page8.component.html',
  styleUrl: './page8.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page8Component implements OnInit {
  @Input()
  detailedReport!: DetailAssessmentResult;
  interestAndPreferenceScore: {
    category: string;
    scoreObject: CategoryScore;
  }[] = [];
  radarChartData: any;
  radarChartOptions: any;
  cordRealistic = '0,0';
  cordInvestigative = '50,25';
  cordArtistic = '50,75';
  cordSocial = '0,100';
  cordEnterprising = '-50,75';
  cordConventional = '-50,25';
  categoryCoordinates: { [key: string]: string } = {
    R: this.cordRealistic,
    I: this.cordInvestigative,
    A: this.cordArtistic,
    S: this.cordSocial,
    E: this.cordEnterprising,
    C: this.cordConventional,
  };
  trianglePoints= '';
  ngOnInit() {
    this.interestAndPreferenceScore = Object.entries(
      this.detailedReport.interestAndPreferenceScore.categoryWiseScore
    )
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort(
        (a, b) => b.scoreObject.categoryScore - a.scoreObject.categoryScore
      );

    const top3Scores = this.interestAndPreferenceScore.slice(0, 3);
    const topScores = top3Scores.map(
      (score) => score.scoreObject.categoryScore
    );

    this.trianglePoints = top3Scores
      .map((score) => this.categoryCoordinates[score.scoreObject.categoryLetter])
      .join(' ');

    this.radarChartData = {
      labels: [
        'Realistic',
        'Investigative',
        'Artistic',
        'Social',
        'Enterprising',
        'Conventional',
      ],
      datasets: [
        {
          label: 'Top 3 Scores',
          data: topScores,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };

    this.radarChartOptions = {
      responsive: true,
      plugins: {
        legend: false, // Hide legend
      },
      scales: {
        r: {
          beginAtZero: true,
        },
      },
    };
  }
}
