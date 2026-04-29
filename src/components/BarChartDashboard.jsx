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
        { month: "January", application: 30 },
        { month: "February", application: 25 },
        { month: "March", application: 27 },
        { month: "April", application: 20 },
        { month: "May", application: 25 },
        { month: "June", application: 24 },
        { month: "July", application: 13 },
        { month: "August", application: 14 },

    ]
    const chartConfig = {
        application: {
            label: "Application",
            color: "var(--chart-3)",
        },
    }
    return (
        <>
            <Card className="w-1/2">
                <CardHeader>
                    <CardTitle className="text-gray-600">Applications Breakdown</CardTitle>
                    <CardDescription>Showing total applications this year</CardDescription>
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
                            <Bar dataKey="application" fill="var(--color-application)" radius={8} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
               
            </Card>

        </>
    )
}

export default BarChartDashboard