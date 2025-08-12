import { StudentDto } from "./studentDto";

export interface RegisterModel {
    username: string;
    password: string;
    email: string;
    students: StudentDto[];
    referralId?: string; // Optional field  

  }