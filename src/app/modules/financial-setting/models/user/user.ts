export interface User {
    country: string,
    created_at: string,
    email: string,
    has_image: boolean,
    id: number,
    image: string,
    image_path: string,
    is_main: number,
    mobile: string,
    name: string,
    phone: string,
    status: number,
    system_account_code: string,
    system_account_roles: [
        {
            cost_centers: string,
            id: number,
            mother_company_id: number,
            title: string,
            pivot: {
                system_account_role_id: number,
                system_account_user_id: number,
            }
        }
    ]
    telegram_code: null,
    telegram_id: null,
    telegram_username: null,
    two_step_status: number,
    updated_at: string,
    username: string,
}