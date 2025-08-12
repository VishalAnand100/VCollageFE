
import { OptionStructureDto } from './optionStructureDto';
import { SeiOptionsType } from './seiOptionsType';


export interface SeiQuestionDto { 
    options?: Array<OptionStructureDto> | null;
    tags?: { [key: string]: string; } | null;
    questionText?: string | null;
    id?: string | null;
    seiOptionsType?: SeiOptionsType;
}

