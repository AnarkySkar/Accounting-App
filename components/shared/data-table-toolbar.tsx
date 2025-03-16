"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { statuses } from "../invoices/data/data";
import { DataTableFacetedFilter } from "../invoices/data-table-faceted-filter";
import { useTranslation } from "react-i18next";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  type: "expenses" | "invoices" | "dividends" | "revenue" | "assets";
}

export function DataTableToolbar<TData>({
  table,
  type,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={
            type === "expenses"
              ? t("data-table-toolbar.filter.expenses")
              : type === "invoices"
                ? t("data-table-toolbar.filter.invoices")
                : type === "revenue"
                  ? t("data-table-toolbar.filter.revenue")
                  : type === "assets"
                    ? t("data-table-toolbar.filter.assets")
                    : t("data-table-toolbar.filter.dividends")
          }
          value={
            type === "expenses"
              ? (table.getColumn("description")?.getFilterValue() as string)
              : type === "invoices"
                ? (table.getColumn("title")?.getFilterValue() as string)
                : type === "revenue"
                  ? (table
                      .getColumn("business_income")
                      ?.getFilterValue() as string)
                  : type === "assets"
                    ? (table
                        .getColumn("digital_assets")
                        ?.getFilterValue() as string)
                    : (table
                        .getColumn("member_name")
                        ?.getFilterValue() as string) // For Dividends
          }
          onChange={
            (event) =>
              type === "expenses"
                ? table
                    .getColumn("description")
                    ?.setFilterValue(event.target.value)
                : type === "invoices"
                  ? table.getColumn("title")?.setFilterValue(event.target.value)
                  : type === "revenue"
                    ? table
                        .getColumn("business_income")
                        ?.setFilterValue(event.target.value)
                    : type === "assets"
                      ? table
                          .getColumn("digital_assets")
                          ?.setFilterValue(event.target.value)
                      : table
                          .getColumn("member_name")
                          ?.setFilterValue(event.target.value) // For Dividends
          }
        />
        {type === "invoices" && table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {type === "dividends" && table.getColumn("member_name") && (
          <Input
            placeholder="Filter dividends..."
            value={
              (table.getColumn("member_name")?.getFilterValue() as string) || ""
            }
            onChange={(event) =>
              table.getColumn("member_name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
