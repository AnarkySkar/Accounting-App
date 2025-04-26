"use client";

import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "@/components/expenses/columns";
import { DataTable } from "@/components/shared/data-table";

import { useGetExpenses } from "@/queries/expenses";
import { CreateExpense } from "@/components/expenses/create-expense";
import { Loader } from "lucide-react";
import DynamicComment from "@/components/shared/DynamicComment";
import { useEffect, useState } from "react";
import { Expenses } from "@/types";
// import { fetchExpenses } from "@/queries/supabaseQuery";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
// export const metadata: Metadata = {
//   title: "Invoices",
//   description: "A list of the company invoices",
// };

export default function ExpensePage() {
  const { data: expensesData, isLoading } = useGetExpenses();
  // const [expensesData, setExpensesData] = useState<Expenses[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const { user } = useAuth();
  // const [error, setError] = useState<string | null>(null);
  // console.log(expensesData);
  // useEffect(() => {
  //   const fetchExpenses = async () => {
  //     if (!user?.id) return;
  //     setIsLoading(true);
  //     try {
  //       const response = await fetch(`/api/expenses?userId=${user.id}`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch expenses");
  //       }
  //       const data = await response.json();
  //       setExpensesData(data);
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
  // console.log(user);
  // const pathname = usePathname();
  // useEffect(() => {
  //   const loadData = async () => {
  //     console.log("loading expense");
  //     if (!user?.id) return;

  //     setIsLoading(true);
  //     try {
  //       const expenses = await fetchExpenses(user.id);

  //       setExpensesData(expenses);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [pathname]);

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
            <CreateExpense />
          </div>
        </div>
        {isLoading || !expensesData ? (
          <div className="w-full flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <DataTable data={expensesData} columns={columns} type="expenses" />
        )}
      </div>
    </>
  );
}
