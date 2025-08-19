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
  showRegisterSection = false; // set to true to show it
  yearOptions: SelectItem[] = [];


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
  streamOptions = [
    { label: 'Management', value: 'management' },
    { label: 'Engineering', value: 'engineering' },
   
  ];
  degreeOptions = [
    { label: 'Diploma', value: 'Diploma' },
    { label: 'UG', value: 'UG' },
    { label: 'PG', value: 'PG' },   
  ];

  intrestOptions = [
    { label: 'Higher Studies', value: 'Higher Studies' },
    { label: 'Entrepreneur', value: 'Entrepreneur' },
    { label: 'Private', value: 'Private' },
    { label: 'Government', value: 'Government' },   
  ];
  ageGroups = [
    { label: '11-13', value: '11to13' },
    { label: '14-17', value: '14to17' },
  ]; 
   programTypes = [
    { label: 'Certificate', value: 'Certificate' },
    { label: 'Diploma', value: 'Diploma' },
    { label: 'Undergraduate', value: 'Undergraduate' },
    { label: 'Postgraduate', value: 'Postgraduate' }
  ];

  allPrograms: any = {
     Certificate: [
    // ✅ Engineering
    { label: 'Certificate in Fire Technology and Safety Engineering (Industrial Safety & Engineering)', value: 'cert-fire' },
    { label: 'Certificate in Electrical Engineering (Solar PV System & Installation and Maintenance)', value: 'cert-electrical' },
    { label: 'Certificate in Electronics Engineering (VHDL & Verilog Programming / IoT / ICT)', value: 'cert-electronics' },
    { label: 'Certificate in Civil Engineering (Survey Engineering / Material Testing / Construction)', value: 'cert-civil' },
    { label: 'Certificate in Mechanical Engineering (CAD / Automobile / RAC)', value: 'cert-mechanical' },
    { label: 'Certificate in Computer Science Engineering (Programming Language / Data Science)', value: 'cert-cse' },
    { label: 'Certificate in Chemical Engineering', value: 'cert-chemical' },
    { label: 'Certificate in Mining Engineering', value: 'cert-mining' },

    // ✅ Business & Management
    { label: 'Certificate in Retail and Operations Management', value: 'cert-retail' },
    { label: 'Certificate in Banking, Financial Services & Insurance (BFSI)', value: 'cert-bfsi' },

    // ✅ Language
    { label: 'Certificate in French language', value: 'cert-french' },

    // ✅ Health & Wellness
    { label: 'Certificate in Yoga and Naturopathy', value: 'cert-yoga' },
    { label: 'Certificate in Clinical Assistance', value: 'cert-clinical' },
    { label: 'Certificate in Telemedicine', value: 'cert-telemedicine' },

    // ✅ Design
    { label: 'Certificate in Interior Design', value: 'cert-interior' },
    { label: 'Certificate in Fashion Design', value: 'cert-fashion' },
            { label: 'Other', value: 'c-other' }

  ],
    Diploma: [
    // ✅ Engineering
    { label: 'Diploma in Electrical Engineering', value: 'dip-electrical' },
    { label: 'Diploma in Civil Engineering', value: 'dip-civil' },
    { label: 'Diploma in Mechanical Engineering', value: 'dip-mechanical' },
    { label: 'Diploma in Fire Technology and Safety Engineering', value: 'dip-fire' },
    { label: 'Diploma in Electronics and Communication Engineering', value: 'dip-ece' },
    { label: 'Diploma in Computer Science and Engineering', value: 'dip-cse' },
    { label: 'Diploma in Information Technology', value: 'dip-it' },
    { label: 'Diploma in Cyber Security', value: 'dip-cyber' },
    { label: 'Diploma in Drone Technology', value: 'dip-drone' },
    { label: 'Diploma in Chemical Engineering', value: 'dip-chemical' },
    { label: 'Diploma in Mining Engineering', value: 'dip-mining' },

    // ✅ Safety & Environment
    { label: 'Diploma in Industrial Safety', value: 'dip-safety' },
    { label: 'Diploma in Health Safety and Environment', value: 'dip-hse' },

    // ✅ Management & Business
    { label: 'Diploma in Retail and Operations Management', value: 'dip-retail' },
    { label: 'Diploma in Banking, Financial Services & Insurance (BFSI)', value: 'dip-bfsi' },
    { label: 'Diploma in Business Management', value: 'dip-business' },

    // ✅ Law
    { label: 'Diploma in Cyber Law', value: 'dip-cyberlaw' },
    { label: 'Diploma in Labour Law', value: 'dip-labourlaw' },
    { label: 'Diploma in International Family Relations', value: 'dip-family' },
    { label: 'Diploma in Taxation and GST', value: 'dip-gst' },

    // ✅ Agriculture
    { label: 'Diploma in Agriculture (One year)', value: 'dip-agri1' },
    { label: 'Diploma in Agriculture (Two years)', value: 'dip-agri2' },

    // ✅ Medical & Health
    { label: 'Diploma in Pharmacy', value: 'dip-pharma' },
    { label: 'Diploma in Diabetes', value: 'dip-diabetes' },
    { label: 'Diploma in Diabetes Education', value: 'dip-diabetesedu' },
    { label: 'Diploma in Yoga and Naturopathy', value: 'dip-yoga' },

    // ✅ Design
    { label: 'Diploma in Interior Design', value: 'dip-interior' },
    { label: 'Diploma in Fashion Design', value: 'dip-fashion' },
    //Advance Diploma
     { label: 'Advance Diploma in Industrial Safety', value: 'adv-safety' },
      { label: 'Advance Diploma in Environment Health and Safety', value: 'adv-hse' }
  ],
    'Postgraduate': [
      { label: 'M.Sc. (Embryology)', value: 'msc-embryology' },
    { label: 'M.Sc. (Physics)', value: 'msc-physics' },
    { label: 'M.Sc. (Chemistry)', value: 'msc-chemistry' },
    { label: 'M.Sc. (Maths)', value: 'msc-maths' },
    { label: 'M.Sc. (Biotechnology)', value: 'msc-biotech' },
    { label: 'M.Sc. (Forensic Science)', value: 'msc-forensic' },
    { label: 'M.Sc. (Biology)', value: 'msc-biology' },
    { label: 'M.Sc. (Microbiology)', value: 'msc-microbiology' },
    { label: 'M.Sc. (Environment Science)', value: 'msc-environment' },
    { label: 'MCA', value: 'mca' },
        { label: 'MBA', value: 'mba' },

        { label: 'Other', value: 'm-other' }


    ],
    'Undergraduate': [
    { label: 'B.Sc. (Embryology)', value: 'bsc-embryology' },
    { label: 'B.Sc. (Physics, Chemistry, Maths)', value: 'bsc-pcm' },
    { label: 'B.Sc. (Chemistry, Botany, Zoology)', value: 'bsc-cbz' },
    { label: 'B.Sc. (Biotechnology)', value: 'bsc-biotech' },
    { label: 'B.Sc. (Microbiology)', value: 'bsc-microbiology' },
    { label: 'B.Sc. (Environment Science)', value: 'bsc-environment' },
    { label: 'B.Sc. (Forensic Science)', value: 'bsc-forensic' },
    { label: 'B.Sc. in Interior Design', value: 'bsc-interior' },
    { label: 'B.Sc. in Fashion Design', value: 'bsc-fashion' },
    { label: 'B.Sc. in Yoga and Naturopathy', value: 'bsc-yoga' },
    { label: 'Bachelor of Science (B.Sc.) Hons. in Agriculture', value: 'bsc-agriculture-hons' },

    // ✅ Design & Arts
    { label: 'B. Design in Fashion Technology and Accessory Design', value: 'bdes-fashion' },
    { label: 'Bachelor of Fine Arts (BFA)', value: 'bfa' },
    { label: 'B.A. in History, Sociology, Political Science', value: 'ba-hsp' },
    { label: 'B.A. in History, Psychology, Political Science', value: 'ba-hpp' },
    { label: 'B.A. in Geography, History, Political Science', value: 'ba-ghp' },
    { label: 'B.A. in Economics, Hindi, Political Science', value: 'ba-ehp' },
    { label: 'B.A. in Economics, English, Political Science', value: 'ba-eep' },
    { label: 'B.A. in English, Geography, Home Science', value: 'ba-egh' },
    { label: 'B.A. in Hindi, Geography, Home Science', value: 'ba-hgh' },
    { label: 'B.A. in Sanskrit, Hindi, History', value: 'ba-shh' },
    { label: 'B.A. in English, Geography, Philosophy', value: 'ba-egp' },
    { label: 'B.A. in Yoga', value: 'ba-yoga' },
    { label: 'B.A. in Drawing and Painting', value: 'ba-drawing' },

    // ✅ Professional Programs
    { label: 'Bachelor of Social Work', value: 'bsw' },
    { label: 'Bachelor of Computer Application (B.C.A.)', value: 'bca' },
    { label: 'Bachelor in Pharmacy', value: 'bpharma' },
    { label: 'Bachelor of Arts and Bachelor of Legislative Law (B.A. L.L.B.)', value: 'ba-llb' },
    { label: 'Bachelor of Legislative Law (LL.B.)', value: 'llb' },
    { label: 'Bachelor of Business Administration (BBA)', value: 'bba' },
    { label: 'Bachelor of Commerce (B. Com)', value: 'bcom' },
    { label: 'Bachelor of Commerce (B. Com) Hons', value: 'bcom-hons' },
    { label: 'BBA with specialization in Business Analytics in collaboration with IBM', value: 'bba-analytics' },

    // ✅ Engineering
    { label: 'B. Tech in AIML', value: 'btech-aiml' },
    { label: 'B. Tech in Civil Engineering', value: 'btech-civil' },
    { label: 'B. Tech in Computer Science and Engineering', value: 'btech-cse' },
    { label: 'B.Tech in Electronics and Communications Engineering', value: 'btech-ece' },
    { label: 'B.Tech in Fire Technology and Safety Engineering', value: 'btech-fire' },
          { label: 'Other', value: 'b-other' }
  ]  };

  programNames: any[] = [];
  constructor(
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
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 5;
    
    for (let i = startYear; i <= endYear; i++) {
      this.yearOptions.push({ label: i.toString(), value: i.toString() });
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
       // parentsName: ['', Validators.required],
        contactNumber: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{6,15}$') // Accepts numbers from 6 to 15 digits (general international format)
          ],
        ],
      //stream: ['', Validators.required],
     // branch: ['', Validators.required],

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

onProgramTypeChange(event: any) {
    const selectedType = event.value;
    this.programNames = this.allPrograms[selectedType] || [];
    this.registerForm.patchValue({ programName: null }); // reset program name
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
      //class: ['', Validators.required],
    //  school: ['', Validators.required],
     // ageGroup: ['', Validators.required],
     filteredAgeGroups: [[]] ,// Store dynamic filtered age groups
    // howDidYouFindUs: [null, Validators.required],
     pancard: [null, Validators.required],
     marks10th: [null, Validators.required],
     marks12th: [null, Validators.required],
   //  degree: [null, Validators.required],
     cureent_Cgpa: [null, Validators.required],
     backLogs: [null, Validators.required],
     interest: [null, Validators.required],
     year_Of_Passing: [null, Validators.required],
   //  degree_Type: [null, Validators.required],
     //dOB: [null, Validators.required],
      email: ['', Validators.email],
       programType: [null, Validators.required],
      programName: [null, Validators.required],
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
                      branch: this.registerForm.value.branch,

            //  ageGroup: student.ageGroup,
              stream: this.registerForm.value.stream,

              details: {
              //  class: student.class,
              //  school: student.school,
               // parentsName: this.registerForm.value.parentsName,
                contactNumber: this.selectedCountryCode + this.registerForm.value.contactNumber,
                //findUs: student.howDidYouFindUs,
                pancard: student.pancard,
                marks10th: student.marks10th,
                marks12th: student.marks12th,
                //degree: student.degree,
                cureent_Cgpa: student.cureent_Cgpa,
                backLogs: student.backLogs,
                interest: student.interest,
                year_Of_Passing: student.year_Of_Passing,
                degree_Type: student.degree_Type,
                programType: student.programType,
                programName: student.programName,
               // dOB: student.dOB,
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

