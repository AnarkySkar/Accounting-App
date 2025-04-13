// @ts-nocheck
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../shared/data-table-column-header";
import { DataTableRowActionsDividends } from "./data-table-row-actions";
import { Dividends } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";

export const columns: ColumnDef<Dividends>[] = [
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
      <DataTableColumnHeader column={column} title="Dividend ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">DIV-{row.getValue("id")?.slice(-4)}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "member_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Member Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("member_name").toUpperCase()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const { formatCurrency } = useCurrency();
      return (
        <div className="flex space-x-2">
          <span className="font-medium">
            {formatCurrency(row.getValue("amount"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "dividend_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dividend Date" />
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
    cell: ({ row }) => <DataTableRowActionsDividends row={row} />,
  },
];
