
import { StudentDetailDto } from './studentDetailDto';


export interface StudentDto { 
    id?: string;
    studentName: string | null;
    emailAddress: string | null;
    ageGroup: string | null;
    details: StudentDetailDto;
    isDeleted: boolean|null;
    studentCode?: string|null;
    state?: string | null;
    city?: string | null;
    stream?: string | null;
    branch?: string | null;
}

export interface LoginResponseDto{
    token: string;
    students: StudentDto[];
    userId: number;
    email: string;
}

export interface StudentAssessmentDetailDto{
    student: StudentDto;
    assessmentDateTime: string;
    assessmentId: string;
    isSubmitted: boolean;
}
