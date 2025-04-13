// @ts-nocheck
import {
  DashboardExpenseData,
  DashboardInvoiceData,
  DashboardRevenueData,
  DashboardDividendData,
  DashboardAnnualFinancials,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const useGetDashboardInvoiceData = (
  filter_type: string,
  start_date?: Date,
  end_date?: Date
) => {
  const { user, isAuthenticated } = useAuth();

  const getDashboardInvData = async () => {
    const params = new URLSearchParams({
      userId: user?.id || "",
      filterType: filter_type,
      ...(start_date && { startDate: start_date.toISOString() }),
      ...(end_date && { endDate: end_date.toISOString() }),
    });

    const response = await fetch(`/api/dashboard/invoice?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard invoice data");
    }
    return response.json();
  };

  return useQuery<DashboardInvoiceData>({
    queryKey: ["dashboard-invoice-data", user?.id, filter_type],
    queryFn: getDashboardInvData,
    enabled: !!user?.id && isAuthenticated,
  });
};

const useGetDashboardExpenseData = (
  filter_type: string,
  start_date?: Date,
  end_date?: Date
) => {
  const { user, isAuthenticated } = useAuth();

  const getDashboardExpData = async () => {
    const params = new URLSearchParams({
      userId: user?.id || "",
      filterType: filter_type,
      ...(start_date && { startDate: start_date.toISOString() }),
      ...(end_date && { endDate: end_date.toISOString() }),
    });

    const response = await fetch(`/api/dashboard/expense?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard expense data");
    }
    return response.json();
  };

  return useQuery<DashboardExpenseData>({
    queryKey: ["dashboard-expense-data", user?.id, filter_type],
    queryFn: getDashboardExpData,
    enabled: !!user?.id && isAuthenticated,
  });
};

const useGetDashboardRevenueData = (
  filter_type: string,
  start_date?: Date,
  end_date?: Date
) => {
  const { user, isAuthenticated } = useAuth();

  const getDashboardRevData = async () => {
    const params = new URLSearchParams({
      userId: user?.id || "",
      filterType: filter_type,
      ...(start_date && { startDate: start_date.toISOString() }),
      ...(end_date && { endDate: end_date.toISOString() }),
    });

    const response = await fetch(`/api/dashboard/revenue?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard revenue data");
    }
    return response.json();
  };

  return useQuery<DashboardRevenueData>({
    queryKey: ["dashboard-revenue-data", user?.id, filter_type],
    queryFn: getDashboardRevData,
    enabled: !!user?.id && isAuthenticated,
  });
};

const useGetDashboardDividendData = (
  filter_type: string,
  start_date?: Date,
  end_date?: Date
) => {
  const { user, isAuthenticated } = useAuth();

  const getDashboardDivData = async () => {
    const params = new URLSearchParams({
      userId: user?.id || "",
      filterType: filter_type,
      ...(start_date && { startDate: start_date.toISOString() }),
      ...(end_date && { endDate: end_date.toISOString() }),
    });

    const response = await fetch(`/api/dashboard/dividends?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard dividends data");
    }
    return response.json();
  };

  return useQuery<DashboardDividendData>({
    queryKey: ["dashboard-dividend-data", user?.id, filter_type],
    queryFn: getDashboardDivData,
    enabled: !!user?.id && isAuthenticated,
  });
};

const useGetDashboardAnnualFinancials = () => {
  const { user, isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  const getAnnualFinancials = async () => {
    const params = new URLSearchParams({
      userId: user?.id || "",
      year: currentYear.toString(),
    });

    const response = await fetch(`/api/dashboard/annual?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch annual financials");
    }
    return response.json();
  };

  return useQuery<DashboardAnnualFinancials>({
    queryKey: ["dashboard-annual-financials", user?.id, currentYear],
    queryFn: getAnnualFinancials,
    enabled: !!user?.id && isAuthenticated,
  });
};

export {
  useGetDashboardInvoiceData,
  useGetDashboardExpenseData,
  useGetDashboardRevenueData,
  useGetDashboardDividendData,
  useGetDashboardAnnualFinancials,
};
