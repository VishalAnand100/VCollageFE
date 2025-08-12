import { OptionStructureDto } from './optionStructureDto';


export interface AdversityQuestionDto { 
    options?: Array<OptionStructureDto> | null;
    tags?: { [key: string]: string; } | null;
    questionText?: string | null;
    id?: string | null;
}

