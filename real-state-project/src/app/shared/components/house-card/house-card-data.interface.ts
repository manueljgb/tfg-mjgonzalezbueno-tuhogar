import { ApartmentStatus } from "./apartment-status.enum";

export interface HouseCardDataInterface {
    id: number;
    price: number;
    discount: number;
    type: string;
    ubication: string;
    square_metres: number;
    energy_efficiency: string;
    rooms: number;
    bathrooms: number;
    date_built: number;
    floors: number;
    extras: string[];
    status: ApartmentStatus;
    images: string[]
    // GPS:
    latitud: number;
    longitud: number;
}