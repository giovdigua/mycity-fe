export interface UserPaginator {
    current_page: number;
    data: User[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url?: any;
    to: number;
    total: number;
}

export interface Link {
    url?: string;
    label: string;
    active: boolean;
}

export interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    fiscal_code: string;
    phone_number: string;
    date_of_birth: string;
    role: string;
}