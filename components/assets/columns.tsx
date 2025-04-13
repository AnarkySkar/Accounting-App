"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../shared/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Assets } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";

export const columns: ColumnDef<Assets>[] = [
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
      <DataTableColumnHeader column={column} title="Assets ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        AST-{row.getValue("id")?.toString()?.slice(-4)}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "digital_assets",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Digital Assets" />
    ),
    cell: ({ row }) => {
      const { formatCurrency } = useCurrency();
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatCurrency(row.getValue("digital_assets"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "liquid_assets",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Liquid Assets" />
    ),
    cell: ({ row }) => {
      const { formatCurrency } = useCurrency();
      return (
        <div className="flex space-x-2">
          <span className="font-medium">
            {formatCurrency(row.getValue("liquid_assets"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "physical_assets",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Physical Assets" />
    ),
    cell: ({ row }) => {
      const { formatCurrency } = useCurrency();
      return (
        <div className="flex space-x-2">
          <span className="font-medium">
            {formatCurrency(row.getValue("physical_assets"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "assets_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assets Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{new Date(row?.original?.assets_date!)?.toDateString()}</span>
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
