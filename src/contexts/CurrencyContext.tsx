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

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [activeCurrency, setActiveCurrency] = useState<Currency | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initCurrency = async () => {
            try {
                const availableCurrencies = await currencyService.getCurrencies();
                setCurrencies(availableCurrencies);

                const storedCurrencyCode = localStorage.getItem('user_currency');
                if (storedCurrencyCode) {
                    const found = availableCurrencies.find(c => c.code === storedCurrencyCode);
                    if (found) {
                        setActiveCurrency(found);
                    } else {
                        setActiveCurrency(availableCurrencies[0] || null);
                    }
                } else {
                    // Default to NGN if available, else first one
                    const defaultCurrency = availableCurrencies.find(c => c.code === 'NGN') || availableCurrencies[0];
                    setActiveCurrency(defaultCurrency || null);
                    if (defaultCurrency) {
                        localStorage.setItem('user_currency', defaultCurrency.code);
                    }
                }
            } catch (error) {
                console.error('Failed to initialize currency:', error);
            } finally {
                setIsLoading(false);
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
