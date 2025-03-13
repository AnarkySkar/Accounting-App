"use client";

import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";
import { useState, useEffect } from "react";
import { columns } from "@/components/revenue/columns";
import { DataTable } from "@/components/shared/data-table";

import { CreateExpense } from "@/components/expenses/create-expense";
import { Loader } from "lucide-react";
import { CreateDividends } from "@/components/dividends/create-dividends";
import { CreateRevenue } from "@/components/revenue/create-revenue";
// import { fetchRevenue } from "@/queries/supabaseQuery";
import DynamicComment from "@/components/shared/DynamicComment";
import { useAuth } from "@/context/AuthContext";
import { Revenue } from "@/types";
import { useGetRevenue } from "@/queries/revenue";
export default function RevenuePage() {
  const { data: revenueData, isLoading } = useGetRevenue();
  // const [revenueData, setRevenueData] = useState<Revenue[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const { user } = useAuth();
  // const [error, setError] = useState<string | null>(null);
  // useEffect(() => {
  //   const fetchRevenue = async () => {
  //     if (!user?.id) return;
  //     setIsLoading(true);

  //     try {
  //       const response = await fetch(`/api/revenue?userId=${user.id}`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch revenue");
  //       }
  //       const data = await response.json();
  //       setRevenueData(data);
  //     } catch (err) {
  //       setError(
  //         err instanceof Error ? err.message : "An unknown error occurred"
  //       );
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchRevenue();
  // }, [user?.id]);
  // const { user } = useAuth();
  // const [data, setData] = useState<Revenue[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const user = { id: "456ca6ae-8f3a-4e8d-9799-c997dd1d1ff7" };

  // useEffect(() => {
  //   const loadRevenue = async () => {
  //     if (!user?.id) return;

  //     setIsLoading(true);
  //     try {
  //       const revenueData = await fetchRevenue(user.id);
  //       setData(revenueData);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadRevenue();
  // }, [user?.id]);

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 py-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <DynamicComment />
          </div>
          <div>
            <CreateRevenue />
          </div>
        </div>
        {isLoading || !revenueData ? (
          <div className="w-full flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <DataTable data={revenueData} columns={columns} type="revenue" />
        )}
      </div>
    </>
  );
}
