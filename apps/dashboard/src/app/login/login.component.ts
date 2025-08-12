import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssessmentService, LoginResponseDto } from '@ss/assessment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private assessmentService: AssessmentService,
    private messageService: MessageService,
    private renderer: Renderer2,
  ) {
    
  }

  ngOnInit(): void {
        this.verifyTokenAndNavigate();

    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.setStyle(topbar, 'visibility', 'collapse');
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

  }

  ngOnDestroy(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.removeStyle(topbar, 'visibility');
    }
  }

  verifyTokenAndNavigate(): void {
  const token = localStorage.getItem('token');

  if (token) {
    this.assessmentService.verifyToken(token).subscribe({
      next: (data) => {
        if (data) {
          const redirectUrl = localStorage.getItem('redirectAfterLogin');

        if (redirectUrl && data.students.length > 0) {
         const studentId = data.students[0].id; 

          const updatedUrl = redirectUrl.replace(/\/payment\/[^/?]+/, `/payment/${studentId}`);

                 localStorage.removeItem('redirectAfterLogin');

                 window.location.href = updatedUrl;
          }  else {
            const userIdFromLocalStorage = localStorage.getItem('userId');
            if (userIdFromLocalStorage) {
              this.router.navigate([`/student-dashboard/${userIdFromLocalStorage}`]);
            } else {
              this.router.navigate(['/student-dashboard']);
            }
          }
        }
      },
      error: (error: Error) => {
        console.error('Token verification failed', error);
        this.messageService.add({
          severity: 'warn',
          summary: 'Login Expired',
          detail: 'Please login again',
        });
      }
    });
  }
}


  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.assessmentService.login({ username: email, password }).subscribe({
        next: (data: LoginResponseDto) => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId.toString());
          localStorage.setItem('email', data.email);
          localStorage.setItem('studentId', data.students[0]?.id ?? '');//single studentId stored in localStorage

            const redirectUrl = localStorage.getItem('redirectAfterLogin');

        if (redirectUrl && data.students.length > 0) {
         const studentId = data.students[0].id; 

          const updatedUrl = redirectUrl.replace(/\/payment\/[^/?]+/, `/payment/${studentId}`);

                 localStorage.removeItem('redirectAfterLogin');

                 window.location.href = updatedUrl;
          } 
          else{
          this.router.navigate([`/student-dashboard/${data.userId}`]);
          }
        },
        error: (error: any) => {
           console.error('Login failed:', error);
           console.log('Error Response:', error.error); // Log full error
  
           const errorMessage = error?.error?.message || error?.message || error?.statusText;
  
           if (errorMessage?.includes('Invalid username or password.')) {
             this.messageService.add({
               severity: 'error',
               summary: 'Login Failed',
               detail: 'Invalid username or password. Please try again.',
             });
           } else {
               console.error('Login failed', error)
           }
         },
        
      });
    }
  }
}
