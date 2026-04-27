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
import useJobs from '@/hooks/useJobs'
import useApplications from '@/hooks/useApplications'
import useUsers from '@/hooks/useUsers'



const CardDashboard = () => {

    const { jobs } = useJobs();
    const countJobs = jobs.length;

    const { applications } = useApplications();
    const countApplications = applications.length;

    const { users } = useUsers();
    const acceptedCount = applications.filter(
        application => application.status === 'Accepted'
    ).length;
    const userCount = users.length;
    const countPercentage = userCount ? (acceptedCount / userCount) * 100 : 0;
    const roundedResult = countPercentage.toFixed(2);


    return (
        <>
            <div className='flex gap-2'>


                <Card className="@container/card w-md h-44 mb-2">
                    <CardHeader>
                        <CardDescription>Total Jobs Posted</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {countJobs}
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
                            Job posted for the last 6 months
                        </div>
                    </CardFooter>
                </Card>

                <Card className="@container/card flex w-md h-44 mb-2">
                    <CardHeader>
                        <CardDescription>Total Applications</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {countApplications}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">

                                +3.5%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Trending up this month
                        </div>
                        <div className="text-muted-foreground">
                            Applications for the last 6 months
                        </div>
                    </CardFooter>
                </Card>

                <Card className="@container/card flex w-md h-44 mb-2">
                    <CardHeader>
                        <CardDescription>Internal Mobility</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {roundedResult}%
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">

                                +6.5%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Trending up this month
                        </div>
                        <div className="text-muted-foreground">
                            Percentage of internal mobility for the last 6 months
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default CardDashboard