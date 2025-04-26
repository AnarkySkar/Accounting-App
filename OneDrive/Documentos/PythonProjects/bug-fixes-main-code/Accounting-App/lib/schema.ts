import { z } from "zod";

export const signupFormSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  address: z.string().nonempty(),
  password: z.string().min(8),
});

export const createInvoiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["open", "in_progress", "done"], {
    required_error: "Status is required",
  }),
  amount: z.string().min(1, "Amount is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  file: z.any().optional(),
});

export const createExpenseSchema = z.object({
  description: z.string().min(1, "Description is required"),

  amount: z.string().min(1, "Amount is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  file: z.any().optional(),
  business_expense: z.string().min(1, "Business Expense is required"),
  personal_expense: z.string().min(1, "Personal Expense is required"),
});

export const createRevenueSchema = z.object({
  business_income: z.string().min(1, "Business Income is required"),
  personal_income: z.string().min(1, "Personal Income is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  file: z.any().optional(),
});

export const createDividendsSchema = z.object({
  member_name: z.string().min(1, "Member Name is required"),
  amount: z.string().min(1, "Amount is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  file: z.any().optional(),
});

export const createAssetsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  digital_assets: z.string().min(1, "Digital Assets is required"),
  liquid_assets: z.string().min(1, "Liquid Assets is required"),
  physical_assets: z.string().min(1, "Physical Assets is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  file: z.any().optional(),
});
export const createLLCSchema = z.object({
  llc_name: z.string().min(1, "LLC Name is required"),
  business_description: z.string().min(1, "Business Description is required"),
  llc_type: z.enum(["single", "multi"]),
  owner_residence: z.string().min(1, "Owner's Residence is required"),
  owner_citizenship: z.string().min(1, "Owner's Citizenship is required"),
  llc_ein: z.string().min(1, "LLC EIN is required"),
  llc_address: z.string().min(1, "LLC Address is required"),
  state_incorporation: z.string().min(1, "State of Incorporation is required"),
  date_incorporation: z.date({
    required_error: "Date of Incorporation is required",
  }),
  llc_documents: z.any().optional(),
  llc_members: z
    .array(
      z.object({
        name: z.string().min(1, "Member name is required"),
        share: z.number().min(0).max(100, "Share must be between 0-100"),
        citizenship: z.string(),
        address: z.string(),
      })
    )
    .optional(),
});
