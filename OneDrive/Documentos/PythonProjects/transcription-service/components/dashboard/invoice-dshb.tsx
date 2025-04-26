import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { mapBarChartData, returnStatusLabels } from "@/utils/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DashboardInvoiceData } from "@/types";
import initials from "initials";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
interface InvoiceDashboardProps {
  data: DashboardInvoiceData;
  selectedFilter: string;
}

const InvoiceDashboard: React.FC<InvoiceDashboardProps> = ({
  data,
  selectedFilter,
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.invoices.total")}
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.total_invoices ?? 0}
            </div>
            {/* <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.invoices.totalAmount")}
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data?.total_invoice_amount ?? 0)}
            </div>
            {/* <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.invoices.uploaded")}
            </CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.invoice_uploaded ?? 0}
            </div>
            {/* <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.invoices.generated")}
            </CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.invoice_generated ?? 0}
            </div>
            {/* <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p> */}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>
              Overview{" "}
              <span className="text-muted-foreground text-lg">
                ( {t("dashboard.invoices.amount")} )
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={mapBarChartData(
                  data?.bar_chart_data ?? [],
                  selectedFilter as any
                )}
              >
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    return value;
                  }}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                  tickMargin={10}
                />
                <Bar
                  dataKey="total"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("dashboard.invoices.recent")}</CardTitle>
            <CardDescription>
              You created {data?.total_invoices} invoices in this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {data?.recent_invoices?.map((recent_invoice) => (
                <div key={recent_invoice.id} className="flex items-center">
                  <Avatar className="size-9">
                    <AvatarFallback>
                      {initials(user?.user_metadata?.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {recent_invoice.title}
                    </p>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      {returnStatusLabels(recent_invoice.status!)}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {formatCurrency(recent_invoice.price ?? 0)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InvoiceDashboard;
