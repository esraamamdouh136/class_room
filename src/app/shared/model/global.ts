export interface TableColumns {
  name?: string;
  dataKey?: string;
  isSortable?: boolean;
}

export interface Nationality {
  id?: number;
  iso_code?: string;
  name?: string;
}

export interface GuideTree {
  title_ar?: string;
  title_en?: string;
  id?: number;
  title?: string;
  code?: number;
  all_children?: GuideTree[];
}

export interface ApiResponse {
  data?: any;
  length?: any;
  total?: any;
  message?: any;
  code?: any;
}

export enum TableActions {
  edit = 'edit',
  changeStatus = 'CHANGE_STATUS',
  delete = 'delete',
  isDefault = 'isDefault',
  show = 'visibility',
  download = 'download',
  more = 'more',
  printContract = 'print',
  contractInvoices = 'wallpaper',
  uploadModel = 'cloud_upload',
}

export interface JournalEntries {
  tax_id?: number;
  account_guide_id?: number | string;
  percentage?: number;
  statement?: string;
  type?: string;
  journal_parameter_id?: number;
  credit_parameter?: number;
  debit_parameter?: number;
  item_index?: number;
  journal_module_id?: number;
}

export interface Column {
  cell?: any;
  editor?: string;
  columnDef?: string;
  header?: string;
  width?: number;
  show?: boolean;
  required?: boolean;
  actions?: string[];
  editorParams?: {
    values?: any[];
    bindValue?: string;
    bindLabel?: string;
  };
}

export interface NavChange {
  text: string;
  costCenter: number;
  fiscalYear: number;
  companyId: number;
  companyNum: number;
  role: number;
  selectedCompany?: any;
}


export interface Currencies {
  name?: string;
  id?: number;
  name_symbol?: string;
  is_default?: number;
  rate?: number;
}

export const cellActionStyle = {
  color: '#1cced8',
  backgroundColor: '#d2f5f7',
  'font-size': '0.925rem',
  'line-height': '1.35',
  'border-radius': '0.42rem',
  'height': '30px',
  'width': '30px',
};

export const MoreActionStyle = {
  'min-width':' 30px',
  'height': '30px',
  'display': 'flex',
  'align-items' : ' center',
  'justify-content' :' center',
  backgroundColor : '#2288d3'
}

export const DeleteActionStyle = {
  ...cellActionStyle,
  backgroundColor: '#f2cad2',
  color: '#ea657f'
};


export interface GlobalAgTableColumns {
  headerName?: string,
  valueGetter?: string,
  cellRenderer?: string,
  cellClass?: string,
  cellRendererParams?: any,
  filter?: boolean,
  width?: number,
}


export interface Country {
  id?: number;
  iso_code?: string;
  name?: string;
}

export interface Role {
  id?: number;
  title?: string;
}

export interface Language {
  id?: number;
  title?: string;
}

export interface DateFormate {
  key?: string;
  value?: string;
}

export interface MotherCompanies {
  accrual_basis?: string;
  address_street?: string;
  city?: string;
  country_id?: number;
  created_at?: string;
  date_format?: string;
  fax?: any;
  has_image?: boolean;
  id?: number;
  image?: any;
  image_path?: string;
  journal_method?: string;
  language_id?: number;
  main_account_data?: {
    email: string;
    id: number;
    mobile: string;
    name: string;
  };
  mobile?: any;
  name?: string;
  number?: number;
  phone?: string;
  sp_number?: string;
  status?: number;
  system_account_id?: number;
  tax_number?: string;
  updated_at?: string;
  website?: string;
  zone?: string;
}

/** Global lists */

export interface Areas {
  id: number;
  name: string;
}

export interface Zones {
  key: string;
}

export interface CostCenter {
  cost_center_branch_id?: number;
  cost_center_region_id?: number;
  id?: number;
  name?: string;
}

export interface Tax {
  id?: number;
  name?: string;
  percentage?: number;
}

export interface Branches {
  id: number;
  name: string;
}

export interface Father {
  id: number;
  name: string;
}

export enum SecurityTypesStatus {
  twoStep = 1,
  sms = 2,
  email = 3,
}

export interface MenuItems {
  id?: number;
  name?: string;
  css_class?: string;
  color?: string;
  slug?: string;
  image?: string;
  children?: MenuItems[];
}
