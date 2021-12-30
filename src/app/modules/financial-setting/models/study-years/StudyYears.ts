export interface SchoolData {
id?:number,
level?:number,
level_title?:string,
title?:string,
years? : Year[]
}
export interface Seasons {
id?:number,
title?:string,
}

export interface Year {
id?:number,
school_id?:number,
title?:string,
selected? : boolean,
seasons? : Seasons[],
end_date? : any
}
export interface GlobalDropDown {
    id: number,
    title: string
}
export interface Subject {
    id: number,
    title: string,
    grade: string,
    trans_template_subject_id: number,
}


export interface Seasons {
created_at?: string,
id?: number,
is_current?: string,
is_transfered?: string,
school_id?: number,
sort_order?: number,
title?: string,
updated_at?: string,
year_id?: number,
title_trans?: {en: string}
}