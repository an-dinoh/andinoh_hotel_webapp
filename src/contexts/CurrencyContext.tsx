"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Currency } from '@/types/hotel.types';
import { currencyService } from '@/services/currency.service';

interface CurrencyContextType {
    currencies: Currency[];
    activeCurrency: Currency | null;
    isLoading: boolean;
    setCurrency: (currencyCode: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const DEFAULT_CURRENCIES: Currency[] = [
    { id: '1', code: 'NGN', name: 'Nigerian Naira', symbol: '₦', is_active: true, rate: '1.00' },
    { id: '2', code: 'USD', name: 'US Dollar', symbol: '$', is_active: true, rate: '1.00' },
    { id: '3', code: 'EUR', name: 'Euro', symbol: '€', is_active: true, rate: '1.00' },
    { id: '4', code: 'GBP', name: 'British Pound', symbol: '£', is_active: true, rate: '1.00' },
];

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [activeCurrency, setActiveCurrency] = useState<Currency | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initCurrency = async () => {
            try {
                const response = await currencyService.getCurrencies();
                const availableCurrencies = response.results || [];

                if (availableCurrencies.length > 0) {
                    setCurrencies(availableCurrencies);
                    setupActiveCurrency(availableCurrencies);
                } else {
                    setCurrencies(DEFAULT_CURRENCIES);
                    setupActiveCurrency(DEFAULT_CURRENCIES);
                }
            } catch (error) {
                console.error('Failed to initialize currency, using fallbacks:', error);
                setCurrencies(DEFAULT_CURRENCIES);
                setupActiveCurrency(DEFAULT_CURRENCIES);
            } finally {
                setIsLoading(false);
            }
        };

        const setupActiveCurrency = (availableCurrencies: Currency[]) => {
            const storedCurrencyCode = localStorage.getItem('user_currency');
            if (storedCurrencyCode && availableCurrencies.length > 0) {
                const found = availableCurrencies.find(c => c.code === storedCurrencyCode);
                if (found) {
                    setActiveCurrency(found);
                } else {
                    setActiveCurrency(availableCurrencies[0] || null);
                }
            } else if (availableCurrencies.length > 0) {
                // Default to NGN if available, else first one
                const defaultCurrency = availableCurrencies.find(c => c.code === 'NGN') || availableCurrencies[0];
                setActiveCurrency(defaultCurrency || null);
                if (defaultCurrency) {
                    localStorage.setItem('user_currency', defaultCurrency.code);
                }
            } else {
                setActiveCurrency(null);
            }
        };

        initCurrency();
    }, []);

    const setCurrency = (currencyCode: string) => {
        const found = currencies.find(c => c.code === currencyCode);
        if (found) {
            setActiveCurrency(found);
            localStorage.setItem('user_currency', found.code);
            // Reload page to ensure all components and API interceptor use the new currency
            window.location.reload();
        }
    };

    return (
        <CurrencyContext.Provider value={{ currencies, activeCurrency, isLoading, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
