import { KPICards } from "@/components/admin/dashboard/kpi-card";
import { SalesChart } from "@/components/admin/dashboard/sales_chart";
import { prisma } from "@/lib/prisma";
import { calculatePercentageChange } from "@/lib/utils";
import { ClassifiedStatus, CustomerStatus } from "@prisma/client";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";


async function getDashboardData() {
    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    const endOfThisMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1))

    const lastMonthPromises = {
        carsSoldThisMonth: prisma.classified.count({
            where: {
                status: ClassifiedStatus.SOLD,
                updated_at: {
                    gte: startOfThisMonth,
                    lte: endOfThisMonth
                },
            }
        }),
        carsSoldLastMonth: prisma.classified.count({
            where: {
                status: ClassifiedStatus.SOLD,
                updated_at: {
                    gte: startOfLastMonth,
                    lte: startOfThisMonth
                },
            }
        }),
        newCustomersThisMonth: prisma.customer.count({
            where: {
                createdAt: {
                    gte: startOfThisMonth,
                    lte: endOfThisMonth
                },
            }
        }),
        purchasedCustomerThisMonth: prisma.customer.count({
            where: {
                status: CustomerStatus.PURCHASED,
                updatedAt: {
                    gte: startOfLastMonth,
                    lte: startOfThisMonth
                },
            }
        }),
        purchasedCustomersLastMonth: prisma.customer.count({
            where: {
                status: CustomerStatus.PURCHASED,
                updatedAt: {
                    gte: startOfThisMonth,
                    lte: endOfThisMonth
                },
            }
        }),
        newCustomersLastMonth: prisma.customer.count({
            where: {
                createdAt: {
                    gte: startOfLastMonth,
                    lte: startOfThisMonth
                },
            }
        })
    };


    const totalSalesThisMonth = await prisma.classified.aggregate({
        where: {
            status: ClassifiedStatus.SOLD,
            updated_at: {
                gte: startOfLastMonth,
                lte: endOfThisMonth
            }
        },
        _sum: { price: true }
    })
    const totalSalesPreviousMonth = await prisma.classified.aggregate({
        where: {
            status: ClassifiedStatus.SOLD,
            updated_at: {
                gte: startOfLastMonth,
                lte: startOfThisMonth
            }
        },
        _sum: { price: true }
    })

    const [carsSoldThisMonth,
        carsSoldLastMonth,
        newCustomersThisMonth,
        newCustomersLastMonth,
        purchasedCustomerThisMonth,
        purchasedCustomersLastMonth,
    ] = await Promise.all(Object.values(lastMonthPromises));

    const [salesThisMonth, salesPreviousMonth] = await Promise.all([
        totalSalesThisMonth,
        totalSalesPreviousMonth
    ]);

    const conversionRates =
        newCustomersThisMonth > 0 ? purchasedCustomerThisMonth / newCustomersThisMonth : 0;

    const previousConversionRates = newCustomersLastMonth > 0 ? purchasedCustomersLastMonth / newCustomersLastMonth : 0;

    const conversionRatePercentageChange = calculatePercentageChange(conversionRates, previousConversionRates);

    const totalSales = salesThisMonth._sum.price || 0;
    const previousTotalSales = salesPreviousMonth._sum.price || 0;

    const salesPercentageChange = calculatePercentageChange(totalSales, previousTotalSales);

    // console.log({ totalSales, previousTotalSales, salesPercentageChange })

    const carsSoldPercentageChange = calculatePercentageChange(carsSoldThisMonth, carsSoldLastMonth);

    const newCustomerPercetageChange = calculatePercentageChange(newCustomersThisMonth, newCustomersLastMonth);

    // const purchaseCustomerPercentageChange = calculatePercentageChange(purchasedCustomerThisMonth, purchasedCustomersLastMonth);
    // console.log({ carsSoldThisMonth, carsSoldLastMonth, carsSoldPercentageChange })

    // console.log({ newCustomersLastMonth, newCustomersThisMonth, newCustomerPercetageChange })

    return {
        conversionRates,
        conversionRatePercentageChange,
        salesPercentageChange,
        totalSales,
        previousTotalSales,
        carsSoldThisMonth,
        newCustomersThisMonth,
        carsSoldPercentageChange,
        newCustomerPercetageChange,
        // purchaseCustomerPercentageChange
    };
}

async function getChartData() {
    const now = new Date();
    const monthsData = [];

    for (let i = 0; i < 12; i++) {
        const startDate = startOfMonth(subMonths(now, i));   //keeps summing months from now
        const endDate = endOfMonth(subMonths(now, i));

        const monthlySales = await prisma.classified.aggregate({
            where: {
                status: ClassifiedStatus.SOLD,
                updated_at: {
                    gte: startDate,
                    lte: endDate
                },
            },
            _sum: {
                price: true,
            },
        });
        monthsData.unshift({
            month: format(startDate, "MMM"),
            sales: monthlySales._sum.price || 0
        })
    }
    return monthsData;
}

export type DashBoardDataType = ReturnType<typeof getDashboardData>;
export type ChartDataType = ReturnType<typeof getChartData>;
export default async function AdminDashboardPage() {
    const dashboardData = getDashboardData();
    const chartData = getChartData()
    // console.log({ dashboardData })
    return (
        <>
            <KPICards data={dashboardData} />
            <SalesChart data = {chartData}/>
        </>
    )
}

