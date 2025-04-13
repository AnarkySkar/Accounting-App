"use client";

import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "@/components/invoices/columns";
import { DataTable } from "@/components/shared/data-table";

import { taskSchema } from "../../../components/invoices/data/schema";
import { Button } from "@/components/ui/button";
import { CreateInvoice } from "@/components/invoices/create-invoice";
import { createClient } from "@/utils/supabase/server";
import { useGetInvoices } from "@/queries/invoices";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import DynamicComment from "@/components/shared/DynamicComment";
import { Invoice } from "@/types";
import { useEffect, useState } from "react";
// import { fetchInvoices } from "@/queries/supabaseQuery";
import { usePathname } from "next/navigation";
// export const metadata: Metadata = {
//   title: "Invoices",
//   description: "A list of the company invoices",
// };

export default function InvoicePage() {
  // const { user } = useAuth();
  const { data: invoicesData, isLoading } = useGetInvoices();
  // const [invoicesData, setInvoicesData] = useState<Invoice[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const { user } = useAuth();
  // const [error, setError] = useState<string | null>(null);
  // useEffect(() => {
  //   const fetchInvoices = async () => {
  //     if (!user?.id) return;
  //     setIsLoading(true);

  //     try {
  //       const response = await fetch(`/api/invoice?userId=${user.id}`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch invoices");
  //       }
  //       const data = await response.json();
  //       setInvoicesData(data);
  //     } catch (err) {
  //       setError(
  //         err instanceof Error ? err.message : "An unknown error occurred"
  //       );
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchInvoices();
  // }, [user?.id]);
  // const [data, setData] = useState<Invoice[]>([]);
  // const pathname = usePathname();
  // useEffect(() => {
  //   const loadData = async () => {
  //     if (!user?.id) return;

  //     setIsLoading(true);

  //     try {
  //       const invoicesData = await fetchInvoices(user.id);
  //       setData(invoicesData);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [pathname]);

  return (
    <>
      <div className=" h-full flex-1 flex-col space-y-8 py-8 flex overflow-x-hidden">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <DynamicComment />
          </div>
          <div>
            <CreateInvoice />
          </div>
        </div>
        {isLoading || !invoicesData ? (
          <div className="w-full flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <DataTable data={invoicesData} columns={columns} type="invoices" />
        )}
      </div>
    </>
  );
}
