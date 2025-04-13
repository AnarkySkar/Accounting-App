// @ts-nocheck
"use client";

import { Row } from "@tanstack/react-table";
import { Download, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteExpense } from "./delete-expense";
import { EditExpense } from "./edit-expense";
import { createClient } from "@/utils/supabase/client";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const supabase = createClient();

  const downloadInvoice = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("documents")
      .download(path);

    if (error) {
      console.error("Error downloading file:", error.message);
      return;
    }

    if (data) {
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", path.split("/").pop() || "expense.pdf"); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the object URL
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          disabled={row?.original?.file_url === null}
          onClick={() => downloadInvoice(row?.original?.file_url as string)}
        >
          <Download className="h-4 w-4 mr-2" />
          <span>Download</span>
        </DropdownMenuItem>
        <EditExpense id={row?.original?.id as string} />
        <DropdownMenuSeparator />
        <DeleteExpense id={row?.original?.id as string} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
