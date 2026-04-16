import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"
import AdminNavBar from "../components/AdminNavBar"
import { Toaster } from '@/components/ui/sonner'



const AdminLayout = () => {
    return (
        <>
            <div className="font-geist flex min-h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 bg-gray-100 overflow-y-auto">
                    <AdminNavBar />
                    <div className="px-8 py-6">
                        <Outlet />
                        <Toaster />
                    </div>
                </main>
            </div>
        </>
    )
}

export default AdminLayout