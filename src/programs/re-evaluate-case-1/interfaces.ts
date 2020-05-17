
export interface CaseOneEntry {
  id: string;
  reference_id: string;
  registrant_id: string;
  name: string;
}

export interface CaseOneSet {
  [key: string]: CaseOneEntry[];
}

export interface InvestigatedCaseOneSet {
  messages: string[];
  reference_id: string;
  set: CaseOneEntry[];
}

export enum InvestigationResult {
  CaseOne = "Case 1 - used by people with different names",
  CaseTwo = "Case 2 -  used by people with the same name"
}
