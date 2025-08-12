/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  @Input() data: any; // Input to receive JSON data

  psychometricChartData: any;
  aptitudeChartData: any;
  adversityChartData: any;
  seiChartData: any;
  interestChartData: any;

  chartOptions: any;

  ngOnInit(): void {
    this.initializeCharts();
  }

  initializeCharts(): void {
    // Shared chart options
    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      responsive: false,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      animation: {
        duration: 0, // Disable animation duration
        easing: 'easeOutQuad', // Smooth easing without scaling
      },
    };

    // Psychometric Chart
    this.psychometricChartData = this.createChartData(
      this.data.psychometricScore.categoryWiseScore,
      'Psychometric Score'
    );

    // Aptitude Chart
    this.aptitudeChartData = this.createChartData(
      this.data.aptitudeScore.categoryWiseScore,
      'Aptitude Score'
    );

    // Adversity Chart
    this.adversityChartData = this.createChartData(
      this.data.adversityScore.categoryWiseScore,
      'Adversity Score'
    );

    // SEI Chart
    this.seiChartData = this.createChartData(
      this.data.seiScore.categoryWiseScore,
      'SEI Score'
    );

    // Interest and Preferences Chart
    this.interestChartData = this.createChartData(
      this.data.interestAndPreferenceScore.categoryWiseScore,
      'Interest and Preference Score'
    );
  }

  createChartData(categories: any, label: string) {
    const labels = Object.keys(categories).map(
      (key) => categories[key].categoryDisplayText
    );
    const data = Object.keys(categories).map(
      (key) => categories[key].categoryScore
    );

    return {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }
}
