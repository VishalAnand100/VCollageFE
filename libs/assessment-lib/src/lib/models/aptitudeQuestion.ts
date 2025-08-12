import { OptionStructure } from './optionStructure';


export interface AptitudeQuestion { 
    tags?: { [key: string]: string; } | null;
    options?: Array<OptionStructure> | null;
    questionText: string | null;
    id?: string;
}

