import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom"
import { ToastContainer } from 'react-toastify'; // Installed package using npm i react-toastify
import 'react-toastify/dist/ReactToastify.css';



const MainLayout = () => {
    return (
        <>
            <div className="bg-gray-50">

                <Navbar />
                <Outlet />
                <ToastContainer />
                <Footer />
            </div>
        </>
    )

}

export default MainLayout