import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AssessmentService,
  CategoryScore,
  DetailAssessmentResult,
} from '@ss/assessment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-detailed-report',
  templateUrl: './detailed-report.component.html',
  styleUrl: './detailed-report.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class DetailedReportComponent implements OnInit, OnDestroy {
  @ViewChild('queryElem', { static: false }) content!: ElementRef; // Reference to the #content element

  detailedReport!: DetailAssessmentResult;
  loading = false;
  reportLoading = true;
  constructor(
    private renderer: Renderer2,
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}
  exportPDF() {
    this.loading = true; // Start loading spinner
    const pdf = new jsPDF('p', 'mm', 'a4');
    const content = this.content.nativeElement;
    const pageBreaks = content.querySelectorAll('.page-break');
    pageBreaks.forEach(
      (pageBreak: HTMLElement) => (pageBreak.style.visibility = 'collapse')
    );
    html2canvas(content)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpg', 1);
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 298.45; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
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
     const fileName = `SkillSphere_${this.detailedReport.student?.studentName}_${this.detailedReport.student?.studentCode}_Report.pdf`;
const pdfBlob = pdf.output('blob');

const formData = new FormData();
formData.append('file', pdfBlob, fileName);
formData.append('studentName', this.detailedReport.student?.studentName || '');
formData.append('email', this.detailedReport.student?.emailAddress || '');

// this.assessmentService.sendPdfEmail(
//   pdfBlob,
//   fileName,
//   this.detailedReport.student?.studentName || '',
//   this.detailedReport.student?.emailAddress || ''
// ).subscribe({
//   next: (res) => {
//     console.log('Email sent successfully:', res.message);
//   },
//   error: (err) => {
//     console.error('Error sending email:', err);
//   },
 // complete: () => {
    pdf.save(fileName);  // Save the PDF file locally
    this.loading = false;
    const body = document.querySelector('body');
    if (body) body.classList.remove('p-overflow-hidden');
    this.changeDetectorRef.markForCheck();
//  }
//});



    
        // pdf.save(
        //   `SkillSphere_${this.detailedReport.student?.studentName}_${this.detailedReport.student?.studentCode}_Report.pdf`
        // );

        // this.loading = false; // Stop loading spinner
        // const body = document.querySelector('body');
        // if (body) {
        //   body.classList.remove('p-overflow-hidden');
        // }
        // this.changeDetectorRef.markForCheck(); // Refresh the view

      })
      .finally(() => {
        pageBreaks.forEach(
          (pageBreak: HTMLElement) => (pageBreak.style.visibility = 'visible')
        );
      });
  }

  aptiCategoryWiseScores: { category: string; scoreObject: CategoryScore }[] =
    [];
  topAptiCategoryWiseScoresDisplay!: string[];
  topAptiCategoryWiseScores!: string[];

  ngOnInit(): void {
  const topbar = document.querySelector('.layout-topbar');
  if (topbar) {
    this.renderer.setStyle(topbar, 'visibility', 'collapse');
  }

  this.reportLoading = true;

  const id = this.route.snapshot.paramMap.get('id');
  const isKeyValid =
    (this.route.snapshot.queryParamMap.get('key') ?? '') === 'c3MtcmVwb3J0LWtleS13ZWVrLTEw';

  if (id) {
    // If you want to conditionally block, uncomment this block
    // this.assessmentService.isAssessmentPaid(id).subscribe((response) => {
    //   if (!isKeyValid && !response.isPaid) {
    //     this.router.navigate([`assessment/detailed-report/${id}`]);
    //   } else {

    this.assessmentService.getDetailedReport(id).subscribe({
      next: (data) => {
        this.detailedReport = data;
        this.reportLoading = false;  // ✅ Stop loader when done
      },
      error: (err) => {
        console.error('Failed to load report:', err);
        this.reportLoading = false;  // ✅ Also stop loader on error
      }
    });

    //   }
    // });
  }
}

  ngOnDestroy(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.removeStyle(topbar, 'visibility');
    }
  }
}
