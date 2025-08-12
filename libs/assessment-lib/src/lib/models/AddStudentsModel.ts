import { StudentDto } from "./studentDto";

export interface AddStudentsModel {
    userId: number;
    students: StudentDto[];
  }