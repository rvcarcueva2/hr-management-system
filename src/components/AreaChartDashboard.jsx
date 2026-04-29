import React from 'react'

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card"

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const AreaChartDashboard = () => {

    const chartData = [
        { month: "January", accepted: 18, rejected: 12 },
        { month: "February", accepted: 15, rejected: 10 },
        { month: "March", accepted: 17, rejected: 10 },
        { month: "April", accepted: 13, rejected: 7 },
        { month: "May", accepted: 13, rejected: 10 },
        { month: "June", accepted: 13, rejected: 10 },
        { month: "July", accepted: 10, rejected: 3 },
        { month: "August", accepted: 10, rejected: 4 },

    ];

    const chartConfig = {
        accepted: {
            label: "Accepted",
            color: "var(--chart-1)",
        },
        rejected: {
            label: "Rejected",
            color: "var(--chart-2)",
        },
    };

    return (
        <Card className="w-1/2">
            <CardHeader>
                <CardTitle className="text-gray-600">Application Status Breakdown</CardTitle>
                <CardDescription>
                    Showing total accepted and rejected applications for this year
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="rejected"
                            type="natural"
                            fill="var(--color-rejected)"
                            fillOpacity={0.4}
                            stroke="var(--color-rejected)"
                            stackId="a"
                        />
                        <Area
                            dataKey="accepted"
                            type="natural"
                            fill="var(--color-accepted)"
                            fillOpacity={0.4}
                            stroke="var(--color-accepted)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>

        </Card>
    )
}

export default AreaChartDashboard