"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount: number | null) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

const exchangeRates = {
  USD: 1,
  EUR: 1,
  GBP: 1,
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const storedCurrency = localStorage.getItem("currency");
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
  }, []);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-";

    const rate = exchangeRates[currency as keyof typeof exchangeRates];
    const convertedAmount = amount * rate;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleCurrencyChange,
        formatCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
