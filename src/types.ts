export interface Company {
  companyId: string;
  email: string;
  state: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  companyName: string;
  address: string;
  latitude: number;
  longitude: number;
  industry: string;
}

export interface Filters {
  states: string[];
  industries: string[];
  searchTerm: string;
}

export interface AppState {
  companies: Company[];
  filteredCompanies: Company[];
  contactedCompanies: Set<string>;
  filters: Filters;
  selectedCompany: Company | null;
}

export const AUSTRALIAN_STATES = [
  'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'
] as const;

export const INDUSTRIES = [
  'Hospitality',
  'Tourism', 
  'Agriculture',
  'Retail',
  'Construction',
  'Transportation',
  'Entertainment',
  'Education',
  'Health & Wellness',
  'Marine Services',
  'Adventure Tourism',
  'Mining & Resources',
  'Sports & Recreation',
  'Food & Beverage',
  'Wildlife & Conservation',
  'Retail & Tourism'
] as const; 