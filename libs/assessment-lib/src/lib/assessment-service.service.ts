import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import {
  AdversityQuestionDto,
  AptitudeQuestionDto,
  AssessmentSubmissionBaseDto,
  AssessmentSubmissionDto,
  CouponResponse,
  DetailAssessmentResult,
  FlagQuestionDto,
  InterestAndPreferencesQuestionDto,
  LoginResponseDto,
  PaymentOrder,
  PsychometricQuestionDto,
  QuestionSubmissionStructureDto,
  Result,
  SeiQuestionDto,
  StudentAssessmentDetailDto,
  StudentDto,
} from './models/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginModel } from './models/LoginModel';
import { AddStudentsModel } from './models/AddStudentsModel';
import { RegisterModel } from './models/RegisterModel';
import { AvailableSlotsResponse } from './models/counseling.model';
import { ScheduleRequestDto } from './models/schedule-request.dto';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  
  protected basePath = 'http://localhost:5165'; //vishal
  constructor(private httpClient: HttpClient) {
    this.goToQuestionType$.pipe(
      tap((x) => {
        console.log('here', x);
      })
    );
  }
  public goToQuestionType$ = new BehaviorSubject('');

  submitStudentDetailsPost(
    StudentDetailDto: StudentDto
  ): Observable<StudentDto> {
    return this.httpClient.post<StudentDto>(
      `${this.basePath}/api/student`,
      StudentDetailDto
    );
  }
getAvailableSlots(date: string): Observable<AvailableSlotsResponse> {
  const params = new HttpParams().set('date', date);
  return this.httpClient.get<AvailableSlotsResponse>(`${this.basePath}/api/CounselingSchedule/available-slots`, { params });
}

  assessmentStartOrResumeAssessmentPost(
    StudentDto: StudentDto
  ): Observable<AssessmentSubmissionDto> {
    StudentDto.studentCode = null;
    if (
      StudentDto.state &&
      typeof StudentDto.state === 'object' &&
      'name' in StudentDto.state
    ) {
      StudentDto.state = (StudentDto.state as any).name ?? ''; // Assign state.name or fallback to an empty string
    } else {
      StudentDto.state = ''; // Fallback for null or invalid state
    }
    return this.submitStudentDetailsPost(StudentDto).pipe(
      switchMap((sudentDto) =>
        this.httpClient.post<AssessmentSubmissionDto>(
          `${this.basePath}/api/Assessment/start-or-resume-assessment`,
          { studentId: sudentDto.id, ageGroup: StudentDto.ageGroup }
        )
      )
    );
  }

  resumeAssessmentPost(id: string): Observable<AssessmentSubmissionDto | null> {
    return this.httpClient.get<AssessmentSubmissionDto | null>(
      `${this.basePath}/api/Assessment/resume-assessment/${id}`
    );
  }

  getPsychometricQuestion(id: string): Observable<PsychometricQuestionDto> {
    return this.httpClient.get<PsychometricQuestionDto>(
      `${this.basePath}/api/questions/psychometric/${id}`
    );
  }

  getAptitudeQuestion(id: string): Observable<AptitudeQuestionDto> {
    return this.httpClient.get<AptitudeQuestionDto>(
      `${this.basePath}/api/questions/Aptitude/${id}`
    );
  }

  getAdversityQuestion(id: string): Observable<AdversityQuestionDto> {
    return this.httpClient.get<AdversityQuestionDto>(
      `${this.basePath}/api/questions/Adversity/${id}`
    );
  }

  getSeiQuestion(id: string): Observable<SeiQuestionDto> {
    return this.httpClient.get<SeiQuestionDto>(
      `${this.basePath}/api/questions/Sei/${id}`
    );
  }

  //  sendCounsellingSchedule(counsellingDate: string, userId: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('counsellingDate', counsellingDate)
  //     .set('userId', userId.toString());

  //   return this.httpClient.post(`${this.basePath}/api/Event/send-counselling-schedule`, {}, { params});
  //  }

sendCounsellingSchedule(dto: ScheduleRequestDto): Observable<any> {
  return this.httpClient.post(`${this.basePath}/api/Event/send-counselling-schedule`, dto);
}

  getInterestAndPreferencesQuestion(
    id: string
  ): Observable<InterestAndPreferencesQuestionDto> {
    return this.httpClient.get<InterestAndPreferencesQuestionDto>(
      `${this.basePath}/api/Questions/interest-and-preferences/${id}`
    );
  }

  questionSubmissionPost(
    questionSubmissionStructureDto: QuestionSubmissionStructureDto
  ) {
    if (!questionSubmissionStructureDto.selectedOptionId) {
      questionSubmissionStructureDto.selectedOptionId =
        '00000000-0000-0000-0000-000000000000';
    }
    this.httpClient
      .post(
        `${this.basePath}/api/Assessment/question-submission`,
        questionSubmissionStructureDto
      )
      .subscribe();
  }

  getAssessmentTimeRemaining(id: string): Observable<number> {
    return this.httpClient.get<number>(
      `${this.basePath}/api/Assessment/assessment-remaining-time/${id}`
    );
  }
  getAssessmentResult(id: string): Observable<Result> {
    return this.httpClient.get<Result>(
      `${this.basePath}/api/Assessment/assessment-result/${id}`
    );
  }

  submitAssessmentPost(
    assessmentSubmissionDto: AssessmentSubmissionDto,
    partial: boolean
  ) {
    assessmentSubmissionDto.questionSubmissions.forEach((x) => {
      if (!x.selectedOptionId)
        x.selectedOptionId = '00000000-0000-0000-0000-000000000000';
    });
    if (!partial) {
      return this.httpClient.post(
        `${this.basePath}/api/Assessment/assessment-submission`,
        {
          id: assessmentSubmissionDto.id,
          questionSubmissions: assessmentSubmissionDto.questionSubmissions,
          studentId: assessmentSubmissionDto.studentId,
        }
      );
    } else {
      return this.httpClient.post(
        `${this.basePath}/api/Assessment/assessment-submission`,
        {
          id: assessmentSubmissionDto.id,
          questionSubmissions: assessmentSubmissionDto.questionSubmissions,
          studentId: assessmentSubmissionDto.studentId,
        }
      );
    }
  }

  // Method to patch assessment submission
  updateAssessmentPost(
    patchDoc: AssessmentSubmissionBaseDto
  ): Observable<AssessmentSubmissionDto> {
    patchDoc.questionSubmissions.forEach((x) => {
      if (x.selectedOptionId === '') {
        x.selectedOptionId = '00000000-0000-0000-0000-000000000000';
      }
    });
    return this.httpClient.patch<AssessmentSubmissionDto>(
      `${this.basePath}/api/Assessment/assessment-submission/${patchDoc.id}`,
      patchDoc
    );
  }

  updateAssessmentTimerPost(id: string, time: number): Observable<void> {
    return this.httpClient.post<void>(
      `${this.basePath}/api/Assessment/update-timer/${id}`,
      { time }
    );
  }
  getDetailedReport(id: string): Observable<DetailAssessmentResult> {
    const url = `${this.basePath}/api/assessment/detailed-assessment-result/${id}`;
    return this.httpClient.get<DetailAssessmentResult>(url);
  }

  createOrder(
    studentId: string,
    couponCode: string,
    price: number,
  ): Observable<PaymentOrder> {
    const url = `${this.basePath}/api/payment/create-order`; // Update with your backend endpoint
    return this.httpClient.post<PaymentOrder>(url, {
      studentId,
      couponCode,
      price,
    });
  }

  verifyPayment(paymentDetails: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.basePath}/api/payment/verify-payment`,
      paymentDetails
    );
  }

  register(registerModel: RegisterModel): Observable<any> {
    return this.httpClient.post(
      `${this.basePath}/api/auth/register`,
      registerModel
    );
  }

  login(loginModel: LoginModel): Observable<LoginResponseDto> {
    return this.httpClient.post<LoginResponseDto>(
      `${this.basePath}/api/auth/login`,
      loginModel
    );
  }

  addStudent(addStudentsModel: AddStudentsModel): Observable<any> {
    return this.httpClient.post(
      `${this.basePath}/api/auth/add-students`,
      addStudentsModel
    );
  }

  verifyToken(token: string): Observable<any> {
    return this.httpClient.get(
      `${this.basePath}/api/auth/verify-token/${token}`
    );
  }

  getStudentsByUserId(id: number): Observable<StudentAssessmentDetailDto[]> {
    return this.httpClient.get<StudentAssessmentDetailDto[]>(
      `${this.basePath}/api/Student/user/${id}`
    );
  }

  getStudentById(student_id: string): Observable<StudentDto> {
    return this.httpClient.get<StudentDto>(
      `${this.basePath}/api/Student/${student_id}`
    );
  }

  isAssessmentPaid(assessmentId: string): Observable<{ isPaid: boolean }> {
    return this.httpClient.get<{ isPaid: boolean }>(
      `${this.basePath}/api/payment/is-assessment-paid/${assessmentId}`
    );
  }

  assessmentCompleteEventPost(id: string): Observable<void> {
    return this.httpClient.post<void>(
      `${this.basePath}/api/event/assessment-complete/${id}`,
      {}
    );
  }

  verifyCoupon(code: string): Observable<CouponResponse> {
    return this.httpClient.get<CouponResponse>(
      `${this.basePath}/api/payment/verify-coupon`,
      { params: { code } }
    );
  }

  getStudentAssessmentByAssessmentId(
    studentId: string
  ): Observable<StudentDto> {
    return this.httpClient.get<StudentDto>(
      `${this.basePath}/api/Student/assessment/${studentId}`
    );
  }

  getStudentByStudentId(
    studentId: string
  ): Observable<StudentDto> {
    return this.httpClient.get<StudentDto>(
      `${this.basePath}/api/Student/student/${studentId}`
    );
  }
updateStudentAssessment(image: File | null, profile: StudentDto): Observable<any> {
  const formData = new FormData();

  if (image) {
    formData.append('image', image);
  }

  // Flat fields
  formData.append('studentName', profile.studentName ?? '');
  formData.append('emailAddress', profile.emailAddress ?? '');
  formData.append('ageGroup', profile.ageGroup ?? '');

  if (profile.studentCode) formData.append('studentCode', profile.studentCode);
  if (profile.state) formData.append('state', profile.state);
  if (profile.city) formData.append('city', profile.city);
  if (profile.id) formData.append('id', profile.id);

  // Nested details
  const details = profile.details;
  formData.append('details.parentsName', details.parentsName ?? '');
  formData.append('details.contactNumber', details.contactNumber ?? '');
  formData.append('details.class', details.class ?? '');
  formData.append('details.school', details.school?? '');

  return this.httpClient.post(`${this.basePath}/api/Student/update-profile`, formData);
}


  getAllInterestAndPreferencesQuestions(): Observable<
    InterestAndPreferencesQuestionDto[]
  > {
    return this.httpClient.get<InterestAndPreferencesQuestionDto[]>(
      `${this.basePath}/api/Questions/getAll-interest-and-preferences`
    );
  }

  postFlagQuestion(flagQuestionDto: FlagQuestionDto): Observable<void> {
    return this.httpClient.post<void>(
      `${this.basePath}/api/assessment/flag-question`,
      flagQuestionDto
    );
  }


  sendOtp(email: string): Observable<any> {
    return this.httpClient.post(`${this.basePath}/api/auth/forgot-password`, { email });
  }

  // Verify OTP
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.httpClient.post(`${this.basePath}/api/auth/verify-otp`, { email, otp });
  }

  // Reset Password
  resetPassword(email: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.httpClient.post(`${this.basePath}/api/auth/reset-password`, { email, newPassword, confirmPassword });
  }

  postPaymentEvent(id: string | null) : Observable<void> {
    return this.httpClient.post<void>(`${this.basePath}/api/event/report-paid/${id}`, {});
  }

  generateReferralLink(userId: string): Observable<any> {
    return this.httpClient.get(`${this.basePath}/api/Invite/generate-link/${userId}`);
  }
  getTotalBonus(userId: string): Observable<{ totalBonus: number }> {
    return this.httpClient.get<{ totalBonus: number }>(`${this.basePath}/api/Invite/bonus/${userId}`);
  }
  redeemPoints(userId: string, amount: number): Observable<{ message: string, currentPoints: number }> {
    return this.httpClient.post<{ message: string, currentPoints: number }>(
      `${this.basePath}/api/Invite/redeem`,
      { userId, amount }
    );
  }
 sendPdfEmail(file: Blob, fileName: string, studentName: string, email: string): Observable<{ message: string }> {
  const formData = new FormData();
  formData.append('file', file, fileName);
  formData.append('studentName', studentName);
  formData.append('email', email);

  return this.httpClient.post<{ message: string }>(
    `${this.basePath}/api/Event/send-pdf-email`,
    formData
  );
}

getStudentDashboard(studentId: string): Observable<any> {
  return this.httpClient.get(`${this.basePath}/api/Student/studentdetail/${studentId}`);
}
getPaymentDetails(studentId: string): Observable<{
  isPaid: boolean;
  orderId: string;
  paymentId: string;
  planName: string;
  amount: number;
}> {
  return this.httpClient.get<{
    isPaid: boolean;
    orderId: string;
    paymentId: string;
    planName: string;
    amount: number;
  }>(`${this.basePath}/api/Payment/PaymentDetails/${studentId}`);
}
}



