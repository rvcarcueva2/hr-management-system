import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../assets/images/recruitease_logo.svg'
import useAuth from '../hooks/useAuth'
import useUsers from '../hooks/useUsers'
import { FaChevronDown, FaUser } from 'react-icons/fa6'
import { IoMdDocument } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { BsBarChartFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";





const Navbar = () => {

    const { logout } = useAuth()
    const { user: currentUser } = useUsers()
    const navigate = useNavigate()
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        const success = await logout();

        if (!success) return;

        navigate("/auth/login");
    };

    const role = currentUser?.role;

    const dropdown = [ // Data-driven UI approach,
        ...(role === "Admin" || role === "Reviewer" ? [{ label: "Admin", icon: BsBarChartFill, size: 15, to: "/admin" }] : []),
        { label: "Profile", icon: FaUser, size: 15, to: "/profile" },
        { label: "Application", icon: IoMdDocument, size: 17, to: "/my-application" },
        ...(role === "Mentor" ? [{ label: "Mentorship", icon: FaStar, size: 16, to: "/admin/admin-mentorship" }] : []),
        { label: "Logout", icon: MdOutlineLogout, size: 20, action: handleLogout }

    ]


    return (
        <>
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-24 items-center justify-between">

                        {/* Logo */}
                        <NavLink to="/" className="flex items-center">
                            <img
                                className="h-20 w-auto object-contain"
                                src={Logo}
                                alt="RecruitEase"
                            />
                            <span className="hidden md:block text-black text-2xl">
                                Recruit<span className="text-[#0F6E56]">Ease</span>
                            </span>
                        </NavLink>

                        {/* Nav Links - fixed center */}
                        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center">
                            <div className="flex space-x-2">
                                <NavLink to="/" className="text-gray-600 hover:text-black rounded-md px-3 py-2">
                                    Home
                                </NavLink>
                                <NavLink to="/jobs" className="text-gray-600 hover:text-black rounded-md px-3 py-2">
                                    Jobs
                                </NavLink>
                                <NavLink to="/mentors" className="text-gray-600 hover:text-black rounded-md px-3 py-2">
                                    Mentors
                                </NavLink>
                                <NavLink to="/about" className="text-gray-600 hover:text-black rounded-md px-3 py-2">
                                    About
                                </NavLink>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 ml-8">
                            {currentUser ? (
                                <>
                                    <div className="relative inline-block">

                                        {/* Trigger */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowDropdown((prevState) => !prevState);
                                            }}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <span className="text-[#0F6E56] font-medium">
                                                {currentUser?.display_name}
                                            </span>

                                            <FaChevronDown
                                                className={`text-gray-500 transition-transform duration-300 ${showDropdown ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>

                                        {/* Dropdown */}
                                        <div
                                            className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 transition-all duration-200 ease-out origin-top 
                                                    ${showDropdown
                                                    ? "opacity-100 scale-100 translate-y-0"
                                                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                                                }`}
                                        >
                                            <ul className="py-2">
                                                {dropdown.map((item, index) => {
                                                    const Icon = item.icon; // Defined variable from dropdown object

                                                    const handleClick = () => {
                                                        if (item.to) {
                                                            navigate(item.to);
                                                        } else if (item.action) {
                                                            item.action();
                                                        }
                                                        setShowDropdown(false)
                                                    }

                                                    return (
                                                        <li
                                                            key={index}
                                                            onClick={handleClick}
                                                            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                                                        >
                                                            <Icon size={item.size} className="text-[#0F6E56]" />
                                                            <span>{item.label}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        to="/auth/login"
                                        className="bg-[#0F6E56] rounded-3xl px-8 py-3  text-white text-sm  hover:shadow-md transition-shadow"
                                    >
                                        Sign In
                                    </NavLink>

                                </>
                            )}
                        </div>

                    </div>
                </div>
            </nav >
        </>
    )
}

export default Navbar