export interface FamilyFile {
    id?: number;
    relative_id?: number;
    created_at?: string;
    father?: null;
    father_id?: number;
    home_image?: string;
    home_image_path?: string;
    lat?: number;
    lng?: number;
    mother?: null;
    mother_company_id?: number;
    mother_id?: number;
    parent_id?: number;
    relative?: null;
    relative_relation_id?: number;
    status?: boolean;
    students?: [];
    updated_at?: string;
    statusView?: string;
    fatherName?: string;
    matherName?: string;
    relativeName?: string;
    email?: string;
    childernLength?: number;
}
