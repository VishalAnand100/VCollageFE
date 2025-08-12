import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AssessmentService } from './assessment-service.service';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  public blockUi$ = new BehaviorSubject<boolean>(false);
  public closeSideNav$ = new Subject<boolean>();
  public openSideNav$ = new Subject<boolean>();
  public goToQuestionType$ = new BehaviorSubject('aptitude');

  constructor(private assessmentService: AssessmentService) {
    this.goToQuestionType$.subscribe((x) => {
      this.assessmentService.goToQuestionType$.next(x);
    });
  }
}
