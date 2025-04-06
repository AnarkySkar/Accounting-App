import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../shared/file-upload";
import { createLLCSchema } from "@/lib/schema";
import { useEditLLC, useGetLLC } from "@/queries/company-onboarding";
import { useEffect } from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, File, Loader2, Trash2Icon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

// ✅ Define Form Schema using Zod

// ✅ Define Types
type LLCFormValues = z.infer<typeof createLLCSchema>;

interface LLCRegistrationFormProps {
  onSubmit?: (data: LLCFormValues) => void;
  defaultValues?: Partial<LLCFormValues>;
  isButton?: boolean;
  llcData?: LLCFormValues;
  isLoading?: boolean;
}

const LLCRegistrationForm: React.FC<LLCRegistrationFormProps> = ({
  onSubmit,
  isButton = true,
  llcData,
}) => {
  const form = useForm<LLCFormValues>({
    resolver: zodResolver(createLLCSchema),
    defaultValues: {
      llc_name: "",
      business_description: "",
      llc_type: "single", // Set a sensible default
      owner_residence: "",
      owner_citizenship: "",
      llc_ein: "",
      llc_address: "",
      state_incorporation: "",
      date_incorporation: new Date(),
      llc_documents: null,
      llc_members: [],
    },
  });

  // Update form values when fetched data is available
  useEffect(() => {
    if (llcData) {
      // console.log("llcData", llcData);
      form.reset({
        ...llcData,
        llc_documents: null,
        llc_members: llcData.llc_members || [], // Default to empty array if null
        date_incorporation: llcData.date_incorporation
          ? new Date(llcData.date_incorporation)
          : new Date(),
      });
      // console.log("form", form.getValues());
    }
  }, [llcData, form]);

  const { control, register, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "llc_members",
  });

  const { mutateAsync, isPending: isLoading } = useEditLLC();

  const handleSubmit: SubmitHandler<LLCFormValues> = async (data) => {
    onSubmit?.(data);

    await mutateAsync({
      ...data,
      llc_members: data.llc_members, // No need to stringify
    });

    setValue("llc_documents", null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6">
        {/* LLC Name */}
        <FormField
          control={form.control}
          name="llc_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LLC Name</FormLabel>
              <FormControl>
                <Input placeholder="LLC Name" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Business Description */}
        <FormField
          control={form.control}
          name="business_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Describe your business"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LLC Type */}
        <FormField
          control={form.control}
          name="llc_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LLC Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select LLC Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-Member</SelectItem>
                    <SelectItem value="multi">Multi-Member</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watch("llc_type") === "multi" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">LLC Members</h3>

            {fields.map((member, index) => (
              <div key={member.id} className="flex gap-4 items-center">
                <Input
                  {...register(`llc_members.${index}.name`)}
                  placeholder="Member Name"
                  required
                />

                <Select
                  onValueChange={
                    (value) =>
                      setValue(`llc_members.${index}.share`, Number(value)) // Convert to number
                  }
                  value={watch(`llc_members.${index}.share`)?.toString() || ""} // Convert to string
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Share %" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(11)].map((_, i) => (
                      <SelectItem key={i} value={(i * 10).toString()}>
                        {i * 10}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ name: "", share: 0 })} // Default to 0
            >
              Add Member
            </Button>
          </div>
        )}

        {/* Owner's Residence */}
        <FormField
          control={form.control}
          name="owner_residence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner's Residence</FormLabel>
              <FormControl>
                <Input placeholder="Owner's Residence" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Owner's Citizenship */}
        <FormField
          control={form.control}
          name="owner_citizenship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner's Citizenship</FormLabel>
              <FormControl>
                <Input placeholder="Owner's Citizenship" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LLC EIN */}
        <FormField
          control={form.control}
          name="llc_ein"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LLC EIN</FormLabel>
              <FormControl>
                <Input placeholder="LLC EIN" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LLC Address */}
        <FormField
          control={form.control}
          name="llc_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LLC Address</FormLabel>
              <FormControl>
                <Input placeholder="LLC Address" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* State of Incorporation */}
        <FormField
          control={form.control}
          name="state_incorporation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State of Incorporation</FormLabel>
              <FormControl>
                <Input
                  placeholder="State of Incorporation"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Incorporation */}
        <FormField
          control={form.control}
          name="date_incorporation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Incorporation</FormLabel>
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

        {/* File Upload */}
        <FormField
          control={form.control}
          name="llc_documents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload LLC Documents</FormLabel>

              {llcData?.llc_documents && (
                <div className="flex flex-col gap-2">
                  {llcData?.llc_documents.map((document: any) => (
                    <div
                      key={document.id}
                      className="flex items-center gap-2 py-1"
                    >
                      <File className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {document.name.replace(/^\d+-/, "")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <FormControl>
                <FileUpload
                  value={field.value}
                  onChange={(files) => field.onChange(files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading}>
          {isButton ? "Register LLC" : "Update Registration"}
          {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};

export default LLCRegistrationForm;
