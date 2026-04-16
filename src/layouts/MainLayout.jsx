import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom"
import { Toaster } from '@/components/ui/sonner'




const MainLayout = () => {
    return (
        <>
            <div className="font-geist bg-gray-50">

                <Navbar />
                <Outlet />
                <Toaster />
                <Footer />
            </div>
        </>
    )

}

export default MainLayout