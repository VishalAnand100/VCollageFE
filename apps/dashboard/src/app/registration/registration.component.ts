import { Component, OnInit,Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AssessmentService,
  StudentDetailDto,
  StudentDto,
} from '@ss/assessment';
import { InputGroupModule } from 'primeng/inputgroup';

import { RegisterModel } from '@ss/assessment';
import { SelectItem, MessageService } from 'primeng/api';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  referralId: string | null = null;
  selectedCountryCode = '+91';

  countryCodes = [
    { label: '+1', value: '+1' },     // USA, Canada
    { label: '+44', value: '+44' },   // United Kingdom
    { label: '+61', value: '+61' },   // Australia
    { label: '+49', value: '+49' },   // Germany
    { label: '+33', value: '+33' },   // France
    { label: '+55', value: '+55' },   // Brazil
    { label: '+81', value: '+81' },   // Japan
    { label: '+86', value: '+86' },   // China
    { label: '+27', value: '+27' },   // South Africa
    { label: '+977', value: '+977' }, // Nepal
    { label: '+92', value: '+92' },   // Pakistan
    { label: '+880', value: '+880' }, // Bangladesh
    { label: '+971', value: '+971' }, // UAE
    { label: '+7', value: '+7' },     // Russia
    { label: '+39', value: '+39' },   // Italy
    { label: '+34', value: '+34' },   // Spain
    { label: '+94', value: '+94' },   // Sri Lanka
    { label: '+65', value: '+65' },   // Singapore
    { label: '+60', value: '+60' },   // Malaysia
    { label: '+52', value: '+52' },   // Mexico
    { label: '+61', value: '+61' },   // Australia
    { label: '+41', value: '+41' },   // Switzerland
    { label: '+90', value: '+90' },   // Turkey
    { label: '+971', value: '+971' }, // United Arab Emirates
    { label: '+593', value: '+593' }, // Ecuador
    { label: '+54', value: '+54' },   // Argentina
    { label: '+64', value: '+64' },   // New Zealand
    { label: '+82', value: '+82' },   // South Korea
    { label: '+84', value: '+84' },   // Vietnam
    { label: '+233', value: '+233' }, // Ghana
    { label: '+44', value: '+44' },   // United Kingdom
    { label: '+971', value: '+971' }, // UAE
    { label: '+92', value: '+92' },   // Pakistan
    { label: '+1', value: '+1' },     // United States
    { label: '+55', value: '+55' },   // Brazil
    { label: '+44', value: '+44' },   // United Kingdom
    { label: '+91', value: '+91' },   // India
    { label: '+61', value: '+61' },   // Australia
    { label: '+1', value: '+1' },     // USA / Canada
    { label: '+33', value: '+33' },   // France
    { label: '+34', value: '+34' },   // Spain
    { label: '+49', value: '+49' },   // Germany
    { label: '+92', value: '+92' },   // Pakistan
    { label: '+86', value: '+86' },   // China
  ];
  

  

  registrationOptions = [
    { label: 'Student', value: 'Student' },
    // { label: 'Parent', value: 'Parent' },
  ];
  classOptions = [
    { label: '6th', value: '6th' },
    { label: '7th', value: '7th' },
    { label: '8th', value: '8th' },
    { label: '9th', value: '9th' },
    { label: '10th', value: '10th' },
    { label: '11th', value: '11th' },
    { label: '12th', value: '12th' },
  ]; 
  howDidYouFindUsOptions = [
    { label: 'Instagram/Facebook', value: 'Instagram/Facebook' },
    { label: 'School', value: 'School' },
    { label: 'Friends & Relatives', value: 'Friends & Relatives' },
    { label: 'Any other', value: 'Any other' }
  ];
  
  
  ageGroups = [
    { label: '11-13', value: '11to13' },
    { label: '14-17', value: '14to17' },
  ];  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private assessmentService: AssessmentService,
    private renderer: Renderer2,
    private route: ActivatedRoute

  ) {
    
    

  }
  validationcheck() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm); // Show validation errors
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all the required fields correctly.',
        life: 3000,
        sticky: true,
      });
      return;
    }
  
    // Continue registration logic here
  }
  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
  
  
  onClassChange(selectedClass: string, index: number): void {
    const student = this.studentDetails.at(index);

    if (['6th', '7th', '8th'].includes(selectedClass)) {
      student.patchValue({ ageGroup: null });
      student.get('filteredAgeGroups')?.setValue(
        this.ageGroups.filter(group => group.value !== '14to17')
      );
    } else if (['9th', '10th', '11th', '12th'].includes(selectedClass)) {
      student.patchValue({ ageGroup: null });
      student.get('filteredAgeGroups')?.setValue(
        this.ageGroups.filter(group => group.value !== '11to13')
      );
    } else {
      student.get('filteredAgeGroups')?.setValue([...this.ageGroups]);
    }
  }
  ngOnInit(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.setStyle(topbar, 'visibility', 'collapse');
    }

    this.registerForm = this.fb.group(
      {
        countryCode: [this.selectedCountryCode],
        registerFor: [this.registrationOptions[0].value, Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        parentsName: ['', Validators.required],
        contactNumber: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{6,15}$') // Accepts numbers from 6 to 15 digits (general international format)
          ],
        ],

        studentDetails: this.fb.array([this.createStudent()]), // Initialize with one student
        agreeTerms: [false, Validators.requiredTrue], // Ensure checkbox must be checked

      },
      { validator: this.passwordMatchValidator }

    );
this.referralId = this.route.snapshot.queryParamMap.get('ref');
    this.registerForm.get('registerFor')?.valueChanges.subscribe((value) => {
      this.updateStudentDetails(value);
    });

  }

  onCountryChange(event: any) {
  console.log('Country changed:', event);
  this.selectedCountryCode = event.value;
}
  ngOnDestroy(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.removeStyle(topbar, 'visibility');
    }
  }

  get studentDetails() {
    return this.registerForm.get('studentDetails') as FormArray;
  }

  createStudent(): FormGroup {
    return this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(2)]],
      class: ['', Validators.required],
      school: ['', Validators.required],
      ageGroup: ['', Validators.required],
     filteredAgeGroups: [[]] ,// Store dynamic filtered age groups
     howDidYouFindUs: [null, Validators.required],
      email: ['', Validators.email],
    });
  }

  addStudent(): void {
    this.studentDetails.push(this.createStudent());
  }

  removeStudent(index: number): void {
    if (this.studentDetails.length > 1) {
      this.studentDetails.removeAt(index);
    }
  }

  updateStudentDetails(registerFor: string): void {
    if (registerFor === 'Student') {
      while (this.studentDetails.length > 1) {
        this.studentDetails.removeAt(1);
      }
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerModel: RegisterModel = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        username: this.registerForm.value.email,
        referralId: this.referralId ?? undefined, // <-- attach referralId

        students: this.registerForm.value.studentDetails.map(
          (student: any) =>
            ({
              studentName: student.studentName,
              ageGroup: student.ageGroup,
              details: {
                class: student.class,
                school: student.school,
                parentsName: this.registerForm.value.parentsName,
                contactNumber: this.selectedCountryCode + this.registerForm.value.contactNumber,
                findUs: student.howDidYouFindUs,
              } as StudentDetailDto,
              emailAddress: student.email,
              isDeleted: false,
            } as StudentDto)
        ),
      };

      this.assessmentService.register(registerModel).subscribe({
        next: (response) => {
          console.log(response);
          this.messageService.add({
            severity: 'success',
            summary: 'Registration Successful',
            detail: 'You have been registered successfully.',
            life: 3000,
            sticky: true,
          });
          setTimeout(() => {
            // Assuming you have a router instance available
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          if (error.error && error.error.errors) {
            const errors: string[] = error.error.errors;
        
            if (errors.includes('Username already exists.')) {
              this.messageService.add({
                severity: 'error',
                summary: 'Username Error',
                detail: 'The username already exists. Please choose a different username.',
                life: 3000,
              });
            } 
            // ✅ Corrected condition for checking duplicate email errors
            else if (errors.some(err => err.startsWith('Duplicate student email found'))) {
              this.messageService.add({
                severity: 'error',
                summary: 'Duplicate Email',
                detail: 'One or more students have the same email. Please enter unique emails for each student.',
                life: 4000,
              });
            } 
            else {
              this.messageService.add({
                severity: 'error',
                summary: 'Registration Error',
                detail: errors.join(', '), // Display all errors
                life: 3000,
              });
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Unexpected Error',
              detail: 'Something went wrong. Please try again later.',
              life: 3000,
            });
          }
        }
        
      
      });
    }
    }
  }

