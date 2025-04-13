"use client";

import { useRef, useState, useEffect } from "react";
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
import jsPDF from "jspdf";

import { InvoiceDetailDialog } from "./InvoiceDetailsDialog";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";

// Function to generate a random invoice number
const generateRandomInvoiceNumber = () => {
  // Format similar to the example: Y9SIZE-001
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
  const randomNum = Math.floor(1000 + Math.random() * 90000); // 5-digit number
  return `INV-${randomNum}`;
};

export default function InvoiceForm() {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(generateRandomInvoiceNumber());

  // Add state for customer information
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerTaxId, setCustomerTaxId] = useState("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<any[]>([
    {
      id: Math.random(),
      description: "Administration Services",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    },
  ]);
  const [date, setDate] = useState<Date>(new Date());
  const [tax, setTax] = useState<number>(0);

  // Generate a new invoice number when the component mounts
  useEffect(() => {
    setInvoiceNumber(generateRandomInvoiceNumber());
  }, []);

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

    const invoice: any = {
      invoiceNumber: invoiceNumber,
      invDate: format(date, "yyyy-MM-dd"),
      customerName: customerName,
      customerAddress: customerAddress,
      customerCity: customerCity,
      customerTaxId: customerTaxId,
      items,
      notes: notes,
      subtotal: calculateSubtotal(),
      tax,
      total: calculateTotal(),
      currency: "USD",
      logo,
    };

    setOpen(true);
    setSubmittedData(invoice);
  };

  // Generate a new random invoice number
  const refreshInvoiceNumber = () => {
    setInvoiceNumber(generateRandomInvoiceNumber());
  };

  const handleGeneratePDF = () => {
    try {
      // Creare un documento PDF direttamente
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Aggiungere il titolo
      pdf.setFontSize(24);
      pdf.text("INVOICE", 150, 20, { align: "right" });
      
      // Aggiungere il numero fattura
      pdf.setFontSize(12);
      pdf.text(`#${invoiceNumber}`, 150, 30, { align: "right" });
      
      // Aggiungere la data
      pdf.text(`Date: ${format(date, "MMM dd, yyyy")}`, 150, 40, { align: "right" });
      
      // Aggiungere informazioni mittente
      pdf.setFontSize(14);
      pdf.text("FROM:", 20, 50);
      pdf.setFontSize(12);
      pdf.text("TAM SUPPORT LLC", 20, 60);
      pdf.text("30 N GOULD STE ST R", 20, 65);
      pdf.text("SHERIDAN, 82801", 20, 70);
      pdf.text("EIN: 61-2118570", 20, 75);
      
      // Aggiungere informazioni destinatario
      pdf.setFontSize(14);
      pdf.text("BILL TO:", 120, 50);
      pdf.setFontSize(12);
      pdf.text(customerName || "Customer Name", 120, 60);
      pdf.text(customerAddress || "Street Address", 120, 65);
      pdf.text(customerCity || "City, State, Zip", 120, 70);
      if (customerTaxId) {
        pdf.text(`TAX N°: ${customerTaxId}`, 120, 75);
      }
      
      // Intestazioni tabella
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text("Item", 20, 90);
      pdf.text("Quantity", 100, 90);
      pdf.text("Unit Price", 130, 90);
      pdf.text("Amount", 170, 90);
      pdf.line(20, 95, 190, 95);
      
      // Righe tabella (articoli)
      pdf.setFont(undefined, 'normal');
      let yPosition = 105;
      items.forEach(item => {
        pdf.text(item.description || "Item", 20, yPosition);
        pdf.text(String(item.quantity), 100, yPosition);
        pdf.text(`$${item.unitPrice.toFixed(2)}`, 130, yPosition);
        pdf.text(`$${item.amount.toFixed(2)}`, 170, yPosition);
        yPosition += 10;
      });
      
      pdf.line(20, yPosition, 190, yPosition);
      yPosition += 10;
      
      // Note
      if (notes) {
        pdf.setFontSize(14);
        pdf.text("Notes:", 20, yPosition);
        yPosition += 10;
        pdf.setFontSize(12);
        pdf.text(notes ?? "", 20, yPosition, { maxWidth: 150 });
        yPosition += 20;
      }
      
      // Totali
      pdf.text("Subtotal:", 130, yPosition);
      pdf.text(`$${calculateSubtotal().toFixed(2)}`, 170, yPosition);
      yPosition += 10;
      
      pdf.text(`Tax (${tax}%):`, 130, yPosition);
      pdf.text(`$${(calculateSubtotal() * tax / 100).toFixed(2)}`, 170, yPosition);
      yPosition += 10;
      
      pdf.setFont(undefined, 'bold');
      pdf.text("Total:", 130, yPosition);
      pdf.text(`$${calculateTotal().toFixed(2)}`, 170, yPosition);
      yPosition += 10;
      
      pdf.text("Amount due:", 130, yPosition);
      pdf.text(`$${calculateTotal().toFixed(2)}`, 170, yPosition);
      
      // Salva il PDF
      pdf.save("invoice.pdf");
      console.log("PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Check console for details.");
    }
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl mx-auto px-4 py-6 md:p-12">
        <Card>
          <CardContent className="p-4 md:p-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-8">
                <div className="space-y-2">
                  <div
                    className="w-24 h-24 md:w-32 md:h-32 bg-secondary flex items-center justify-center rounded cursor-pointer"
                    onClick={() => inputRef?.current?.click()}
                  >
                    {logo ? (
                      <img
                        src={logo}
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
                    <p className="text-sm md:text-base">
                      {user?.user_metadata?.address}
                    </p>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    INVOICE
                  </h1>
                  <div className="flex md:justify-end items-center">
                    <div className="flex flex-col items-start md:items-end">
                      <span className="text-sm font-medium">#</span>
                      <Input
                        name="invoiceNumber"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="md:text-right"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={refreshInvoiceNumber}
                      className="ml-2 hide-on-pdf"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                    </Button>
                  </div>
                  <div className="mt-4 flex items-center md:justify-end gap-2">
                    <span>Date:</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full md:w-[200px] justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "MMM dd, yyyy") : <span>Pick a date</span>}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h2 className="text-lg font-semibold mb-2">FROM:</h2>
                  <div className="space-y-1">
                    <p className="font-medium">TAM SUPPORT LLC</p>
                    <p>30 N GOULD STE ST R</p>
                    <p>SHERIDAN, 82801</p>
                    <p>EIN: 61-2118570</p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-2">BILL TO:</h2>
                  <div className="space-y-2">
                    <Input 
                      name="customerName" 
                      placeholder="Customer Name" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <Input 
                      name="customerAddress" 
                      placeholder="Street Address" 
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                    <Input 
                      name="customerCity" 
                      placeholder="City, State, Zip" 
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                    />
                    <Input 
                      name="customerTaxId" 
                      placeholder="Tax ID / VAT Number" 
                      value={customerTaxId}
                      onChange={(e) => setCustomerTaxId(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8 overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-12 gap-2 md:gap-4 mb-2 font-semibold text-sm md:text-base border-b-2 border-gray-200 py-2">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Unit Price</div>
                    <div className="col-span-2">Amount</div>
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 md:gap-4 mb-2 border-b border-gray-200 py-2"
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
                  <Textarea 
                    name="notes" 
                    placeholder="Add any notes here..." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between border-t border-gray-200 pt-2">
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
                  <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                    <span>Amount due:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4 hide-on-pdf">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGeneratePDF}
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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}