// Invoice related types

import { Database, Tables } from "./supabase";

type Invoice = Tables<"invoices">;

type Company = Tables<"companies">;

type Expenses = Tables<"expenses">;

type GenInvoices = Tables<"gen-invoices">;

type Revenue = Tables<"revenue">;

type Dividend = Tables<"dividends">;

type Assets = Tables<"assets">;

type CreateInvoiceBody = {
  title: string;
  amount: number;
  status: string;
  date: Date;
  file: File;
};

type BarChartData = {
  date_group: string;
  total_amount: number;
};

type DashboardInvoiceData = {
  bar_chart_data: BarChartData[];
  invoice_generated: number;
  invoice_uploaded: number;
  total_invoice_amount: number;
  total_invoices: number;
  recent_invoices: Invoice[];
};

type DashboardExpenseData = {
  bar_chart_data: BarChartData[];
  expense_uploaded: number;
  total_expense_amount: number;
  total_expenses: number;
  recent_expenses: Expenses[];
  total_business_expense: number;
  total_personal_expense: number;
};

type DashboardRevenueData = {
  total_revenue: number;
  total_revenue_amount: number;
  total_business_income: number;
  total_personal_income: number;
  revenue_uploaded: number;
  recent_revenue: Revenue[];
  bar_chart_data: BarChartData[];
};

type DashboardDividendData = {
  total_dividends: number;
  total_amount: number;
  dividends_uploaded: number;
  recent_dividends: Dividend[];
  bar_chart_data: BarChartData[];
};

export type DashboardAnnualFinancials = {
  total_business_income: number;
  total_personal_income: number;
  total_business_expenses: number;
  total_personal_expenses: number;
  total_dividends: number;
  total_physical_assets: number;
  total_digital_assets: number;
  total_liquid_assets: number;
};

type SignInFormData = {
  email: string;
  password: string;
};

type SignUpFormData = {
  email: string;
  password: string;
  name: string;
  address: string;
};

export type {
  CreateInvoiceBody,
  Invoice,
  Company,
  Expenses,
  Dividend,
  Revenue,
  Assets,
  GenInvoices,
  DashboardInvoiceData,
  BarChartData,
  DashboardExpenseData,
  SignInFormData,
  SignUpFormData,
  DashboardRevenueData,
  DashboardDividendData,
};
