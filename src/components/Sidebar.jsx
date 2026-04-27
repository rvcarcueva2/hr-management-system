import { NavLink } from "react-router-dom"
import Logo from '../assets/images/recruitease_logo.svg';
import { RxDashboard } from "react-icons/rx";
import { HiOutlineDocument } from "react-icons/hi2";
import { GoBriefcase } from "react-icons/go";
import { IoCalendarClearOutline } from "react-icons/io5";
import { PiHeadset } from "react-icons/pi";
import { FiUsers } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { PiBookBookmark } from "react-icons/pi";



const Sidebar = () => {

    const linkClass = ({ isActive }) => {
        return isActive
            ? "flex mx-auto my-0.5 w-56 px-6 py-2 bg-green-600/20 text-[#0F6E56] rounded-md"
            : "flex mx-auto my-0.5 w-56 px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-md";
    }

    return (
        <>
            <aside className=" w-64 min-h-screen bg-white border border-gray-200">
                <div className=" p-2 text-2xl font-bold text-gray-800">
                    <NavLink
                        to='/'
                        className="flex">
                        <img
                            className="h-18 w-auto object-contain"
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
                        <RxDashboard className="text-lg mt-px mr-1" />
                        <span className="ml-3 ">Dashboard</span>
                    </NavLink>

                    <NavLink to="admin-applications" className={linkClass}>
                        <HiOutlineDocument className="text-lg  mt-0.5 mr-1" />
                        <span className="ml-3">Applications</span>
                    </NavLink>

                    <NavLink to="admin-calendar" className={linkClass}>
                        <IoCalendarClearOutline className="text-lg mt-px mr-1" />
                        <span className="ml-3">Calendar</span>
                    </NavLink>
                    <NavLink to="admin-jobs" className={linkClass}>
                        <GoBriefcase className="text-lg mt-0.5 mr-1" />
                        <span className="ml-3">Jobs</span>
                    </NavLink>
                    <NavLink to="admin-mentors" className={linkClass}>
                        <PiBookBookmark className="text-xl -mt-0.5 mr-1" />
                        <span className="ml-3">Mentors</span>
                    </NavLink>

                    <NavLink to="admin-users" className={linkClass}>
                        <FiUsers className="text-lg -mt-0.5 mr-1" />
                        <span className="ml-3">Users</span>
                    </NavLink>
                    <NavLink to="admin-mentorship" className={linkClass}>
                        <FaRegStar className="text-lg -mt-0.5 mr-1" />
                        <span className="ml-3">Mentorship</span>
                    </NavLink>
                    <div className="mt-4 mb-2">
                        <span className=" text-xs text-gray-500 py-4 px-6 uppercase">Support</span>
                    </div>
                    <NavLink to="admin-ticket" className={linkClass}>
                        <PiHeadset className="text-xl  -mt-0.5 mr-1" />
                        <span className="ml-3">Ticket</span>
                    </NavLink>
                </nav>


            </aside>

        </>
    )
}

export default Sidebar