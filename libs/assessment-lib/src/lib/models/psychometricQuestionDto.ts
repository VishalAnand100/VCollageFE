
import { OptionStructureDto } from './optionStructureDto';


export interface PsychometricQuestionDto { 
    options?: Array<OptionStructureDto> | null;
    tags?: { [key: string]: string; } | null;
    questionText?: string | null;
    id?: string | null;
}

