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
        { month: "January", desktop: 180, mobile: 210 },
        { month: "February", desktop: 205, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 159, mobile: 190 },
        { month: "May", desktop: 100, mobile: 130 },
        { month: "June", desktop: 100, mobile: 140 },
        { month: "July", desktop: 113, mobile: 190 },
        { month: "August", desktop: 144, mobile: 190 },
        { month: "September", desktop: 121, mobile: 153 },
        { month: "October", desktop: 90, mobile: 100 },
        { month: "November", desktop: 100, mobile: 140 },
        { month: "December", desktop: 140, mobile: 140 },
    ];

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
        mobile: {
            label: "Mobile",
            color: "var(--chart-2)",
        },
    };

    return (
        <Card className="w-1/2">
            <CardHeader>
                <CardTitle className="text-gray-600">Area Chart - Legend</CardTitle>
                <CardDescription>
                    Showing total visitors for this year
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
                            dataKey="mobile"
                            type="natural"
                            fill="var(--color-mobile)"
                            fillOpacity={0.4}
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="var(--color-desktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
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