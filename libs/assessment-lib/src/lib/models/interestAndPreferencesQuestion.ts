
import { OptionStructure } from './optionStructure';


export interface InterestAndPreferencesQuestion { 
    tags?: { [key: string]: string; } | null;
    options?: Array<OptionStructure> | null;
    questionText: string | null;
    id?: string;
}

