import { JournalEntries } from '../../../../shared/model/global';

export interface Taxes {
    id?: number;
    cost_center_id?: number;
    mother_company_id?: number;
    name_ar?: string;
    name_en?: string;
    percentage?: string;
    status?: number;
    updated_at?: string;
    created_at?: string;
    taxLinkedAccount?: TaxLinkedAccount[];
    fees_classes?: number[];
    cost_center?: {
        id?: number;
        name?: string;
    };
    countries?: Country[] | number[];
    taxFreeNationality?: number[];
    feesClassesValues?: number[];
    status_c?: boolean;
    tax_linked_account?: JournalEntries[];
}

export interface Country {
    id?: number;
    title?: string;
}


export interface TaxLinkedAccount {
    tax_id?: number;
    account_guid_id?: number;
    type?: string;
    journal_parameter_id?: number;
    percentage?: number;
}
