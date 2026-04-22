import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FaSearch } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { RiNotification3Line } from "react-icons/ri";
import useAvatarUpload from "../hooks/useAvatarUpload";
import useNotifications from "../hooks/useNotifications";
import AvatarUpload from "./AvatarUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";



const AdminNavBar = () => {

    const { user, logout } = useAuth();
    const { avatarUrl } = useAvatarUpload();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotificaiton, setShowNotification] = useState(false);
    const { notifications, clearNotifications } = useNotifications(user?.id);
    const [hasUnread, setHasUnread] = useState(false);
    const lastSeenKey = user?.id ? `notifications_last_seen:${user.id}` : null;

    const handleLogout = async () => {
        const success = await logout();

        if (!success) return;

        navigate("/auth/login");
    };

    const dropdown = [ // Data-driven UI approach,
        { label: "Logout", icon: MdOutlineLogout, size: 20 }

    ]

    const handleNotificationOpen = (applicantName) => {
        if (!applicantName) return;
        setHasUnread(false);
        setShowNotification(false);
        navigate(`/admin/admin-applications?applicant=${encodeURIComponent(applicantName)}`);
    };

    useEffect(() => {
        if (!lastSeenKey) return;

        if (notifications.length === 0) {
            setHasUnread(false);
            return;
        }

        const latestTime = notifications.reduce((latest, item) => {
            if (!item.time) return latest;
            const current = new Date(item.time).getTime();
            if (Number.isNaN(current)) return latest;
            return Math.max(latest, current);
        }, 0);

        if (!latestTime) return;

        const lastSeenRaw = localStorage.getItem(lastSeenKey);
        const lastSeen = lastSeenRaw ? new Date(lastSeenRaw).getTime() : 0;

        setHasUnread(latestTime > lastSeen);
    }, [lastSeenKey, notifications]);

    const markNotificationsSeen = () => {
        if (!lastSeenKey) return;
        localStorage.setItem(lastSeenKey, new Date().toISOString());
        setHasUnread(false);
    };

    const formatTimeAgo = (value) => {
        if (!value) return "just now";
        const created = new Date(value);
        const diffSeconds = Math.max(0, Math.floor((Date.now() - created.getTime()) / 1000));

        if (diffSeconds < 60) return "Just Now";
        const diffMinutes = Math.floor(diffSeconds / 60);
        if (diffMinutes < 60) return `${diffMinutes} min ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours} hr ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    };

    return (
        <>
            <nav className=" bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex flex-1 mr-8 items-center justify-between md:items-stretch md:justify-between">

                            <form onSubmit={(e) => e.preventDefault()}
                                className=" flex items-center border border-gray-300 rounded-lg w-80 max-w-md">
                                <button
                                    type="submit"
                                    className="px-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <FaSearch className="w-4 h-4" />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search jobs or application..."
                                    className="flex-1 px-1 py-2 text-sm text-gray-800 bg-transparent outline-none"
                                />
                            </form>
                            <div className="md:ml-auto flex items-center gap-4">
                                {/* Notification  */}
                                <div className="relative inline-block text-left">

                                    <div
                                        onClick={() => {
                                            markNotificationsSeen();
                                            setShowNotification(prev => !prev);
                                        }}
                                        className="relative border rounded-full p-2.5 green-600/20 cursor-pointer">
                                        <RiNotification3Line className="text-xl text-[#0F6E56]" />
                                        {hasUnread && (
                                            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#378ADD]" />
                                        )}
                                    </div>

                                    <div
                                        className={`absolute right-0 px-2 py-2 mt-2 w-84 bg-white border border-gray-200 rounded-xl shadow-xl z-50 transition-all duration-200 ease-out origin-top overflow-hidden
                                            ${showNotificaiton
                                                ? "opacity-100 scale-100 translate-y-0"
                                                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                                            }`}
                                    >
                                        <div className="p-2">
                                            <p className="text-sm font-bold">Notification</p>
                                        </div>
                                        <Separator className={`mb-2`} />
                                        {notifications.length === 0 ? (
                                            <div className="px-3 py-4 text-sm text-gray-500">
                                                No notifications yet
                                            </div>
                                        ) : (
                                            notifications.map((item) => (
                                                <div
                                                    key={item.id + item.type}
                                                    className="p-3 flex gap-2 rounded-lg hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => handleNotificationOpen(item.applicantName)}
                                                >
                                                    <div className="my-0.5">
                                                        <AvatarUpload
                                                            userId={item.applicantId}
                                                            isViewOnly
                                                            className="w-8 h-8 m-auto"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm ">
                                                            {item.type === "assigned" ? "You are assigned to an application" : "You receive a new application"}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1 ">
                                                            {item.applicantName} • {formatTimeAgo(item.time)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <div className="flex mt-2 justify-center">
                                            <Button
                                                variant="outline"
                                                className={`w-full`}
                                                onClick={() => {
                                                    clearNotifications();
                                                    markNotificationsSeen();
                                                }}
                                            >
                                                Clear Notification
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative inline-block text-left">
                                    {/* User Profile */}
                                    <div

                                        onClick={() => setShowDropdown(prev => !prev)}
                                        className="bg-gray-400 rounded-full w-11 h-11 cursor-pointer hover:shadow-md"
                                    >
                                        {avatarUrl ? (<Avatar>
                                            <AvatarImage src={avatarUrl} />
                                            <AvatarFallback></AvatarFallback>
                                        </Avatar>) : (<div className="bg-gray-400 rounded-full w-11 h-11 cursor-pointer hover:shadow-md" ></div>)}
                                    </div>

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