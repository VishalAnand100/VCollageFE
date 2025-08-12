import { OptionStructureDto } from './optionStructureDto';


export interface AptitudeQuestionDto { 
    options?: Array<OptionStructureDto> | null;
    tags?: { [key: string]: string; } | null;
    questionText?: string | null;
    id?: string | null;
    correctOption?: string | null;
    pictureData?: string | null; 

}

