"use client";

import React, { useEffect, useState } from "react";

import { DateRange } from "react-day-picker";

import { DateRangePicker } from "@/components/DateRangePicker";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetDashboardAnnualFinancials,
  useGetDashboardDividendData,
  useGetDashboardExpenseData,
  useGetDashboardInvoiceData,
  useGetDashboardRevenueData,
} from "@/queries/dashboard";
import InvoiceDashboard from "@/components/dashboard/invoice-dshb";
import ExpenseDashboard from "@/components/dashboard/expense-dshb";
import { Loader } from "lucide-react";
import {
  DashboardAnnualFinancials,
  DashboardDividendData,
  DashboardExpenseData,
  DashboardInvoiceData,
  DashboardRevenueData,
} from "@/types";
import RevenueDashboard from "@/components/dashboard/revenue-dshb";
import DividendDashboard from "@/components/dashboard/dividends-dshb";
import { Skeleton } from "@/components/ui/skeleton";
import AnnualFinancialCard from "@/components/dashboard/annualFinancials-dshb";
import { useTranslation } from "react-i18next";
// import {
//   fetchDashboardInvoiceData,
//   fetchDashboardExpenseData,
//   fetchDashboardRevenueData,
//   fetchDashboardDividendData,
//   fetchDashboardAnnualFinancials,
// } from "@/queries/supabaseDashboardQuery";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const { t } = useTranslation(); // Uses default namespace "translation"
  const filters = [
    {
      label: t("dashboard.tabs.weekly"),
      value: "week",
    },
    {
      label: t("dashboard.tabs.monthly"),
      value: "month",
    },
    {
      label: t("dashboard.tabs.yearly"),
      value: "year",
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState("month");

  const [selectedRange, setSelectedRange] = React.useState<
    DateRange | undefined
  >(undefined);

  useEffect(() => {
    if (selectedRange?.from && selectedRange?.to) {
      setSelectedFilter(
        `custom-${Math.random()}-${selectedRange.to.toISOString()}`
      );
    }
  }, [selectedRange]);

  const { data: invoiceData, isLoading: invoiceLoading } =
    useGetDashboardInvoiceData(
      selectedFilter,
      selectedRange?.from,
      selectedRange?.to
    );

  // console.log("invoice data", invoiceData);

  const { data: expenseData, isLoading: expenseLoading } =
    useGetDashboardExpenseData(
      selectedFilter,
      selectedRange?.from,
      selectedRange?.to
    );

  // console.log("expense data", expenseData);

  const { data: revenueData, isLoading: revenueLoading } =
    useGetDashboardRevenueData(
      selectedFilter,
      selectedRange?.from,
      selectedRange?.to
    );
  // console.log("revenue data", revenueData);

  const { data: dividendData, isLoading: dividendLoading } =
    useGetDashboardDividendData(
      selectedFilter,
      selectedRange?.from,
      selectedRange?.to
    );
  // console.log("dividend data", dividendData);

  const { data: annualFinancialsData, isLoading: annualFinancialsLoading } =
    useGetDashboardAnnualFinancials();

  // console.log("annual financials data", annualFinancialsData);

  // const [invoiceData, setInvoiceData] = useState<DashboardInvoiceData | null>(
  //   null
  // );
  // const [expenseData, setExpenseData] = useState<DashboardExpenseData | null>(
  //   null
  // );
  // const [revenueData, setRevenueData] = useState<DashboardRevenueData | null>(
  //   null
  // );
  // const [dividendData, setDividendData] =
  //   useState<DashboardDividendData | null>(null);
  // const [annualData, setAnnualData] =
  //   useState<DashboardAnnualFinancials | null>(null);
  // const [isLoading, setIsLoading] = useState(false);

  // const { user } = useAuth();

  // useEffect(() => {
  //   const loadDashboardData = async () => {
  //     if (!user?.id) return;

  //     setIsLoading(true);
  //     try {
  //       const [invoice, expense, revenue, dividend, annual] = await Promise.all(
  //         [
  //           fetchDashboardInvoiceData(
  //             user.id,
  //             selectedFilter,
  //             selectedRange?.from,
  //             selectedRange?.to
  //           ),
  //           fetchDashboardExpenseData(
  //             user.id,
  //             selectedFilter,
  //             selectedRange?.from,
  //             selectedRange?.to
  //           ),
  //           fetchDashboardRevenueData(
  //             user.id,
  //             selectedFilter,
  //             selectedRange?.from,
  //             selectedRange?.to
  //           ),
  //           fetchDashboardDividendData(
  //             user.id,
  //             selectedFilter,
  //             selectedRange?.from,
  //             selectedRange?.to
  //           ),
  //           fetchDashboardAnnualFinancials(user.id),
  //         ]
  //       );

  //       setInvoiceData(invoice as unknown as DashboardInvoiceData);
  //       setExpenseData(expense as unknown as DashboardExpenseData);
  //       setRevenueData(revenue as unknown as DashboardRevenueData);
  //       setDividendData(dividend as unknown as DashboardDividendData);
  //       setAnnualData(annual as unknown as DashboardAnnualFinancials);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadDashboardData();
  // }, [user?.id, selectedFilter, selectedRange]);

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4">
        <div className="flex-col items-center justify-between space-y-2 md:flex md:flex-row">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("dashboard.title")}
          </h2>

          <div className="flex-col items-center space-y-2 md:flex md:flex-row md:space-x-2 md:space-y-0">
            <div className="flex items-center space-x-2">
              {filters.map((filter) => {
                return (
                  <Button
                    key={filter.value}
                    onClick={() => {
                      setSelectedFilter(filter.value);
                      setSelectedRange(undefined);
                    }}
                    variant={
                      selectedFilter === filter.value ? "default" : "outline"
                    }
                  >
                    {filter.label}
                  </Button>
                );
              })}
            </div>
            <DateRangePicker
              selectedRange={selectedRange}
              onChangeRange={setSelectedRange}
            />
            {/* <Button className="w-full">Download</Button> */}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {t("dashboard.annualCard.title")}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {t("dashboard.annualCard.description")}
          </p>

          {annualFinancialsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            annualFinancialsData && (
              <AnnualFinancialCard
                financialData={
                  annualFinancialsData as unknown as DashboardAnnualFinancials
                }
              />
            )
          )}
        </div>
        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">
              {t("dashboard.tabs.invoices")}
            </TabsTrigger>
            <TabsTrigger value="expenses">
              {t("dashboard.tabs.expenses")}
            </TabsTrigger>
            <TabsTrigger value="revenue">
              {t("dashboard.tabs.revenue")}
            </TabsTrigger>
            <TabsTrigger value="dividends">
              {t("dashboard.tabs.dividends")}
            </TabsTrigger>
          </TabsList>
          {invoiceLoading ||
          expenseLoading ||
          revenueLoading ||
          dividendLoading ? (
            <div className="w-full flex items-center justify-center">
              <Loader className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <>
              <TabsContent value="invoices" className="space-y-4">
                <InvoiceDashboard
                  data={invoiceData as unknown as DashboardInvoiceData}
                  selectedFilter={selectedFilter}
                />
              </TabsContent>
              <TabsContent value="expenses" className="space-y-4">
                <ExpenseDashboard
                  data={expenseData as unknown as DashboardExpenseData}
                  selectedFilter={selectedFilter}
                />
              </TabsContent>
              <TabsContent value="revenue" className="space-y-4">
                <RevenueDashboard
                  data={revenueData as unknown as DashboardRevenueData}
                  selectedFilter={selectedFilter}
                />
              </TabsContent>
              <TabsContent value="dividends" className="space-y-4">
                <DividendDashboard
                  data={dividendData as unknown as DashboardDividendData}
                  selectedFilter={selectedFilter}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
