import {PaymentVouchers} from './payment-vouchers';

export interface JournalModule {
  id?: number;
  name?: string;
}

export interface JournalEntry {
  id?: number;
  mother_company_id?: number;
  fiscal_year_id?: number;
  date?: string;
  day?: number;
  month?: number;
  year?: number;
  fiscal_year_number?: number;
  monthly_year_number?: number;
  daily_number?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  journal_module_id?: number;
  cost_center_id?: number;
  statement?: string;
  setting_show?: number;
  module?: {
    title?: string,
    data?: PaymentVouchers
  };
  currency_id?: number;
  conversion_factor?: number;
  journal_entry_details?: JournalEntryDetails[];
  journal_module?: {
    id?: number;
    name?: string;
  };
}

export interface JournalEntryDetails {
  journal_entry_id?: number;
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
  attachments?: any[];
  attachment_paths?: any[];
  tag?: string;
  item_index?: number;
  currency?: {
    id?: number;
    name?: string;
    rate: number
  };
  cost_center?: {
    id?: number;
    name?: string;
  };
  uploadedFiles?: any[];
  cost_center_branch?: {
    id?: number;
    name?: string;
  };
  cost_center_region?: {
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
}
