'use client'

import { ChartDataType } from "@/app/admin/dashboard/page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { use } from "react";
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer, type TooltipProps } from 'recharts'

interface SalesChartProps {
    data: ChartDataType
}
export const SalesChart = (props: SalesChartProps) => {
    const { data } = props;
    const chartData = use(data);

    return (
        <Card className="mb-6 bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-gray-100">Monthly Sales {new Date().getFullYear() - 1}/{new Date().getFullYear()}

                </CardTitle>
                <CardDescription className="text-gray-400">
                    Number of cars sold per month
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="month"
                            stroke="#888888"
                            fontSize={12}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
  stroke="#888888"
  fontSize={12}
  axisLine={false}
  tickLine={false}
  tickFormatter={(value) => value.toLocaleString("en-IN")}
  width={100}
/>


                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                        <Bar dataKey='sales'
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800 border border-gray-700 p-2 rounded">
                <p className="text-gray-100">
                    {`${label}:${formatPrice({ price: payload[0].value as number, currency: "INR" })}`}
                </p>
            </div>
        )
    }
}