import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { CategoryScore, DetailAssessmentResult } from '@ss/assessment';

@Component({
  selector: 'app-page5',
  templateUrl: './page5.component.html',
  styleUrl: './page5.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Page5Component implements OnInit {
  @Input()
  detailedReport!: DetailAssessmentResult;

  aptiCategoryWiseScores: { category: string; scoreObject: CategoryScore }[] =
    [];

  ngOnInit(): void {
    this.aptiCategoryWiseScores = Object.entries(
      this.detailedReport.aptitudeScore.categoryWiseScore
    )
      .map(([category, scoreObject]) => ({
        category,
        scoreObject,
      }))
      .sort(
        (a, b) =>
          b.scoreObject.categoryPercentage - a.scoreObject.categoryPercentage
      );
  }

  getHueColor(score: number): string {
    const hue = (score / 100) * 100; // 0 (red) to 120 (green)
    return `hsl(${hue}, 80%, 50%)`;
  }

  getColorByIndex(index: number): string {

  const colors = ['#1BE4E7', '#40B8D5', '#2C8BB9', '#2E5E98', '#32346E', '#5D3866', '#885272', '#886272'];
  return colors[index] || '#FFFFFF';
  }
}
