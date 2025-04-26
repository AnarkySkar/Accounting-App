// @ts-nocheck
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../shared/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Expenses } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";

export const columns: ColumnDef<Expenses>[] = [
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
      <DataTableColumnHeader column={column} title="Expense ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">EXP-{row.getValue("id")?.slice(-4)}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("description")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const { formatCurrency } = useCurrency();
      return (
        <div className="flex space-x-2">
          <span className="font-medium">
            {formatCurrency(row.getValue("price"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "business_expense",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Business Expense" />
    ),
    cell: ({ row }) => {
      const { formatCurrency } = useCurrency();
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatCurrency(row.getValue("business_expense"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "personal_expense",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Personal Expense" />
    ),
    cell: ({ row }) => {
      const { formatCurrency } = useCurrency();
      return (
        <div className="flex space-x-2">
          <span className="font-medium">
            {formatCurrency(row.getValue("personal_expense"))}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "expense_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expense Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{new Date(row?.original?.expense_date!)?.toDateString()}</span>
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
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
