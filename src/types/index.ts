export interface User {
    email: string;
    password: string;
    active: boolean;
    role: 'ADMIN' | 'CLIENT' | 'EMPLOYEE';
}