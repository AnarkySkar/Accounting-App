"use client";

import { Row } from "@tanstack/react-table";
import { Download, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { EditAssets } from "./edit-assets";
import { DeleteAsset } from "./delete-assets";
import { Assets } from "@/types";

interface DataTableRowActionsProps<TData extends Assets> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends Assets>({
  row,
}: DataTableRowActionsProps<TData>) {
  const supabase = createClient();

  const downloadAsset = async (path: string) => {
    if (!path) {
      console.error("No file path provided");
      return;
    }

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
      link.setAttribute("download", path.split("/").pop() || "asset.pdf"); // Set the file name
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
          disabled={!row.original.file_url}
          onClick={() =>
            row.original.file_url && downloadAsset(row.original.file_url)
          }
        >
          <Download className="h-4 w-4 mr-2" />
          <span>Download</span>
        </DropdownMenuItem>
        <EditAssets id={row.original.id} />
        <DropdownMenuSeparator />
        <DeleteAsset id={row.original.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
