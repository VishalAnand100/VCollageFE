import { Component, OnInit } from '@angular/core';
import { AssessmentService, StudentDto } from '@ss/assessment';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  studentId!: string;
  studentForm!: FormGroup;
  selectedFile: File | null = null;
profileImageSafeUrl!: SafeUrl;

  constructor(
    private route: ActivatedRoute,
    private assessmentService: AssessmentService,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

 ngOnInit(): void {
  this.initForm();

  this.studentId = this.route.snapshot.paramMap.get('id') ?? '';

  if (this.studentId) {
    this.assessmentService.getStudentByStudentId(this.studentId).subscribe({
      next: (data) => {
        // Patch the form with the student data
        this.studentForm.patchValue(data);

        // Safely access the image path AFTER form is patched
      const imageBase64 = data.details?.profileImagePath;
console.log('Image Base64 directly from data:', imageBase64);


        // Sanitize the URL to safely display it in the template
        if (imageBase64) {
          this.profileImageSafeUrl = this.sanitizer.bypassSecurityTrustUrl(imageBase64);
          console.log('Profile Image Safe URL:', this.profileImageSafeUrl);
        }
        else {
  this.profileImageSafeUrl = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  console.log('Default image used.');
}
      },
      error: (err) => {
        console.error('Error fetching student data:', err);
      }
    });
  }
}

onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  initForm() {
    this.studentForm = this.fb.group({
  studentName: [''],
      emailAddress: [{ value: '', disabled: true }],
      ageGroup: [{ value: '', disabled: true }],
      studentCode: [{ value: '', disabled: true }],
      details: this.fb.group({
        parentsName: [''],
        contactNumber: [''],
        class: [''],
        school: [''],
        findUs: [''],
      profileImagePath: [''],  // ✅ This must exist
      }),
    });
  }

  

onSubmit() {
  if (this.studentForm.valid) {
    const profile: StudentDto = this.studentForm.getRawValue(); // ✅ includes disabled values

    this.assessmentService.updateStudentAssessment(this.selectedFile, profile).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully.' });
        console.log('Response:', res);

        // Optional: reload
        setTimeout(() => {
          window.location.reload();
        }, 10);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update profile.' });
        console.error('Update Error:', err);
      }
    });
  }
}



}
