"use client";

import { useRef, useState } from "react";
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
import { CalendarIcon, Download, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { generatePDF } from "../../utils/utils";

import { InvoiceDetailDialog } from "./InvoiceDetailsDialog";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";

// import { saveInvoice } from "./actions/invoice";
// import { type Invoice, type InvoiceItem } from "./types/invoice";

export default function InvoiceForm() {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<any[]>([
    {
      id: Math.random(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    },
  ]);
  const [date, setDate] = useState<Date>(new Date());
  const [tax, setTax] = useState<number>(0);

  const calculateAmount = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + subtotal * (tax / 100);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Math.random(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof any, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.amount = calculateAmount(
              field === "quantity" ? value : item.quantity,
              field === "unitPrice" ? value : item.unitPrice
            );
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const invoice: any = {
      invoiceNumber: formData.get("invoiceNumber") as string,
      invDate: format(date, "yyyy-MM-dd"),
      customerName: formData.get("customerName") as string,
      customerAddress: formData.get("customerAddress") as string,
      customerCity: formData.get("customerCity") as string,
      items,
      notes: formData.get("notes") as string,
      subtotal: calculateSubtotal(),
      tax,
      total: calculateTotal(),
      currency: "USD",
      logo,
    };

    setOpen(true);
    setSubmittedData(invoice);

    // await saveInvoice(invoice);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto px-4 py-6 md:p-12 z-[100]"
      >
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-8">
              <div className="space-y-2">
                <div
                  className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 flex items-center justify-center rounded cursor-pointer"
                  onClick={() => inputRef?.current?.click()}
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="flex items-center gap-1 text-gray-400">
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
                  <p className="text-sm md:text-base">
                    {user?.user_metadata?.address}
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  INVOICE
                </h1>
                <Input
                  name="invoiceNumber"
                  defaultValue="3TF1S2-001"
                  className="md:text-right"
                />
                <div className="mt-4 flex items-center md:justify-end gap-2">
                  <span>Date:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full md:w-[200px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
              <div className="space-y-2">
                <Input name="customerName" placeholder="Customer Name" />
                <Input name="customerAddress" placeholder="Street Address" />
                <Input name="customerCity" placeholder="City, State, Zip" />
              </div>
            </div>

            <div className="mb-8 overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-12 gap-2 md:gap-4 mb-2 font-semibold text-sm md:text-base">
                  <div className="col-span-6">ITEMS</div>
                  <div className="col-span-2">QUANTITY</div>
                  <div className="col-span-2">UNIT PRICE</div>
                  <div className="col-span-2">AMOUNT</div>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 md:gap-4 mb-2"
                  >
                    <div className="col-span-6">
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder="Item description"
                        className="text-sm md:text-base"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                        className="text-sm md:text-base"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "unitPrice",
                            parseFloat(e.target.value)
                          )
                        }
                        min="0"
                        step="0.01"
                        className="text-sm md:text-base"
                      />
                    </div>
                    <div className="col-span-1 flex items-center text-sm md:text-base">
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
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
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h2 className="text-lg font-semibold mb-2">Notes:</h2>
                <Textarea name="notes" placeholder="Add any notes here..." />
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
                    value={tax}
                    onChange={(e) => setTax(parseFloat(e.target.value))}
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

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto p-12 md:p-12 z-[10]"
        id="invoice-form"
      >
        <p className="mb-6 md:mb-10 text-2xl md:text-3xl font-bold">Preview</p>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-8 md:mb-10">
              <div className="space-y-2">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 flex items-center justify-center rounded">
                  {logo && (
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>

                <div className="mt-2">
                  <p className="font-semibold">{user?.user_metadata?.name}</p>
                  <p className="text-sm md:text-base">
                    {user?.user_metadata?.address}
                  </p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  INVOICE
                </h1>
                <p>{submittedData?.invoiceNumber}</p>

                <div className="mt-4 flex items-center md:justify-end gap-2">
                  <span>Date: {format(date, "PPP")}</span>
                </div>
              </div>
            </div>

            <div className="mb-8 md:mb-10">
              <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
              <div className="space-y-1">
                {submittedData?.customerName && (
                  <p>{submittedData.customerName}</p>
                )}
                {submittedData?.customerAddress && (
                  <p>{submittedData.customerAddress}</p>
                )}
                {submittedData?.customerCity && (
                  <p>{submittedData.customerCity}</p>
                )}
              </div>
            </div>

            <div className="mb-8 overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-12 gap-2 md:gap-4 mb-2 font-semibold text-sm md:text-base">
                  <div className="col-span-6">ITEMS</div>
                  <div className="col-span-2">QUANTITY</div>
                  <div className="col-span-2">UNIT PRICE</div>
                  <div className="col-span-2">AMOUNT</div>
                </div>

                {items?.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 md:gap-4 mb-3 md:mb-4 text-sm md:text-base"
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
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-10 md:mt-20">
              <div>
                <h2 className="text-lg font-semibold mb-2">Notes:</h2>
                <p className="text-sm md:text-base">{submittedData?.notes}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax (%):</span>
                  <p>{tax}%</p>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

//  ) : (

//       )}
