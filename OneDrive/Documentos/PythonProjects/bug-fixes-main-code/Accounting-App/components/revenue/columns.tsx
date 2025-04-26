// @ts-nocheck
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../shared/data-table-column-header";
import { DataTableRowActionsRevenue } from "./data-table-row-actions";
import { Revenue } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";

export const columns: ColumnDef<Revenue>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Revenue ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">REV-{row.getValue("id")?.slice(-4)}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "business_income",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Business Income" />
    ),
    cell: ({ row }) => {
      const { formatCurrency } = useCurrency();
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatCurrency(row.getValue("business_income"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "personal_income",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Personal Income" />
    ),
    cell: ({ row }) => {
      const { formatCurrency } = useCurrency();
      return (
        <div className="flex space-x-2">
          <span className="font-medium">
            {formatCurrency(row.getValue("personal_income"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Revenue Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{new Date(row?.original?.date!)?.toDateString()}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{new Date(row?.original?.created_at!)?.toDateString()}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActionsRevenue row={row} />,
  },
];
