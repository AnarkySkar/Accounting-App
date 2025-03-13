"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Message } from "../form-message";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import CompanyForm from "./CompanyForm";
import { Button } from "@/components/ui/button";
import { useEditLLC, useGetLLC } from "@/queries/company-onboarding";
import { useTranslation } from "react-i18next";
interface OnboardingFormProps extends React.ComponentPropsWithoutRef<"div"> {
  searchParams: Message;
}

export function OnboardingFormPage({
  className,
  searchParams,
  ...props
}: OnboardingFormProps) {
  const { t } = useTranslation();
  const { mutate, isPending } = useEditLLC();
  const { data: llcData } = useGetLLC(); // Fetch LLC Data
  const cardData = llcData;
  console.log(cardData, "cardData");
  async function onSubmit(data: any) {
    mutate({
      ...data,
      llc_members: data.llc_members, // No need to stringify
    });
    console.log(data, "data");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t("company-info.title")}
            </CardTitle>
            <CardDescription>{t("company-info.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyForm
              onSubmit={onSubmit}
              isButton={false}
              llcData={cardData}
              isLoading={isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
