import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService, StudentAssessmentDetailDto, StudentDto, StudentDetailDto, AddStudentsModel } from '@ss/assessment';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  showAddStudent = false;
  studentForm!: FormGroup;
  userId!: number;
  ageGroupOptions: SelectItem[];
  classOptions: SelectItem[];
  showTable = false;
  studentAssessmentDetails!: StudentAssessmentDetailDto[];

  newStudent: StudentDto = {
    studentName: '',
    ageGroup: '',
    details: {
      class: '',
      school: '',
      parentsName: '',
      contactNumber: ''
    } as StudentDetailDto,
    emailAddress: '',
    isDeleted: false
  } as StudentDto;
  

  constructor(
    private route: ActivatedRoute,
    private assessmentService: AssessmentService,
    private router: Router,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.removeStyle(topbar, 'visibility');
    }
    this.ageGroupOptions = [
      { label: '11-13', value: '11to13' },
      { label: '14-17', value: '14to17' },
    ];
    this.classOptions = [
      { label: '6th', value: '6th' },
      { label: '7th', value: '7th' },
      { label: '8th', value: '8th' },
      { label: '9th', value: '9th' },
      { label: '10th', value: '10th' },
      { label: '11th', value: '11th' },
      { label: '12th', value: '12th' },
    ];
  }


  ngOnInit() {
    this.showTable = false;
    this.initStudentForm();
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      this.assessmentService
        .getStudentsByUserId(this.userId)
        .subscribe((students) => {
          this.studentAssessmentDetails = students;
          this.showTable = true;
        });
    });
  }

  initStudentForm() {
    this.studentForm = this.fb.group({
      studentName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      ageGroup: ['', Validators.required],
      details: this.fb.group({
        class: ['', Validators.required],
        school: ['', Validators.required],
        parentsName: ['', Validators.required],
        contactNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]
      })
    });
  }
  startAssessment(student_id: string) {
    this.router.navigate([`assessment/${student_id}`]);
  }

  viewAssessment(assessmentId: string) {
    this.assessmentService.isAssessmentPaid(assessmentId).subscribe((response) => {
      if (response.isPaid) {
        this.router.navigate([`assessment/thank-you/${assessmentId}`]);
      } else {
        this.router.navigate([`assessment/sample-report/${assessmentId}`]);
      }
    });
  }

  addStudent() {
    console.log(this.studentForm.value)
    const addStudentsModel: AddStudentsModel = {
      userId: this.userId, // Replace with actual username
      students: [this.studentForm.value]
    };
    this.assessmentService.addStudent(addStudentsModel).subscribe(() => {
      this.showAddStudent = false;
      this.showTable = true;
      this.studentForm.reset(); 
      this.ngOnInit(); // Refresh the student list
    });
  }
}