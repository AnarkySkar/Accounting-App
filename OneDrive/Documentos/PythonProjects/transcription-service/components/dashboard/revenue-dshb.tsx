import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { mapBarChartData } from "@/utils/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DashboardExpenseData,
  DashboardInvoiceData,
  DashboardRevenueData,
} from "@/types";
import initials from "initials";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";

interface RevenueDashboardProps {
  data: DashboardRevenueData;
  selectedFilter: string;
}

const RevenueDashboard: React.FC<RevenueDashboardProps> = ({
  data,
  selectedFilter,
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.revenue.total")}
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total_revenue ?? 0}</div>
            {/* <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.revenue.totalAmount")}
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data?.total_revenue_amount ?? 0)}
            </div>
            {/* <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.revenue.uploaded")}
            </CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.revenue_uploaded ?? 0}
            </div>
            {/* <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p> */}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.revenue.businessExpenses")}
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data?.total_business_income ?? 0)}
            </div>
            {/* <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.revenue.personalExpenses")}
            </CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data?.total_personal_income ?? 0)}
            </div>
            {/* <p className="text-xs text-muted-foreground">
                    +19% from last month
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
                ( {t("dashboard.revenue.amount")} )
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
            <CardTitle>{t("dashboard.revenue.recent")}</CardTitle>
            <CardDescription>
              You created {data?.total_revenue} revenues in this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {data?.recent_revenue?.map((recent_revenue) => (
                <div key={recent_revenue.id} className="flex items-center">
                  <Avatar className="size-9">
                    <AvatarFallback>
                      {initials(user?.user_metadata?.name ?? "")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="ml-auto font-medium">
                    {formatCurrency(recent_revenue.personal_income ?? 0)}
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

export default RevenueDashboard;
