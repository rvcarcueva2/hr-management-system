import AreaChartDashboard from "@/components/AreaChartDashboard";
import BarChartDashboard from "@/components/BarChartDashboard";
import CardDashboard from "@/components/CardDashboard";

const AdminDashboardPage = () => {


    return (
        <>
            <div className="gap-2 ">

                <CardDashboard />
                <div className="flex gap-2">

                <AreaChartDashboard />
                <BarChartDashboard />
                </div>

            </div>

        </>
    );
};

export default AdminDashboardPage;