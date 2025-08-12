import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';
import { remoteRoutes } from './entry.routes';
import { AssessmentService } from '@ss/assessment';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { PreAssessmentComponent } from './pre-assessment/pre-assessment.component';
import { MessagesModule } from 'primeng/messages';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SidebarModule } from 'primeng/sidebar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AssessmentComponent } from './assessment/assessment.component';
import { AptitudeQuestionComponent } from './questions/aptitude-question/aptitude-question.component';
import { BlockUIModule } from 'primeng/blockui';
import { AdversityQuestionComponent } from './questions/adversity-question/adversity-question.component';
import { SeiQuestionComponent } from './questions/Sei-question/Sei-question.component';
import { PsychometricQuestionComponent } from './questions/psychometric-question/psychometric-question.component';
import { InterestPreferencesComponent } from './questions/interest-preferences-question/interest-preferences.component';
import { MenuModule } from 'primeng/menu';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { SplitterModule } from 'primeng/splitter';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AptitudeAssessmentComponent } from './assessment/aptitude-assessment/aptitude-assessment.component';
import { PersonalityAssessmentComponent } from './assessment/personality-assessment/personality-assessment.component';
import { AutoFocusModule } from 'primeng/autofocus';
import { DetailedReportComponent } from './result/detailed/detailed-report.component';
import { Page1Component } from './result/detailed/page1/page1.component';
import { Page2Component } from './result/detailed/page2/page2.component';
import { Page3Component } from './result/detailed/page3/page3.component';
import { Page4Component } from './result/detailed/page4/page4.component';
import { Page6Component } from './result/detailed/page6/page6.component';
import { Page7Component } from './result/detailed/page7/page7.component';
import { Page8Component } from './result/detailed/page8/page8.component';
import { Page9Component } from './result/detailed/page9/page9.component';
import { Page10Component } from './result/detailed/page10/page10.component';
import { Page11Component } from './result/detailed/page11/page11.component';
import { Page19Component } from './result/detailed/page19/page19.component';
import { Page12Component } from './result/detailed/page12/page12.component';
import { Page13Component } from './result/detailed/page13/page13.component';
import { Page14Component } from './result/detailed/page14/page14.component';
import { Page15Component } from './result/detailed/page15/page15.component';
import { Page16Component } from './result/detailed/page16/page16.component';
import { Page17Component } from './result/detailed/page17/page17.component';
import { Page18Component } from './result/detailed/page18/page18.component';
import { Page5Component } from './result/detailed/page5/page5.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ResultSampleComponent } from './result/detailed/result-sample.component';
import { PaymentComponent } from './payment/payment.component';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { SingleQuestionComponent } from './questions/single-question/single-question.component';
import { DividerModule } from 'primeng/divider';
import { AssessmentCongratulationComponent } from './result/detailed/assessment-congratulation.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IntrestPrefrenceInstructionComponent } from './pre-assessment/instruction/intrestPrefrenceInstruction/intrest-prefrence-instruction.component';
import { PyschometricInstructionComponent } from './pre-assessment/instruction/pyschometricInstruction/pyschometric-Instruction.component';
import { ThankYouComponent } from './payment/post-payment/thank-you.component';
@NgModule({
  declarations: [
    RemoteEntryComponent,
    PreAssessmentComponent,
    AssessmentComponent,
    AptitudeQuestionComponent,
    AdversityQuestionComponent,
    SeiQuestionComponent,
    PsychometricQuestionComponent,
    InterestPreferencesComponent,
    AptitudeAssessmentComponent,
    PersonalityAssessmentComponent,
    DetailedReportComponent,
    Page1Component,
    Page2Component,
    Page3Component,
    Page4Component,
    Page5Component,
    Page6Component,
    Page7Component,
    Page8Component,
    Page9Component,
    Page10Component,
    Page11Component,
    Page12Component,
    Page13Component,
    Page14Component,
    Page15Component,
    Page16Component,
    Page17Component,
    Page18Component,
    Page19Component,
    ResultSampleComponent,
    PaymentComponent,
    AssessmentCongratulationComponent,
    IntrestPrefrenceInstructionComponent,
    PyschometricInstructionComponent,
    ThankYouComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(remoteRoutes),
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    PanelModule,
    RadioButtonModule,
    InputTextModule,
    ButtonModule,
    SkeletonModule,
    DialogModule,
    MessagesModule,
    ToastModule,
    DataViewModule,
    TagModule,
    SidebarModule,
    InputGroupAddonModule,
    InputGroupModule,
    BlockUIModule,
    MenuModule,
    ChartModule,
    DropdownModule,
    SplitterModule,
    ScrollPanelModule,
    AutoFocusModule,
    ProgressSpinnerModule,
    TableModule,
    ProgressBarModule,
    SingleQuestionComponent,
    DividerModule,
    ConfirmDialogModule,
  ],
  providers: [AssessmentService, MessageService, ConfirmationService],
})
export class RemoteEntryModule {}
