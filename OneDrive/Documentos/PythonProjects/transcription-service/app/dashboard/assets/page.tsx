"use client";

import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";
import { DataTable } from "@/components/shared/data-table";

import { CreateExpense } from "@/components/expenses/create-expense";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import DynamicComment from "@/components/shared/DynamicComment";
import { useEffect, useState } from "react";
import { Dividend } from "@/types";
import { useGetAssets } from "@/queries/assets";
import { CreateAssets } from "@/components/assets/create-assets";
import { columns } from "@/components/assets/columns";
import { unstable_noStore as noStore } from "next/cache";
export default function AssetsPage() {
  noStore();
  const { data: assetsData, isLoading } = useGetAssets();

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
            <CreateAssets />
          </div>
        </div>
        {isLoading || !assetsData ? (
          <div className="w-full flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <DataTable data={assetsData} columns={columns} type="assets" />
        )}
      </div>
    </>
  );
}
