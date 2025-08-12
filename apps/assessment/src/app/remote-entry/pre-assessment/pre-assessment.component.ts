import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { AssessmentService } from '@ss/assessment';
import { StudentDto } from '@ss/assessment';
export interface StudentViewModel {
  id?: string;
  studentName: string | null;
  emailAddress: string | null;
  ageGroup: string | null;
  isDeleted: boolean | null;
  studentCode?: string | null;
  state?: string | null;
  city?: string | null;
  parentsName?: string | null;
  contactNumber?: string | null;
  class?: string | null;
  school?: string | null;
  address?: string | null;
}
@Component({
  selector: 'app-pre-assessment',
  templateUrl: './pre-assessment.component.html',
  styleUrls: ['./pre-assessment.component.scss'],
})
export class PreAssessmentComponent implements OnInit {
  @Input()
  student_id!: string | undefined;
  @Output() formSubmitted = new EventEmitter<any>();

  studentDto!: StudentDto;

  constructor(private assessmentService: AssessmentService) {}

  ngOnInit(): void {
    if (!this.student_id) {
      console.error('Student ID is required');
      return;
    }

    this.assessmentService
      .getStudentById(this.student_id)
      .subscribe({
        next: (student: StudentDto) => {
          this.studentDto = student;
          this.formSubmitted.emit(student);
        },
        error: (error) => {
          console.error('Error fetching student data:', error);
        }
      });
  }
}
