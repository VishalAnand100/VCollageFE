import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AssessmentService,
  CategoryScore,
  DetailAssessmentResult,
  PaymentOrder,
} from '@ss/assessment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Observable } from 'rxjs';

export declare let Razorpay: any;

@Component({
  selector: 'app-result-sample',
  templateUrl: './result-sample.component.html',
  styleUrl: './result-sample.component.scss',
})
export class ResultSampleComponent implements OnInit, OnDestroy {
  @ViewChild('queryElem', { static: false }) content!: ElementRef; // Reference to the #content element

  detailedReport!: DetailAssessmentResult;
  loading = false;
  reportLoading = true;
  assessmentId!: string;
  constructor(
    private renderer: Renderer2,
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private readonly router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  aptiCategoryWiseScores: { category: string; scoreObject: CategoryScore }[] =
    [];
  interestAndPreferenceScore: {
    category: string;
    scoreObject: CategoryScore;
  }[] = [];
  seiScore: {
    category: string;
    scoreObject: CategoryScore;
  }[] = [];

  psychometricScore: {
    category: string;
    scoreObject: CategoryScore;
  }[] = [];

  ngOnInit(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.setStyle(topbar, 'visibility', 'collapse');
    }
    this.reportLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assessmentId = id;
      this.assessmentService.getDetailedReport(id).subscribe((data) => {
        this.detailedReport = data;
        this.aptiCategoryWiseScores = Object.entries(
          this.detailedReport.aptitudeScore.categoryWiseScore
        )
          .map(([category, scoreObject]) => ({
            category,
            scoreObject,
          }))
          .sort(
            (a, b) =>
              b.scoreObject.categoryPercentage -
              a.scoreObject.categoryPercentage
          );

        this.interestAndPreferenceScore = Object.entries(
          this.detailedReport.interestAndPreferenceScore.categoryWiseScore
        )
          .map(([category, scoreObject]) => ({ category, scoreObject }))
          .sort(
            (a, b) => b.scoreObject.categoryScore - a.scoreObject.categoryScore
          );

        this.aptiCategoryWiseScores = Object.entries(
          this.detailedReport.aptitudeScore.categoryWiseScore
        )
          .map(([category, scoreObject]) => ({
            category,
            scoreObject,
          }))
          .sort(
            (a, b) =>
              b.scoreObject.categoryPercentage -
              a.scoreObject.categoryPercentage
          );

        this.seiScore = Object.entries(
          this.detailedReport.seiScore.categoryWiseScore
        )
          .map(([category, scoreObject]) => ({ category, scoreObject }))
          .sort(
            (a, b) => b.scoreObject.categoryScore - a.scoreObject.categoryScore
          );

        this.psychometricScore = Object.entries(
          this.detailedReport.detailedPsychometricScore.categoryWiseScore
        )
          .map(([category, scoreObject]) => ({ category, scoreObject }))
          .sort(
            (a, b) => b.scoreObject.categoryScore - a.scoreObject.categoryScore
          );

        this.reportLoading = false;
      });
    }
  }

  ngOnDestroy(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.removeStyle(topbar, 'visibility');
    }
  }

  pay() {
    this.router.navigate([`assessment/payment/${this.assessmentId}`]);
  }

  // Method to verify payment after success
  verifyPayment(response: any) {
    const paymentDetails = {
      orderId: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
      signature: response.razorpay_signature,
      assessmentId: response.assessmentId,
    };

    // Call backend API to verify the payment
    this.assessmentService.verifyPayment(paymentDetails).subscribe({
      next: (result) => {
        const id = this.route.snapshot.paramMap.get('id');

        this.router.navigate([`assessment/thank-you/${id}`]);
        console.log('Payment Verified', result);
      },
      error: (error) => {
        console.error('Payment verification failed', error);
      },
    });
  }

  goToDashboard() {
    this.router.navigate([`/login`]);
  }

  exportPDF() {
    this.loading = true; // Start loading spinner
    const pdf = new jsPDF('p', 'mm', 'a4');
    const content = this.content.nativeElement;
    const pageBreaks = content.querySelectorAll('.page-break');
    pageBreaks.forEach((pageBreak: HTMLElement) => pageBreak.remove());
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpg', 1);
      const imgWidth = 210 * 0.99; // A4 width in mm
      const pageHeight = 298; // A4 height in mm
      const imgHeight = ((canvas.height * imgWidth) / canvas.width) * 0.99;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        imgData,
        'JPG',
        0,
        position,
        imgWidth,
        imgHeight,
        '',
        'FAST'
      );
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          'JPG',
          0,
          position,
          imgWidth,
          imgHeight,
          '',
          'FAST'
        );
        heightLeft -= pageHeight;
      }

      pdf.save(
        `SkillSphere_${this.detailedReport.student?.studentName}_${this.detailedReport.student?.studentCode}_Report.pdf`
      );
      this.loading = false; // Stop loading spinner
      const body = document.querySelector('body');
      if (body) {
        body.classList.remove('p-overflow-hidden');
      }
      this.changeDetectorRef.markForCheck(); // Refresh the view
    });
  }
}
