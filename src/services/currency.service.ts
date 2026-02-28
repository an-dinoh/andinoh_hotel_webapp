import { apiClient } from '@/utils/api';
import { Currency, CurrencyConversionResponse, PaginatedResponse } from '@/types/hotel.types';

class CurrencyService {
    async getCurrencies(): Promise<PaginatedResponse<Currency>> {
        return apiClient.get<PaginatedResponse<Currency>>('shared/currencies/');
    }

    async detectCurrency(countryId: string): Promise<Currency> {
        return apiClient.get<Currency>('shared/currencies/detect/', {
            params: { country_id: countryId }
        });
    }

    async convertCurrency(from: string, to: string, amount: number): Promise<CurrencyConversionResponse> {
        return apiClient.get<CurrencyConversionResponse>('shared/currencies/convert/', {
            params: { from, to, amount }
        });
    }
}

export const currencyService = new CurrencyService();
