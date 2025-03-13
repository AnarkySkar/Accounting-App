"use client";

import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "@/components/dividends/columns";
import { DataTable } from "@/components/shared/data-table";

import { CreateExpense } from "@/components/expenses/create-expense";
import { Loader } from "lucide-react";
import { CreateDividends } from "@/components/dividends/create-dividends";
import { useGetDividends } from "@/queries/dividends";
import { useAuth } from "@/context/AuthContext";
import DynamicComment from "@/components/shared/DynamicComment";
import { useEffect, useState } from "react";
import { Dividend } from "@/types";
// import { fetchDividends } from "@/queries/supabaseQuery";
export default function DividendsPage() {
  const { data: dividendsData, isLoading } = useGetDividends();
  // const [dividendsData, setDividendsData] = useState<Dividend[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const { user } = useAuth();
  // const [error, setError] = useState<string | null>(null);
  // useEffect(() => {
  //   const fetchExpenses = async () => {
  //     if (!user?.id) return;
  //     setIsLoading(true);

  //     try {
  //       const response = await fetch(`/api/dividends?userId=${user.id}`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch dividends");
  //       }
  //       const data = await response.json();
  //       setDividendsData(data);
  //     } catch (err) {
  //       setError(
  //         err instanceof Error ? err.message : "An unknown error occurred"
  //       );
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchExpenses();
  // }, [user?.id]);
  // const user = { id: "456ca6ae-8f3a-4e8d-9799-c997dd1d1ff7" };
  // // console.log("user", user);
  // // const data: any[] = [];
  // // const isLoading = false;
  // console.log("dividendsData", dividendsData);
  // console.log(user?.id);
  // useEffect(() => {
  //   const loadDividends = async () => {
  //     if (!user?.id) return;
  //     setIsLoading(true);

  //     try {
  //       const dividendsData = await fetchDividends(user.id);
  //       setDividendsData(dividendsData);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadDividends();
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
            <CreateDividends />
          </div>
        </div>
        {isLoading || !dividendsData ? (
          <div className="w-full flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <DataTable data={dividendsData} columns={columns} type="dividends" />
        )}
      </div>
    </>
  );
}
