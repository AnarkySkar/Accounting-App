"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useDeleteRevenue } from "@/queries/revenue";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenuItem } from "../ui/dropdown-menu";

interface DeleteRevenueProps {
  id: string;
}

export function DeleteRevenue({ id }: DeleteRevenueProps) {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const { mutate, isPending } = useDeleteRevenue();

  const handleDelete = async () => {
    mutate(
      { id },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Revenue deleted successfully",
          });
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Revenue</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this revenue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={isPending}
            variant={"outline"}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            variant={"destructive"}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
