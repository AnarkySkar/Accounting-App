"use client";

import { useState } from "react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FileUpload } from "../shared/file-upload";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useCreateInvoice } from "@/queries/invoices";
import { createInvoiceSchema } from "@/lib/schema";
import { useToast } from "@/hooks/use-toast";
import { returnStatusLabels } from "@/utils/utils";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

export function CreateInvoice() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const { user } = useAuth();

  const form = useForm<z.infer<typeof createInvoiceSchema>>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      file: null,
      title: "",
      status: "done",
      amount: "",
      date: new Date(),
    },
  });

  const { mutate, isPending } = useCreateInvoice(user?.id ?? "");
  // console.log(isPending);

  async function onSubmit(data: z.infer<typeof createInvoiceSchema>) {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast({
          title: t("invoices.create_invoice.toast.success.title"),
          description: t("invoices.create_invoice.toast.success.description"),
        });
      },
    });
  }

  // const mutation = useMutation({
  //   mutationFn: async (values: z.infer<typeof formSchema>) => {
  //     let fileUrl = null;

  //     if (values.file) {
  //       const { data, error } = await supabase.storage
  //         .from("invoices")
  //         .upload(`${Date.now()}-${values.file.name}`, values.file);

  //       if (error) throw error;
  //       fileUrl = data.path;
  //     }

  //     const { data, error } = await supabase
  //       .from("invoices")
  //       .insert([
  //         {
  //           amount: parseFloat(values.amount),
  //           date: values.date.toISOString(),
  //           file_url: fileUrl,
  //         },
  //       ])
  //       .select()
  //       .single();

  //     if (error) throw error;
  //     return data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["invoices"] });
  //     setOpen(false);
  //     form.reset();
  //   },
  // });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Invoice</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("invoices.create_invoice.dialog_title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t("invoices.create_invoice.title")}
                      {...field}
                    />
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
                      placeholder={t("invoices.create_invoice.amount")}
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
                            <span>{t("date_picker_placeholder")}</span>
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
              {isPending
                ? t("invoices.create_invoice.button.loading")
                : t("invoices.create_invoice.button.add")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
