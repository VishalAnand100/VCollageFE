import { Route } from '@angular/router';
import { loadRemoteModule } from '@nx/angular/mf';
import { AuthGuard } from '@ss/auth';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { ForgetPasswordComponent } from './forgetPassword/forget-password.component';
import { ReferEarnComponent } from './referPage/refer-earn.component';
import { StudentDashboardComponent } from './layout/Studentdashboard/student_dashboard.component';
import { ProfileComponent } from './profile/profile.component';
export const appRoutes: Route[] = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
    title: 'SimplifyingSkills',
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
    title: 'SimplifyingSkills',
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
    pathMatch: 'full',
    title: 'SimplifyingSkills',
  },
  {
    path: 'register',
    component: RegistrationComponent,
    pathMatch: 'full',
    title: 'SimplifyingSkills',
  },
  { path: 'register-invited', component: RegistrationComponent, title: 'SimplifyingSkills' },
  {
    path: 'refer-earn',
    component: ReferEarnComponent,
    pathMatch: 'full',
    title: 'SimplifyingSkills',
  },
  {
    path: 'assessment',
    loadChildren: () =>
      loadRemoteModule('assessment', './Module').then(
        (m) => m.RemoteEntryModule
      ),
    title: 'SimplifyingSkills',
  },
  {
    path: 'course',
    loadChildren: () =>
      loadRemoteModule('course', './Module').then((m) => m.RemoteEntryModule),
    canActivate: [AuthGuard],
    title: 'SimplifyingSkills',
  },
  {
    path: 'dashboard/:id',
    component: DashboardComponent,
    pathMatch: 'full',
    title: 'SimplifyingSkills',
  },
   {
    path: 'student-dashboard/:id',
    component: StudentDashboardComponent,
    pathMatch: 'full',
    title: 'SimplifyingSkills',
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    pathMatch: 'full',
    title: 'SimplifyingSkills',
  },
];
