import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';
import { DetailedReportComponent } from './result/detailed/detailed-report.component';
import { ResultSampleComponent } from './result/detailed/result-sample.component';
import { PaymentComponent } from './payment/payment.component';
import { AssessmentCongratulationComponent } from './result/detailed/assessment-congratulation.component';
import { AptitudeInstructionComponent } from './pre-assessment/instruction/aptitudeInstruction/aptitude-instruction/aptitude-instruction.component';
import { ThankYouComponent } from './payment/post-payment/thank-you.component';
import { DirectPaymentComponent } from './payment/direct-payment/direct-payment.component';
import { AuthGuard } from '../auth.guard';
import { PlansGrowComponent } from './payment/plans-grow/plans-grow.component';

export const remoteRoutes: Route[] = [
  { path: ':student_id', component: RemoteEntryComponent,
    title: 'SimplifyingSkills'

   },
  { path: 'sample-report/:id', component: ResultSampleComponent,title: 'SimplifyingSkills'},
  { path: 'assessment/sample-report/:id', component: ResultSampleComponent,title: 'SimplifyingSkills'},
  { path: 'detailed-report/:id', component: DetailedReportComponent,title: 'SimplifyingSkills'},
  {
    path: 'congratulation-report/:id',
    component: AssessmentCongratulationComponent,
    title: 'SimplifyingSkills',
  },
  {
    path: 'assessment/congratulation-report/:id',
    component: AssessmentCongratulationComponent,
    title: 'SimplifyingSkills',
  },
  {
    path: 'payment/:id',
    component: PaymentComponent,
    title: 'SimplifyingSkills',
    canActivate: [AuthGuard]

  },
  {
    path: 'assessment/payment/:id',
    component: PaymentComponent,
    title: 'SimplifyingSkills',
   canActivate: [AuthGuard]

  },
  {
    path: 'aptitude-instruction/:id',
    component: AptitudeInstructionComponent,
    title: 'SimplifyingSkills',
  },
  {
    path: 'aptitude-instruction/:id',
    component: AptitudeInstructionComponent,
    title: 'SimplifyingSkills',
  },
  {
    path: 'assessment/thank-you/:id',
    component: ThankYouComponent,
    title: 'SimplifyingSkills',
  },
  {
    path: 'thank-you/:id',
    component: ThankYouComponent,
    title: 'SimplifyingSkills',
  },
  {
    path: 'direct-payment/:id',
    component: DirectPaymentComponent,
    title: 'SimplifyingSkills',
  },
  {
    path: 'plans-grow/:id',
    component: PlansGrowComponent,
    title: 'SimplifyingSkills',
  }
];
