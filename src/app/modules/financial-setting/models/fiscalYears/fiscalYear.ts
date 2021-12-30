import {MotherCompanies} from 'src/app/shared/model/global';

export interface FiscalYear {
  end_at?: string;
  end_hijry_at?: string;
  id?: number;
  is_default?: number;
  journal_sequence?: string;
  mother_company?: MotherCompanies;
  mother_company_id?: 1;
  name_ar?: string;
  name_en?: string;
  start_at?: string;
  start_at_show?: string;
  end_at_show?: string;
  start_hijry_at?: string;
  status?: number;
  isDefault?: boolean;
  statusView?: string;
}
