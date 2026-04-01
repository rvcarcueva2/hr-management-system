import AuthBackground from "../components/AuthBackground"
import { Outlet } from "react-router-dom"



const AuthLayout = () => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
                <AuthBackground />
                <Outlet />
            </div>

        </>
    )
}

export default AuthLayout