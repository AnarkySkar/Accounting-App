// import { createClient } from "@/utils/supabase/client";

// // Revenue fetch function
// export const fetchRevenue = async (userId: string) => {
//   const supabase = createClient();

//   try {
//     const { data, error } = await supabase
//       .from("revenue")
//       .select()
//       .eq("company_id", userId);

//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error("Error fetching revenue:", error);
//     return [];
//   }
// };

// // Expenses fetch function
// export const fetchExpenses = async (userId: string) => {
//   const supabase = createClient();

//   try {
//     const { data, error } = await supabase
//       .from("expenses")
//       .select()
//       .eq("company_id", userId);

//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error("Error fetching expenses:", error);
//     return [];
//   }
// };

// // Invoices fetch function
// export const fetchInvoices = async (userId: string) => {
//   const supabase = createClient();

//   try {
//     const { data, error } = await supabase
//       .from("invoices")
//       .select()
//       .eq("company_id", userId);

//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error("Error fetching invoices:", error);
//     return [];
//   }
// };

// // Dividends fetch function
// export const fetchDividends = async (userId: string) => {
//   const supabase = createClient();

//   try {
//     const { data, error } = await supabase
//       .from("dividends")
//       .select("*")
//       .eq("company_id", userId);
//     if (error) {
//       console.log(error);
//       throw error;
//     }
//     return data || [];
//   } catch (error) {
//     console.error("Error fetching dividends:", error);
//     return [];
//   }
// };
