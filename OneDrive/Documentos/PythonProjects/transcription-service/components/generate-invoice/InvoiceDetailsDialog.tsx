"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { createInvoiceSchema } from "@/lib/schema";
import { useToast } from "@/hooks/use-toast";
import { GenInvoices } from "@/types";
import { useGenerateInvoice } from "@/queries/gen-invoices";
import { returnStatusLabels } from "@/utils/utils";
import { useAuth } from "@/context/AuthContext";

interface InvoiceDetailDialogProps {
  data: Partial<GenInvoices & { invDate: string }>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function InvoiceDetailDialog({
  data,
  open,
  setOpen,
}: InvoiceDetailDialogProps) {
  const { toast } = useToast();

  const { user } = useAuth();

  const form = useForm<z.infer<typeof createInvoiceSchema>>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      file: null,
      title: "",
      status: "done",
      amount: String(data?.total) ?? "",
      date: data?.invDate ? new Date(data?.invDate) : new Date(),
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      file: null,
      title: "",
      status: "done",
      amount: String(data?.total) ?? "",
      date: data?.invDate ? new Date(data?.invDate) : new Date(),
    });
  }, [data]);

  const { mutate, isPending } = useGenerateInvoice(user?.id ?? "");

  async function onSubmit(formData: z.infer<typeof createInvoiceSchema>) {
    mutate(
      // @ts-ignore
      {
        ...data,
        ...formData,
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({
            title: "Success",
            description: "Invoice generated successfully",
          });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="submit">
          Create Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="w-full">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 ">
                          <SelectValue placeholder={"Status"} />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {["open", "in_progress", "done"].map((stat) => (
                            <SelectItem key={stat} value={`${stat}`}>
                              {returnStatusLabels(stat)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Generating..." : "Generate Invoice"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
