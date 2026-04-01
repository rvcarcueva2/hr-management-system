import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


const AdminDashboardPage = () => {

    const { user, logout } = useAuth()

    return (
        <>
            <Card className="max-w-sm">
                <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                    <CardDescription>
                        Track progress and recent activity for your Vite app.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    Your design system is ready. Start building your next component.
                </CardContent>
            </Card>
        </>
    )
}

export default AdminDashboardPage