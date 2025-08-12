import { QuestionSubmissionStructureDto } from './questionSubmissionStructureDto';

export interface AssessmentSubmissionDto extends AssessmentSubmissionBaseDto {
  questions: AssessmentQuestionDto[];
}

export interface AssessmentSubmissionBaseDto {
  id: string;
  studentId: string;
  questionSubmissions: QuestionSubmissionStructureDto[];
  startTime: Date;
  autoCompleted: boolean;
  isSubmitted: boolean;
  timeRemainingInSeconds?: number | null; // Assuming TimeSpan is represented as a string in ISO 8601 duration format
  aptitudeSubmitted: boolean;
  personalitySubmitted: boolean;
  currentSection: string;
  flaggedQuestions: string[]; // Assuming Guid is represented as a string
  aptitudeStarted: boolean;
  personalityStarted: boolean;
}

export interface AssessmentQuestionDto {
  id: string;
  questionType: string;
  tags?: { [key: string]: string } | null;
  questionText: string;
  questionCategory: string;
  displayQuestionType: string;
}
