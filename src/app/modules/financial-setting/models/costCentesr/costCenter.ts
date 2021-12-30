import { MotherCompanies } from "src/app/shared/model/global";

export interface CostCenter {
    cost_center_branch: {
        id: number;
        name: string;
    };
    cost_center_branch_id: number;
    cost_center_id: any;
    cost_center_region: {
        id: number;
        name: string;
    };
    cost_center_region_id: number;
    created_at: string;
    id: number;
    is_merged: any;
    mother_company: MotherCompanies;
    mother_company_id: number;
    name_ar: string;
    name_en: string;
    status: number;
    system_account_id: number;
    system_id: any;
    updated_at: string;
}