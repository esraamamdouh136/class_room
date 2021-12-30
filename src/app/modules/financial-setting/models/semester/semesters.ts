export interface Semesters {
    id?: number;
    name_ar?: string;
    name_en?: string;
    status?: number;
    start_at?: string;
    end_at?: string;
    status_c?: boolean;
}

export interface TransferStudents {
    class?: number;
    from_school_id?: number;
    students?: number[];
    to_school_id?: number;
}

