
import { OptionStructure } from './optionStructure';


export interface PsychometricQuestion { 
    tags?: { [key: string]: string; } | null;
    options?: Array<OptionStructure> | null;
    questionText: string | null;
    id?: string;
}

