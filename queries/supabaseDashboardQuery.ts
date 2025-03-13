// import { createClient } from "@/utils/supabase/client";
// import {
//   DashboardInvoiceData,
//   DashboardExpenseData,
//   DashboardRevenueData,
//   DashboardDividendData,
//   DashboardAnnualFinancials,
// } from "@/types";

// // Dashboard Invoice Data
// export const fetchDashboardInvoiceData = async (
//   userId: string,
//   filterType: string,
//   startDate?: Date,
//   endDate?: Date
// ) => {
//   const supabase = createClient();

//   try {
//     const { data, error } = await supabase.rpc("get_dashboard_data", {
//       filter_type: filterType?.startsWith("custom") ? "custom" : filterType,
//       company: userId,
//       ...(startDate ? { start_date: startDate?.toISOString() } : {}),
//       ...(endDate ? { end_date: endDate?.toISOString() } : {}),
//     });

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error fetching dashboard invoice data:", error);
//     return null;
//   }
// };

// // Dashboard Expense Data
// export const fetchDashboardExpenseData = async (
//   userId: string,
//   filterType: string,
//   startDate?: Date,
//   endDate?: Date
// ) => {
//   const supabase = createClient();

//   try {
//     const { data, error } = await supabase.rpc("get_dashboard_data_expenses1", {
//       filter_type: filterType?.startsWith("custom") ? "custom" : filterType,
//       company: userId,
//       ...(startDate ? { start_date: startDate?.toISOString() } : {}),
//       ...(endDate ? { end_date: endDate?.toISOString() } : {}),
//     });

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error fetching dashboard expense data:", error);
//     return null;
//   }
// };

// // Dashboard Revenue Data
// export const fetchDashboardRevenueData = async (
//   userId: string,
//   filterType: string,
//   startDate?: Date,
//   endDate?: Date
// ) => {
//   const supabase = createClient();

//   try {
//     const { data, error } = await supabase.rpc("get_dashboard_data_revenue", {
//       filter_type: filterType?.startsWith("custom") ? "custom" : filterType,
//       company: userId,
//       ...(startDate ? { start_date: startDate?.toISOString() } : {}),
//       ...(endDate ? { end_date: endDate?.toISOString() } : {}),
//     });

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error fetching dashboard revenue data:", error);
//     return null;
//   }
// };

// // Dashboard Dividend Data
// export const fetchDashboardDividendData = async (
//   userId: string,
//   filterType: string,
//   startDate?: Date,
//   endDate?: Date
// ) => {
//   const supabase = createClient();

//   try {
//     const { data, error } = await supabase.rpc("get_dashboard_data_dividends", {
//       filter_type: filterType?.startsWith("custom") ? "custom" : filterType,
//       company: userId,
//       ...(startDate ? { start_date: startDate?.toISOString() } : {}),
//       ...(endDate ? { end_date: endDate?.toISOString() } : {}),
//     });

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error fetching dashboard dividend data:", error);
//     return null;
//   }
// };

// // Dashboard Annual Financials
// export const fetchDashboardAnnualFinancials = async (userId: string) => {
//   const supabase = createClient();

//   try {
//     const { data, error } = await supabase.rpc("get_annual_financials", {
//       company: userId,
//       year: new Date().getFullYear(),
//     });

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error fetching annual financials:", error);
//     return null;
//   }
// };
