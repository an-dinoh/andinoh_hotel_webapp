/*
import { apiClient } from '@/utils/api';
import { Airport } from '@/types/hotel.types';

class FlightService {
    async getAirports(query?: string, isMajor: boolean = false): Promise<Airport[]> {
        return apiClient.get<Airport[]>('flights/airports/', {
            params: {
                search: query,
                is_major: isMajor
            }
        });
    }
}

export const flightService = new FlightService();
*/
export {};

