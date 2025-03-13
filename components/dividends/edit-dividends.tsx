"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FileUpload } from "../shared/file-upload";
import { useToast } from "@/hooks/use-toast";
import { useEditDividend, useGetDividend } from "@/queries/dividends";
import { DropdownMenuItem } from "../ui/dropdown-menu";

interface EditDividendsProps {
  id: string;
}

export function EditDividends({ id }: EditDividendsProps) {
  const [open, setOpen] = useState(false);
  const { data } = useGetDividend(id);
  const { toast } = useToast();

  const form = useForm({
    // resolver: zodResolver(createDividendsSchema),
    defaultValues: {
      file: null,
      member_name: "",
      amount: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (!data) return;

    form.reset({
      member_name: data?.member_name!,
      amount: String(data?.amount),
      date: new Date(data?.date!),
      file: null,
    });
  }, [data]);

  const { mutate, isPending } = useEditDividend(id);

  async function onSubmit(data: any) {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast({
          title: "Success",
          description: "Dividends updated successfully",
        });
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Dividends</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="member_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Member Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Dividends Amount $"
                      type="number"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
