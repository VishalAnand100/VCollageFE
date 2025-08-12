import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppLayoutComponent } from './layout/app.layout.component';
import { Router, RouterModule } from '@angular/router';

describe('AppLayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([{ path: '', component: AppLayoutComponent }]),
      ],
      declarations: [AppLayoutComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppLayoutComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppLayoutComponent);
    const router = TestBed.inject(Router);
    fixture.ngZone?.run(() => router.navigate(['']));
    tick();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome dashboard'
    );
  }));
});
