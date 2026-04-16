import React from 'react'
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardAction
} from "@/components/ui/card"



const CardDashboard = () => {
    return (
        <>
            <div className='flex gap-2'>


                <Card className="@container/card w-md h-44 mb-2">
                    <CardHeader>
                        <CardDescription>Total Revenue</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            $1,250.00
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">

                                +12.5%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Trending up this month
                        </div>
                        <div className="text-muted-foreground">
                            Visitors for the last 6 months
                        </div>
                    </CardFooter>
                </Card>

                <Card className="@container/card flex w-md h-44 mb-2">
                    <CardHeader>
                        <CardDescription>Total Revenue</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            $1,250.00
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">

                                +12.5%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Trending up this month
                        </div>
                        <div className="text-muted-foreground">
                            Visitors for the last 6 months
                        </div>
                    </CardFooter>
                </Card>

                <Card className="@container/card flex w-md h-44 mb-2">
                    <CardHeader>
                        <CardDescription>Total Revenue</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            $1,250.00
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">

                                +12.5%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Trending up this month
                        </div>
                        <div className="text-muted-foreground">
                            Visitors for the last 6 months
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default CardDashboard