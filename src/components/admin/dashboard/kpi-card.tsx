import { DashBoardDataType } from "@/app/admin/dashboard/page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatNumber, formatPrice } from "@/lib/utils";
import { CarIcon, IndianRupee, PoundSterling, TrendingUpIcon, UsersIcon } from "lucide-react";
import { use } from "react";

type KpiCardDataProps = {
    data: DashBoardDataType
}

interface DashboardItem {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
    amount: number;
    percentage: number,
    style: Intl.NumberFormatOptions['style']
}
export const KPICards = (props: KpiCardDataProps) => {
    const { data } = props;
    const {
        totalSales,
        carsSoldThisMonth,
        newCustomersThisMonth,
        conversionRates,
        conversionRatePercentageChange,
        salesPercentageChange,
        carsSoldPercentageChange,
        newCustomerPercetageChange,
    } = use(data);

    const dashboardData: DashboardItem[] = [
        {
            id: 1,
            title: "Total Sales",
            description: "Total sales revenue in the last 30 days",
            icon: IndianRupee,
            amount: totalSales,
            percentage: Math.round(salesPercentageChange),
            style: "currency"
        },
        {
            id: 2,
            title: "Cars Sold",
            description: "Total number cars sold in the last 30 days",
            icon: CarIcon,
            amount: carsSoldThisMonth,
            percentage: Math.round(carsSoldPercentageChange),
            style: "decimal"
        },
        {
            id: 3,
            title: "New Customers",
            description: "Total number of new customers in the last 30 days",
            icon: UsersIcon,
            amount: newCustomersThisMonth,
            percentage: Math.round(newCustomerPercetageChange),
            style: "decimal"
        },
        {
            id: 4,
            title: "Conversion Rate",
            description: "Percentage of sales in the last 30 days",
            icon: TrendingUpIcon,
            amount: conversionRates,
            percentage: Math.round(conversionRatePercentageChange),
            style: "percent"
        },
    ]
    return (
        <div className="grid gap-4 md:gap-8 lg:grid-cols-4 md:grid-cols-2">
            {dashboardData.map((item) => (
                <KpiCard key={item.id} {...item} />
            ))}
        </div>
    )
}

const KpiCard = (props: DashboardItem[][number]) => {
    const { icon: Icon, ...rest } = props;
    return (
        <Card key={rest.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col space-y-1">
                    <CardTitle className="text-gray-100">{rest.title}</CardTitle>
                    <CardDescription className="text-muted">{rest.description}</CardDescription>
                </div>
                <Icon className="h-6 w-6 text-gray-100" />
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-100">
                    {rest.style === "currency"
                        ? formatPrice({ price: rest.amount, currency: "INR" }) :
                        formatNumber(rest.amount, {
                            style: rest.style,
                            currency: "INR",
                            maximumFractionDigits: 0
                        })}
                </span>
                <p className={cn(
                    "text-xs",
                    rest.percentage > 0 ? "text-green-500" : rest.percentage < 0 ? "text-red-500" : "text-gray-200"
                )}>
                    {rest.percentage === 0
                        ? `${rest.percentage} %`
                        : formatNumber(rest.percentage / 100, {
                            style: 'percent',
                            maximumFractionDigits: 0,
                        })}
                </p>
            </CardContent>
        </Card>
    )
}
