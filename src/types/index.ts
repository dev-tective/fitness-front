export interface User {
    id: number;
    email: string;
    password: string;
    active: boolean;
    role: 'ADMIN' | 'CLIENT' | 'EMPLOYEE';
}