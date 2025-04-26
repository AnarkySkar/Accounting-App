"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Download,
  Plus,
  RefreshCwIcon,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { generatePDF } from "../../utils/utils";

import { InvoiceDetailDialog } from "./InvoiceDetailsDialog";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useGetCustomers } from "@/queries/invoices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useGetLLC } from "@/queries/company-onboarding";

// import { saveInvoice } from "./actions/invoice";
// import { type Invoice, type InvoiceItem } from "./types/invoice";

// Function to generate a random invoice number
const generateRandomInvoiceNumber = () => {
  // Format similar to the example: Y9SIZE-001
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetter = letters.charAt(
    Math.floor(Math.random() * letters.length)
  );
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `${randomLetter}${randomNum}IZE-001`;
};

type Item = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

type Invoice = {
  invoiceNumber: string;
  invDate: Date;
  customerName: string;
  customerAddress: string;
  customerCity: string;
  items: Item[];
  notes: string;
  tax: number;
  currency: "USD";
  logo: string;
};

const generateItem = () => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unitPrice: 0,
});

export default function InvoiceForm() {
  const { user } = useAuth();
  const { data: llc } = useGetLLC();
  const { formatCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data: customers, isLoading: customersLoading } = useGetCustomers();

  const form = useForm<Invoice>({
    defaultValues: {
      invoiceNumber: "",
      invDate: new Date(),
      customerName: "",
      customerAddress: "",
      customerCity: "",
      items: [generateItem()],
      notes: "",
      tax: 0,
      currency: "USD",
      logo: "",
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const { register } = form;

  const formValues = form.watch();

  useEffect(() => {
    form.setValue("invoiceNumber", generateRandomInvoiceNumber());
  }, []);

  const calculateAmount = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateSubtotal = () => {
    return formValues.items.reduce(
      (sum, item) => sum + calculateAmount(item.quantity, item.unitPrice),
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + subtotal * (formValues.tax / 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("logo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<Invoice> = async (data) => {
    const invoice = {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        amount: calculateAmount(item.quantity, item.unitPrice),
      })),
      subtotal: calculateSubtotal(),
      total: calculateTotal(),
    };

    setOpen(true);
    setSubmittedData(invoice);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-12 z-[100]"
      >
        <Card className="rounded-none w-[800px]">
          <CardContent className="p-10">
            <div className="flex justify-between gap-6 mb-8">
              <div className="space-y-2">
                <div
                  className="w-32 h-32 bg-secondary flex items-center justify-center rounded cursor-pointer"
                  onClick={() => inputRef?.current?.click()}
                >
                  {formValues.logo ? (
                    <img
                      src={formValues.logo}
                      alt="Logo"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span>Logo</span>
                      <Plus className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={inputRef}
                />
                <div>
                  <p className="font-semibold">{user?.user_metadata?.name}</p>
                  <p className="text-base">{user?.user_metadata?.address}</p>
                </div>
              </div>

              <div className="text-right">
                <h1 className="text-4xl font-bold text-primary mb-2">
                  INVOICE
                </h1>
                <div className="flex gap-2">
                  <Input
                    {...register("invoiceNumber")}
                    readOnly
                    className="text-right"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() =>
                      form.setValue(
                        "invoiceNumber",
                        generateRandomInvoiceNumber()
                      )
                    }
                  >
                    <RefreshCwIcon size={20} />
                  </Button>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <span>Date:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[200px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formValues.invDate ? (
                          format(formValues.invDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formValues.invDate}
                        onSelect={(date) => {
                          if (date) form.setValue("invDate", date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold">Bill To:</h2>
                <Select
                  onValueChange={(value) => {
                    const customer = JSON.parse(value);

                    form.setValue("customerName", customer.customerName);
                    form.setValue("customerAddress", customer.customerAddress);
                    form.setValue("customerCity", customer.customerCity);
                  }}
                >
                  <SelectTrigger className="w-max gap-2">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>

                  <SelectContent>
                    {customersLoading ? (
                      <p className="text-sm text-center py-1">
                        Loading customers...
                      </p>
                    ) : typeof customers === "object" &&
                      customers.length > 0 ? (
                      customers?.map((customer) => (
                        <SelectItem value={customer.id}>
                          {customer.customerName}
                        </SelectItem>
                      ))
                    ) : (
                      <p className="text-sm text-center py-1">
                        No customers founds
                      </p>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Input
                  {...register("customerName")}
                  placeholder="Customer Name"
                />
                <Input
                  {...register("customerAddress")}
                  placeholder="Street Address"
                />
                <Input
                  {...register("customerCity")}
                  placeholder="City, State, Zip"
                />
              </div>
            </div>

            <div className="mb-8 overflow-x-auto">
              <div>
                <div className="grid grid-cols-12 gap-4 mb-2 font-semibold text-base py-2">
                  <div className="col-span-6">ITEMS</div>
                  <div className="col-span-2">QUANTITY</div>
                  <div className="col-span-2">UNIT PRICE</div>
                  <div className="col-span-2">AMOUNT</div>
                </div>

                {fields.map((item, i) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 mb-2">
                    <div className="col-span-6">
                      <Input
                        {...register(`items.${i}.description`)}
                        placeholder="Item description"
                        className="text-base"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        {...register(`items.${i}.quantity`)}
                        min="1"
                        className="text-base"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        {...register(`items.${i}.unitPrice`)}
                        min="0"
                        step="0.01"
                        className="text-base"
                      />
                    </div>
                    <div className="col-span-1 flex items-center text-base">
                      {formatCurrency(
                        calculateAmount(
                          formValues.items[i].quantity,
                          formValues.items[i].unitPrice
                        )
                      )}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  append(generateItem());
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold mb-2">Notes:</h2>
                <Textarea
                  {...register("notes")}
                  placeholder="Add any notes here..."
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax (%):</span>
                  <Input
                    type="number"
                    {...register("tax")}
                    className="w-24"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4 hide-on-pdf">
              <Button
                type="button"
                variant="outline"
                onClick={() => generatePDF("invoice-form")}
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <InvoiceDetailDialog
                open={open}
                setOpen={setOpen}
                data={submittedData}
              />
            </div>
          </CardContent>
        </Card>
      </form>

      <div className="w-full max-w-4xl mx-auto p-12 z-[10]">
        <p className="mb-10 text-3xl font-bold">Preview</p>
        <Card id="invoice-form" className="rounded-none w-[800px]">
          <CardContent className="p-10">
            <div className="flex justify-between gap-6 mb-10">
              <div className="space-y-2">
                <div className="w-32 h-32 bg-secondary flex items-center justify-center rounded">
                  {formValues.logo && (
                    <img
                      src={formValues.logo}
                      alt="Logo"
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
              </div>
              <div className="text-right flex flex-col gap-1">
                <h1 className="text-4xl font-bold text-primary mb-2">
                  INVOICE
                </h1>
                <p>{formValues.invoiceNumber}</p>
                <div className="flex items-center justify-end gap-2">
                  <span>
                    <strong>Date:</strong> {format(formValues.invDate, "PPP")}
                  </span>
                </div>

                <p>EIN: {llc?.llc_ein}</p>
              </div>
            </div>

            <div className="flex mb-10 gap-10">
              <div className="w-[240px]">
                <h2 className="text-lg font-semibold mb-1">From:</h2>
                <p>{user?.user_metadata?.name}</p>
                <p className="text-base">{user?.user_metadata?.address}</p>
              </div>

              <div className="w-[240px]">
                <h2 className="text-lg font-semibold mb-1">Bill To:</h2>
                <div className="space-y-1">
                  {formValues.customerName && <p>{formValues.customerName}</p>}
                  {formValues.customerAddress && (
                    <p>{formValues.customerAddress}</p>
                  )}
                  {formValues.customerCity && <p>{formValues.customerCity}</p>}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto py-0.5">
              <div>
                <div className="grid grid-cols-12 gap-4 font-semibold text-base py-3 border-y border-white">
                  <div className="col-span-6">ITEMS</div>
                  <div className="col-span-2">QUANTITY</div>
                  <div className="col-span-2">UNIT PRICE</div>
                  <div className="col-span-2">AMOUNT</div>
                </div>

                {formValues.items.map((item, i) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 text-base py-3 border-b border-white"
                  >
                    <div className="col-span-6">
                      <p className="ml-0.5 font-semibold">{item.description}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="ml-0.5 font-semibold">{item.quantity}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="ml-0.5 font-semibold">
                        {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      {formatCurrency(
                        calculateAmount(item.quantity, item.unitPrice)
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="py-3">
                <h2 className="text-lg font-semibold mb-2">Notes:</h2>
                <p className="text-base break-words">{formValues.notes}</p>
              </div>
              <div>
                <div className="grid grid-cols-3 py-3 gap-4 border-b border-white">
                  <div className="col-span-2 text-end">
                    <span>Subtotal:</span>
                  </div>
                  <div>
                    <span>{formatCurrency(calculateSubtotal())}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 py-3 gap-4 border-b border-white">
                  <div className="col-span-2 text-end">
                    <span>Tax (%):</span>
                  </div>
                  <div>
                    <p>{formValues.tax}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 py-3 gap-4 border-b border-white">
                  <div className="col-span-2 text-end">
                    <span>Total:</span>
                  </div>
                  <div>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
