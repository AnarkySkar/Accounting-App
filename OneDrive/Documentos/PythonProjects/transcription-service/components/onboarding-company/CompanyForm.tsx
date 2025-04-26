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
import { createLLCSchema } from "@/lib/schema";
import { useEditLLC } from "@/queries/company-onboarding";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
      llc_name: llcData?.llc_name ?? "",
      business_description: llcData?.business_description ?? "",
      llc_type: llcData?.llc_type ?? "single", // Set a sensible default
      owner_residence: llcData?.owner_residence ?? "",
      owner_citizenship: llcData?.owner_citizenship ?? "",
      llc_ein: llcData?.llc_ein ?? "",
      llc_address: llcData?.llc_address ?? "",
      state_incorporation: llcData?.state_incorporation ?? "",
      date_incorporation: llcData?.date_incorporation ?? new Date(),
      llc_documents: null,
      llc_members:
        llcData?.llc_type !== "multi"
          ? [{ name: "Member", share: 100 }]
          : llcData?.llc_members || [],
    },
  });
  const { control, register, watch, setValue } = form;

  console.log(form.formState.errors);

  const { mutateAsync, isPending: isLoading } = useEditLLC();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "llc_members",
  });

  const values = form.watch();

  const hasResetWithData = useRef(false);

  // Update form values when fetched data is available
  useEffect(() => {
    if (hasResetWithData.current) return;

    if (llcData) {
      hasResetWithData.current = true;

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

  // update information every time input changes with a debounce delay of 1 second
  useEffect(() => {
    if (isButton) return;

    const timer = setTimeout(() => {
      save(form.getValues());
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [JSON.stringify(values)]);

  async function handleSubmit(data: LLCFormValues) {
    if (!isButton) return;

    onSubmit?.(data);

    await save(data);
  }

  async function save(data: LLCFormValues) {
    await mutateAsync({
      ...data,
      llc_members: data.llc_members, // No need to stringify
    });
    // setValue("llc_documents", null);
  }

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
                  onValueChange={(value) => {
                    if (value === "single") {
                      setValue("llc_members", [
                        {
                          name: "Member",
                          share: 100,
                          address: "",
                          citizenship: "",
                        },
                      ]);
                    }

                    field.onChange(value);
                  }}
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

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">LLC Members</h3>

          {fields.map((member, index) => (
            <div key={member.id} className="flex flex-wrap gap-2 items-center">
              <Input
                {...register(`llc_members.${index}.name`)}
                placeholder="Name"
                required
                className="flex-grow basis-24"
              />

              {watch("llc_type") === "multi" ? (
                <>
                  <Select
                    onValueChange={
                      (value) =>
                        setValue(`llc_members.${index}.share`, Number(value)) // Convert to number
                    }
                    value={
                      watch(`llc_members.${index}.share`)?.toString() || ""
                    } // Convert to string
                  >
                    <SelectTrigger className="flex-grow basis-24">
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

                  <Input
                    {...register(`llc_members.${index}.citizenship`)}
                    placeholder="Citizenship"
                    className="flex-grow basis-24"
                  />

                  <Input
                    {...register(`llc_members.${index}.address`)}
                    placeholder="Address"
                    className="flex-grow basis-24"
                  />
                </>
              ) : (
                <Input
                  placeholder="Share %"
                  required
                  value="100%"
                  readOnly
                  disabled
                  className="flex-grow basis-24"
                />
              )}

              {watch("llc_type") === "multi" && (
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="destructive"
                  className="flex-grow basis-24"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          {watch("llc_type") === "multi" && (
            <Button
              type="button"
              onClick={() =>
                append({ name: "", share: 0, address: "", citizenship: "" })
              } // Default to 0
            >
              Add Member
            </Button>
          )}
        </div>

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
        {/* <FormField
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
        /> */}
        {/* Submit Button */}
        {isButton && (
          <Button type="submit" disabled={isLoading}>
            Register LLC
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default LLCRegistrationForm;
