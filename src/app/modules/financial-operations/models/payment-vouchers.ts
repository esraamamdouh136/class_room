import {JournalEntry} from './journal-entry';


export interface PaymentVouchers {
  id?: number;
  mother_company_id?: number;
  fiscal_year_id?: number;
  date?: string;
  payment_method_id?: number;
  receipt_method_id?: number;
  day?: number;
  month?: number;
  year?: number;
  details?: any[];
  fiscal_year_number?: number;
  monthly_year_number?: number;
  daily_number?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  journal_entry_id?: number;
  cost_center_id?: number;
  statement?: string;
  setting_show?: number;
  currency_id?: number;
  conversion_factor?: number;
  journal_entry?: JournalEntry;
  total_received?: number;
}

export interface PaymentVoucherDetails {
  key?: string;
  value?: number;
  tax_status?: string;
  statement?: string;
  account_guide_id?: number;
  tag?: string;
  attachments?: any[];
  attachment_paths?: any[];
  taxes?: any[];
  uploadedFiles?: any[];
  item_index?: number;
  colType?: string;
  total_invoice_value?: number;
  total_paid?: number;
  rest?: number;
  due_date?: string;
  invoice?: {
    id?: number;
    name?: string;
    rest?: number;
  };
  father?: {
    id?: number;
    name?: string;
  };
  student?: {
    id?: number;
    name?: string;
  };
  account_guide?: {
    id?: number;
    title?: string;
    code?: number;
  };
  father_id?: number;
  parent_key?: string;
  student_id?: number;
  invoice_id?: number;
  autoValue?: boolean;
}
