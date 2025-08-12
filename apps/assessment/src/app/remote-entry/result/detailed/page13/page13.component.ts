import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CategoryScore, DetailAssessmentResult } from '@ss/assessment';
import { elements, plugins } from 'chart.js';

@Component({
  selector: 'app-page13',
  templateUrl: './page13.component.html',
  styleUrl: './page13.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page13Component implements OnInit {
  @Input()
  detailedReport!: DetailAssessmentResult;

  psychometricScore: {
    category: string;
    scoreObject: CategoryScore;
  }[] = [];

  barChartData: any;
  barChartOptions: any;
  constructor(private cd: ChangeDetectorRef) {}
  ngOnInit() {
    this.psychometricScore = Object.entries(
      this.detailedReport.detailedPsychometricScore.categoryWiseScore
    )
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort(
        (a, b) =>
          b.scoreObject.categoryPercentage - a.scoreObject.categoryPercentage
      );
  }

  getColorByIndex(index: number): string {
    const colors = [
      'rgba(255, 99, 132, 0.75)',
      'rgba(54, 162, 235, 0.75)',
      'rgba(255, 206, 86, 0.75)',
      'rgba(75, 192, 192, 0.75)',
      'rgba(153, 102, 255, 0.75)',
      'rgba(255, 159, 64, 0.75)',
    ];
    return colors[index] || '#FFFFFF';
  }

  getBorderStrokeColorByIndex(index: number): string {
    const colors = [
      'rgba(255, 110, 140, 1)',
      'rgba(54, 170, 240, 1)',
      'rgba(255, 210, 90, 1)',
      'rgba(75, 200, 200, 1)',
      'rgba(140, 110, 255, 1)',
      'rgba(255, 170, 70, 1)',
    ];
    return colors[index] || '#FFFFFF';
  }
}
