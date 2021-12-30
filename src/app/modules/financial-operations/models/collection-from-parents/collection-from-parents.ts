import {FiscalYear} from '../../../financial-setting/models/fiscalYears/fiscalYear';

export interface Student {
  id?: number;
  name?: string;
  full_name?: string;
  parent?: {
    id?: number;
    name?: string
  };
}

export interface Invoice {
  id?: number;
  name?: string;
  due_date?: string;
  value?: number;
  paid?: number;
  amount?: number;
  father_id?: number;
  student_id?: number;
  rest?: number;
  father?: {
    id?: number;
    name?: string;
  };
  student?: {
    id?: number;
    name?: string;
  };
}


export interface Ledger {
  prev?: {
    credit?: number;
    debit?: number
  };
  total_credit?: number;
  total_debit?: number;
  items?: LedgerDetails[];
}

export interface LedgerDetails {
  journal_module_id?: number;
  account_guide_id?: number;
  father_id?: number;
  student_id?: number;
  statement?: string;
  credit?: number;
  debit?: number;
  currency_id?: number;
  conversion_factor?: number;
  cost_center_id?: number;
  cost_center_branch_id?: number;
  cost_center_region_id?: number;
  attachments?: string[];
  tag?: string;
  currency?: {
    id?: number;
    name?: string;
  };
  cost_center?: {
    id?: number;
    name?: string;
  };
  father?: {
    id?: number;
    name?: string;
  };
  student?: {
    id?: number;
    name?: string;
  };
  date?: string;
  journal_module?: {
    id?: number;
    name?: string;
  };
  fiscal_years?: FiscalYear;
}
