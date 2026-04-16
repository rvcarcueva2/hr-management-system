import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const BarChartDashboard = () => {

    const chartData = [
        { month: "January", desktop: 186 },
        { month: "February", desktop: 305 },
        { month: "March", desktop: 237 },
        { month: "April", desktop: 73 },
        { month: "May", desktop: 209 },
        { month: "June", desktop: 214 },
        { month: "July", desktop: 200 },
        { month: "August", desktop: 112 },
        { month: "September", desktop: 300 },
        { month: "October", desktop: 239 },
        { month: "November", desktop: 214 },
        { month: "December", desktop: 220 },
    ]
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "var(--chart-3)",
        },
    }
    return (
        <>
            <Card className="w-1/2">
                <CardHeader>
                    <CardTitle className="text-gray-600">Bar Chart</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
               
            </Card>

        </>
    )
}

export default BarChartDashboard