import { NavLink } from "react-router-dom"
import Logo from '../assets/images/recruitease_logo.svg';
import { RxDashboard } from "react-icons/rx";
import { GoBriefcase } from "react-icons/go";
import { IoCalendarClearOutline } from "react-icons/io5";
import { PiHeadsetFill } from "react-icons/pi";


const Sidebar = () => {

    const linkClass = ({ isActive }) => {
        return isActive
            ? "flex mx-auto my-0.5 w-56 px-6 py-2  bg-green-600/20 text-[#0F6E56] rounded-md"
            : "flex mx-auto my-0.5 w-56 px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-md";
    }

    return (
        <>
            <aside className="font-geist w-64 h-screen bg-white border border-gray-200">
                <div className=" p-2 text-2xl font-bold text-gray-800">
                    <NavLink
                        to='/'
                        className="flex">
                        <img
                            className="h-20 w-auto object-contain"
                            src={Logo}
                            alt="RecruitEase"
                        />
                        <span className=" my-auto  text-black text-2xl "
                        >Recruit<span className='text-[#0F6E56]' >Ease</span></span>
                    </NavLink>
                </div>
                <div className="mt-2">
                    <span className=" text-xs text-gray-500 px-6 uppercase">Menu</span>
                </div>

                <nav className=" mt-2 flex flex-col text-sm">

                    <NavLink to="/admin" className={linkClass} end >
                        <RxDashboard className="text-lg mt-0.5 " />
                        <span className="ml-3">Dashboard</span>
                    </NavLink>

                    <NavLink to="admin-jobs" className={linkClass}>
                        <GoBriefcase className="text-lg mt-0.5" />
                        <span className="ml-3">Jobs</span>
                    </NavLink>

                    <NavLink to="admin-calendar" className={linkClass}>
                        <IoCalendarClearOutline className="text-lg mt-0.5" />
                        <span className="ml-3">Calendar</span>
                    </NavLink>
                    <div className="mt-4 mb-2">
                        <span className=" text-xs text-gray-500 py-4 px-6 uppercase">Support</span>
                    </div>
                    <NavLink to="admin-ticket" className={linkClass}>
                        <PiHeadsetFill className="text-lg  mt-0.1" />
                        <span className="ml-3">Ticket</span>
                    </NavLink>
                </nav>

            </aside>

        </>
    )
}

export default Sidebar