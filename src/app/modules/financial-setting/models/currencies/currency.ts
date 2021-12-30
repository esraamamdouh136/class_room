export interface Currency {
    created_at?: string;
    currency_symbol_ar?: string;
    currency_symbol_en?: string;
    fiscal_year?: {
        end_hijry_at: string;
        id: number;
        name: string;
        start_hijry_at: string;
    };
    fiscal_year_id?: number;
    mother_company?: {
        has_image: boolean;
        id: number;
        image_path: string;
        name: string;
    };
    id?: number;
    is_default?: number;
    mother_company_id?: number;
    name_ar?: string;
    name_en?: string;
    rate?: number;
    status?: number;
    updated_at?: string;
    isDefault?: boolean;
    statusView?: string;
    sequence?: number;
}