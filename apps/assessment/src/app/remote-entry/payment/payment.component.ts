import { Component, OnInit, Renderer2 } from '@angular/core';
import { AssessmentService, PaymentOrder, StudentDto } from '@ss/assessment';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
declare let Razorpay: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  studentId!: string | null;
  discount = 0;
  finalPrice = 0;
  showApplyCouponDialog = false;
  couponCode = '';
  appliedCouponString = '';
  undiscountedPrice = 0;
  studentDto!: StudentDto;
    planName = '';
     userId = localStorage.getItem('userId');

  constructor(
        private renderer: Renderer2,
    
    private route: ActivatedRoute,
    private assessmentService: AssessmentService,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}
  ngOnInit(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.setStyle(topbar, 'visibility', 'collapse');
    }
  
    this.route.queryParamMap.subscribe(params => {
      const encodedPrice = params.get('price');
      const decodedPrice = encodedPrice ? atob(encodedPrice) : '0';
      this.finalPrice = parseFloat(decodedPrice);
      this.planName = this.route.snapshot.queryParamMap.get('name') || '';
      this.undiscountedPrice = this.finalPrice;
    });
  
    this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');
  
      if (!this.studentId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Student ID not found',
        });
        return;
      }
  
      // ✅ Check if payment is already done
      this.assessmentService.getPaymentDetails(this.studentId).subscribe({
        next: (res) => {
          if (res.isPaid) {
            if (res.planName === 'basic') {
              this.loadStudentAndScript();

              // ✅ Navigate to dashboard
            } else {
              // ❌ Not paid: Load student details and Razorpay
              this.router.navigate([`/student-dashboard/${this.userId}`]);

            }
          } else {
            // ❌ Not paid: Load student details and Razorpay
            this.loadStudentAndScript();
          }
        },
        error: () => {
          // 🧭 Payment not found or error → assume unpaid, continue
          this.loadStudentAndScript();
        }
      });
    });
  }
  
  loadStudentAndScript(): void {
    if (this.studentId) {
      this.assessmentService.getStudentByStudentId(this.studentId).subscribe({
        next: (studentDto: StudentDto) => {
          this.studentDto = studentDto;
          this.finalPrice = this.undiscountedPrice - this.discount;
  
          this.loadRazorpayScript().subscribe({
            next: () => console.log('Razorpay script loaded'),
            error: err => console.error(err)
          });
        },
        error: error => {
          console.error('Error fetching student', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to load student data.'
          });
        }
      });
    }
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
      if (this.studentId) {
        this.assessmentService
          .createOrder(this.studentId, this.couponCode,this.undiscountedPrice)
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
                    studentId: this.studentId,
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
      studentId: response.studentId,
      couponCode: this.couponCode,
      planName: this.planName,
      amount: this.finalPrice,
    };

    // Call backend API to verify the payment
    this.assessmentService.verifyPayment(paymentDetails).subscribe({
      next: () => {
        const id = this.route.snapshot.paramMap.get('id');

        this.assessmentService.postPaymentEvent(id).subscribe(); //mail send after payment complete
        this.router.navigate([`/student-dashboard/${this.userId}`]);
      },
      error: (error) => {
        console.error('Payment verification failed', error);
      },
    });
  }
    ngOnDestroy(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.removeStyle(topbar, 'visibility');
    }
  }
}
