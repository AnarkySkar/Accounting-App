"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";
import type { DashboardAnnualFinancials } from "@/types";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { generatePDF } from "@/utils/utils";

interface AnnualFinancialCardProps {
  financialData: DashboardAnnualFinancials;
}

const AnnualFinancialCard: React.FC<AnnualFinancialCardProps> = ({
  financialData,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();

  const financialMetrics = [
    {
      title: t("dashboard.annualCard.business_income"),
      value: financialData.total_business_income,
      formattedValue: formatCurrency(financialData.total_business_income),
    },
    {
      title: t("dashboard.annualCard.personal_income"),
      value: financialData.total_personal_income,
      formattedValue: formatCurrency(financialData.total_personal_income),
    },
    {
      title: t("dashboard.annualCard.business_expenses"),
      value: financialData.total_business_expenses,
      formattedValue: formatCurrency(financialData.total_business_expenses),
    },
    {
      title: t("dashboard.annualCard.personal_expenses"),
      value: financialData.total_personal_expenses,
      formattedValue: formatCurrency(financialData.total_personal_expenses),
    },
    {
      title: t("dashboard.annualCard.total_income"),
      value:
        financialData.total_business_income +
        financialData.total_personal_income,
      formattedValue: formatCurrency(
        financialData.total_business_income +
          financialData.total_personal_income
      ),
    },
    {
      title: t("dashboard.annualCard.company_profit"),
      value:
        financialData.total_business_income -
        financialData.total_business_expenses -
        financialData.total_personal_expenses -
        financialData.total_dividends,
      formattedValue: formatCurrency(
        financialData.total_business_income -
          financialData.total_business_expenses -
          financialData.total_personal_expenses -
          financialData.total_dividends
      ),
    },
    {
      title: t("dashboard.annualCard.total_physical_assets"),
      value: financialData.total_physical_assets,
      formattedValue: formatCurrency(financialData.total_physical_assets),
    },
    {
      title: t("dashboard.annualCard.total_digital_assets"),
      value: financialData.total_digital_assets,
      formattedValue: formatCurrency(financialData.total_digital_assets),
    },
    {
      title: t("dashboard.annualCard.total_liquid_assets"),
      value: financialData.total_liquid_assets,
      formattedValue: formatCurrency(financialData.total_liquid_assets),
    },
  ];

  const copyToClipboard = () => {
    const text = financialMetrics
      .map(
        (metric) =>
          `${metric.title}: $${metric.formattedValue.toLocaleString()}`
      )
      .join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadPdf = async () => {
    setDownloading(true);
    generatePDF("annual-financials");
    setDownloading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={downloadPdf} variant="outline" disabled={downloading}>
          <Download className="mr-2 h-4 w-4" />
          {t("dashboard.annualCard.download_pdf")}
        </Button>

        <Button onClick={copyToClipboard} variant="outline">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              {t("dashboard.annualCard.annual_data_copied")}
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              {t("dashboard.annualCard.copy_annual_data")}
            </>
          )}
        </Button>
      </div>
      <div
        id="annual-financials"
        className="grid gap-4 grid-cols-3 bg-background"
      >
        {financialMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.formattedValue}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnnualFinancialCard;
