import { Component, Renderer2,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from '@ss/assessment';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})

export class ForgetPasswordComponent implements OnInit {
  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  otpSent = false;
  otpVerified = false; // Initially, OTP is not verified


  constructor(private route: ActivatedRoute,private renderer: Renderer2
 ,    private assessmentService: AssessmentService ){}

  ngOnInit(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.setStyle(topbar, 'visibility', 'collapse');
    }
  }
  ngOnDestroy(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.removeStyle(topbar, 'visibility');
    }
  }


  verifyOtp() {
    this.assessmentService.verifyOtp(this.email, this.otp).subscribe(
      () => {
        alert('OTP verified. Set your new password.');
        this.otpVerified = true; // Show Reset Password form

      },
      err => alert(err.error.message)
    );
  }
  onSubmit() {
    this.assessmentService.sendOtp(this.email).subscribe(
      () => {
        this.otpSent = true;
        alert('OTP sent to your email.');
      },
      err => alert(err.error.message)
    );
  }
  // Step 3: Reset Password
  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.assessmentService.resetPassword(this.email, this.newPassword, this.confirmPassword).subscribe(
      () => {
        alert('Password reset successfully.');
        window.location.href = '/login'; // Redirect to login page
      },
      err => alert(err.error.message)
    );
  }

}
