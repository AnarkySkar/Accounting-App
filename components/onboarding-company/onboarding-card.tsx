"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Message } from "../form-message";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import CompanyForm from "./CompanyForm";
import { useEditLLC } from "@/queries/company-onboarding";

interface OnboardingFormProps extends React.ComponentPropsWithoutRef<"div"> {
  searchParams: Message;
}

export function OnboardingForm({
  className,
  searchParams,
  ...props
}: OnboardingFormProps) {
  const router = useRouter();
  const { mutate } = useEditLLC();

  async function onSubmit(data: any) {
    mutate({
      ...data,
      llc_members: JSON.stringify(data.llc_members || []), // Store as JSON in Supabase
    });
    router.push("/dashboard");
    console.log(data);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">LLC Registration</CardTitle>
          <CardDescription>
            Fill in the details to register your LLC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyForm onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
