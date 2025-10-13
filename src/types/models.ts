export interface ApiEntity {
    id: number;
    name: string;
    active: boolean;
}

export interface Training extends ApiEntity {
    durationMinutes: number;
    durationHours: number;
    description: string;
    duration: string;
    maxParticipants: number;
}

export interface Site extends ApiEntity {
    type: string;
    address: string;
    opening: string;
    closing: string;
    capacity: number;
}

export interface Membership extends ApiEntity {
    duration: number;
    sessionPersonalized: number;
    sessionGroup: number;
    price: number;
}