import { Component, OnInit } from '@angular/core';
import { AssessmentService, PaymentOrder, StudentDto } from '@ss/assessment';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
declare let Razorpay: any;

@Component({
  selector: 'app-direct-payment',
  standalone: true,
  imports: [ PanelModule, CommonModule,FormsModule,
    ButtonModule,             
    DialogModule,          
    ToastModule    
    ],
  templateUrl: './direct-payment.component.html',
  styleUrl: './direct-payment.component.scss'
})
export class DirectPaymentComponent implements OnInit{
  assessmentId!: string | null;
  discount = 0;
  finalPrice = 1753;
  showApplyCouponDialog = false;
  couponCode = 'SUMMER20';
  appliedCouponString = '';
  undiscountedPrice = 1753;
  studentDto!: StudentDto;
  constructor(
    private route: ActivatedRoute,
    private assessmentService: AssessmentService,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      this.assessmentId = params.get('id');
      if (this.assessmentId) {
        this.assessmentService
          .getStudentAssessmentByAssessmentId(this.assessmentId)
          .subscribe({
            next: (studentDto: StudentDto) => {
              this.studentDto = studentDto;
  
              // Apply 20% discount coupon
              const discountAmount = this.undiscountedPrice * 0.2;
              this.finalPrice = this.undiscountedPrice - this.discount - discountAmount;
              this.discount=discountAmount;
              this.pay();

            },
            error: (error) => {
              console.error('Error fetching payment order', error);
            },
          });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Assessment ID not found',
        });
      }
    });
  }
  

  loadRazorpayScript() {
    return new Observable((observer) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => observer.next(true);
      script.onerror = () => observer.error('Error loading Razorpay script');
      document.head.appendChild(script);
    });
  }

  pay() {
    // Dynamically load the Razorpay script

    this.loadRazorpayScript().subscribe(() => {
      if (this.assessmentId) {
        this.assessmentService
          .createOrder(this.assessmentId, this.couponCode, this.finalPrice)
          .subscribe({
            next: (paymentOrder: PaymentOrder) => {
              const options = {
                key: paymentOrder.razorpayKey, //'rzp_test_bbkRw5rlZLOXyG',
                amount: paymentOrder.amount,
                currency: paymentOrder.currency,
                order_id: paymentOrder.orderId,

                handler: (response: {
                  razorpay_payment_id: string;
                  razorpay_order_id: string;
                  razorpay_signature: string;
                }) => {
                  const extendedResponse = {
                    ...response,
                    assessmentId: this.assessmentId,
                  };
                  this.verifyPayment(extendedResponse);
                },

                prefill: {
                  name: paymentOrder.student?.studentName,
                  email: paymentOrder.student?.emailAddress,
                  contact: paymentOrder.student?.details?.contactNumber,
                },

                theme: {
                  color: '#3399cc',
                },
              };

              const razorpay = new Razorpay(options);
              razorpay.open();
            },

            error: (error) => {
              console.error('Error creating order', error);
            },
          });
      }
    });
  }

  applyCoupon(coupon: string) {
    this.assessmentService.verifyCoupon(coupon).subscribe({
      next: (response) => {
        this.showApplyCouponDialog = false;
  
        // Check if coupon is valid
        if (response.success && response.coupon) {
          this.appliedCouponString = `(${response.coupon.code})`;
          this.discount = (this.undiscountedPrice * response.coupon.discount) / 100;
          this.finalPrice = this.undiscountedPrice - this.discount;
  
          // Display success message
          this.messageService.add({
            severity: 'success',
            summary: 'Coupon Applied',
            detail: response.message || 'Coupon applied successfully',
          });
        } else {
          // Handle invalid or expired coupon with dynamic response message
          this.messageService.add({
            severity: 'warn',
            summary: 'Coupon Not Applied',
            detail: response.message, // Displaying the message sent from the backend
          });
        }
      },
      error: (error) => {
        // Handle unexpected errors
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'An unexpected error occurred. Please try again.',
        });
        this.showApplyCouponDialog = false;
      },
    });
  }
  
  showApplyCoupon() {
    this.showApplyCouponDialog = true;
  }

  verifyPayment(response: any) {
    const paymentDetails = {
      orderId: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
      signature: response.razorpay_signature,
      assessmentId: response.assessmentId,
    };

    // Call backend API to verify the payment
    this.assessmentService.verifyPayment(paymentDetails).subscribe({
      next: () => {
        const id = this.route.snapshot.paramMap.get('id');
        this.assessmentService.postPaymentEvent(id).subscribe();
        this.router.navigate([`assessment/thank-you/${id}`]);
      },
      error: (error) => {
        console.error('Payment verification failed', error);
      },
    });
  }
}
