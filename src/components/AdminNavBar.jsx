import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { MdOutlineLogout } from "react-icons/md";
import { RiNotification3Line } from "react-icons/ri";



const AdminNavBar = () => {

    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [showDropdown, setShowDropdown] = useState(false)

    const handleLogout = async () => {
        const success = await logout();

        if (!success) return;

        navigate("/auth/login");
    };

    const dropdown = [ // Data-driven UI approach,
        { label: "Logout", icon: MdOutlineLogout, size: 20 }

    ]


    return (
        <>
            <nav className="font-geist bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex flex-1 mr-8 items-center justify-end md:items-stretch md:justify-end">
                            <div className="md:ml-auto flex items-center gap-4">
                                <div className="border rounded-full p-3 green-600/20 cursor-pointer"> 

                                <RiNotification3Line className="text-xl text-[#378ADD]"/>
                                </div>

                                <div className="relative inline-block text-left">
                                    {/* Trigger */}
                                    <div
                                        onClick={() => setShowDropdown(prev => !prev)}
                                        className="bg-gray-400 rounded-full w-10 h-10 cursor-pointer hover:shadow-md"
                                    />

                                    {/* Dropdown */}
                                    <div
                                        className={`absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 transition-all duration-200 ease-out origin-top
                                            ${showDropdown
                                                ? "opacity-100 scale-100 translate-y-0"
                                                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                                            }`}
                                    >
                                        <div className="p-3 border-b">
                                            <p className="text-sm font-semibold">
                                                {user?.user_metadata.display_name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user?.email}
                                            </p>
                                        </div>

                                        <ul className="py-2">
                                            {dropdown.map((item, index) => {
                                                const Icon = item.icon;

                                                return (
                                                    <li
                                                        key={index}
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition"
                                                    >
                                                        <Icon size={item.size} />
                                                        <span>{item.label}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default AdminNavBar