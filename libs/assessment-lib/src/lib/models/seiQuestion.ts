
import { OptionStructure } from './optionStructure';
import { SeiOptionsType } from './seiOptionsType';


export interface SeiQuestion { 
    tags?: { [key: string]: string; } | null;
    options?: Array<OptionStructure> | null;
    questionText: string | null;
    id?: string;
    seiOptionsType: SeiOptionsType;
}

