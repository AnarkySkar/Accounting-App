"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
// Define available currencies
const currencies = [
  { code: "USD", label: "USD 🇺🇸", rate: 1 },
  { code: "EUR", label: "EUR 🇪🇺", rate: 0.92 }, // Example rate
  { code: "GBP", label: "GBP 🇬🇧", rate: 0.79 }, // Example rate
];

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    // Force a re-render of components using currency
    window.dispatchEvent(new Event("currency-changed"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          {currencies.find((curr) => curr.code === currency)?.label || "USD 🌍"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup
          value={currency}
          onValueChange={handleCurrencyChange}
        >
          {currencies.map(({ code, label }) => (
            <DropdownMenuRadioItem
              key={code}
              className="flex gap-2"
              value={code}
            >
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
