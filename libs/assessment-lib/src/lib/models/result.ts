import { StudentDto } from './studentDto';

export interface Result {
  psychometricScore: ScoreCategory;
  aptitudeScore: ScoreCategory;
  adversityScore: ScoreCategory;
  seiScore: ScoreCategory;
  interestAndPreferenceScore: ScoreCategory;
}

export interface ScoreCategory {
  questionType: string;
  displayText: string;
  description: string;
  categoryWiseScore: {
    [key: string]: CategoryScore;
  };
}

export interface CategoryScore {
  categoryName: string;
  categoryDisplayText: string;
  categoryLetter: string;
  categoryScore: number;
  categoryPercentage: number;
  categoryScoreLevel: string;
  categoryInterpretation: string;
}
export interface DetailedAdversityScore extends ScoreCategory {
  resultInterpretation: string;
  aqScore: number;
  aqLevel: string;
}

export interface DetailedAptitudeScore extends ScoreCategory {
  resultInterpretation: string;
}

export interface DetailedInterestAndPreferenceScore extends ScoreCategory {
  resultInterpretation: string;
}

export interface DetailedPsychometricScore extends ScoreCategory {
  resultInterpretation: string;
}

export interface DetailedSeiScore extends ScoreCategory {
  resultInterpretation: string;
}

export interface DetailAssessmentResult {
  detailedPsychometricScore: DetailedPsychometricScore;
  aptitudeScore: DetailedAptitudeScore;
  adversityScore: DetailedAdversityScore;
  seiScore: DetailedSeiScore;
  interestAndPreferenceScore: DetailedInterestAndPreferenceScore;
  student?: StudentDto;
  assessmentDate?: Date;
  careerMapping?: CareerMapping;
}

export interface CareerMapping {
  ruleName: string;
  idealCareer: string;
  topLine: string;
  riasecMappingReasoning: [];
  datMappingReasoning: [];
  oceanMappingReasoning: [];
  clubToJoin: string;
  tagLine: string;
  idealFor: string;
}

export const VerbalCategoryType = 'verbal';
export const NumericalCategoryType = 'numerical';
export const AbstractCategoryType = 'abstract';
export const SpeedAndAccuracyCategoryType = 'speed and accuracy';
export const MechanicalCategoryType = 'mechanical';
export const SpaceRelationsCategoryType = 'space relations';
export const SpellingsCategoryType = 'spellings';
export const LanguageUsageAndGrammarCategoryType = 'language usage and grammar';
