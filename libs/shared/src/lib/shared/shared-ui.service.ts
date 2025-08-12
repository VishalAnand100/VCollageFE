import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'platform',
})
export class SharedUiService {
  private showTopbarSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showTopbar$: Observable<boolean> = this.showTopbarSubject.asObservable();

  setShowTopbar(show: boolean): void {
    this.showTopbarSubject.next(show);
  }
}