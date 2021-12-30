export interface END_POINTS_INTERFACE {
    code?: number;
    message?: string;
    paginate?: {
        data?: []
        current_page?: number;
        per_page?: number;
        to?: number;
        from?: number;
        total?: number;
    }
}