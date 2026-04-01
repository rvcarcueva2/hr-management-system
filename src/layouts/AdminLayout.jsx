import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"
import AdminNavBar from "../components/AdminNavBar"



const AdminLayout = () => {
    return (
        <>
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 bg-gray-100 overflow-y-auto">
                    <AdminNavBar />
                    <div className="p-4">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    )
}

export default AdminLayout