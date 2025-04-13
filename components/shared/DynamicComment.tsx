"use client";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const DynamicComment = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  // Extract the first part of the pathname (e.g., "expenses" from "/expenses")
  const page = pathname?.split("/dashboard/")[1];

  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">
        {t("dashboard.welcome_message")}
      </h2>
      <p className="text-muted-foreground">{t(`${page}.description`)}</p>
    </>
  );
};

export default DynamicComment;
