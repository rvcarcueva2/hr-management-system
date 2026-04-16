import React from 'react'
import { FaFacebookSquare } from "react-icons/fa";
import { PiInstagramLogoFill } from "react-icons/pi";
import { BsLinkedin } from "react-icons/bs";
import useUsers from '../hooks/useUsers';
import AvatarUpload from './AvatarUpload';
import Spinner from "./Spinner";


const ProfileForm = () => {

    const { user, loading } = useUsers();


    const icon = [
        { icon: FaFacebookSquare, size: 20 },
        { icon: PiInstagramLogoFill, size: 20 },
        { icon: BsLinkedin, size: 19 }
    ]

    return (
        <>
            {loading ? (
                <Spinner loading={loading} />

            ) : (
                <div className="w-full max-w-3xl my-6 ">


                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Profile
                    </h1>

                    <div className="p-6 m-auto mb-4 w-full bg-white border rounded-lg shadow-md">
                        <form className="flex flex-col md:flex-row gap-14 items-start">

                            <AvatarUpload />


                            <div className="w-full md:w-2/3 space-y-5">
                                <div className='my-5'>

                                    <p className="block text-xl font-semibold mb-1">{user?.display_name}</p>
                                </div>
                                <div>

                                    <p className="block text-md text-gray-600 font-medium mb-1">
                                        {user?.bio}
                                    </p>

                                </div>

                                <ul className='flex gap-2'>

                                    {icon.map((item, index) => {
                                        const Icon = item.icon
                                        return (

                                            <li key={index} className='border rounded-full p-2'><Icon size={item.size} className='text-gray-600' /> </li>)
                                    })
                                    }
                                </ul>

                            </div>
                        </form>
                    </div>




                    <div className="px-6 py-6 w-full bg-white border rounded-lg shadow-md mt-6">

                        {/* Personal Information */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Personal Information
                        </h2>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-base font-medium text-gray-800">
                                    {user?.email}
                                </p>
                            </div>


                            <div>
                                <p className="text-sm text-gray-500">Employee ID</p>
                                <p className="text-base font-medium text-gray-800">
                                    {user?.employee_id}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-base font-medium text-gray-800">
                                    {user?.phone}
                                </p>
                            </div>


                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="text-base font-medium text-gray-800">
                                    {user?.address}
                                </p>
                            </div>
                        </div>

                        {/* Job Position */}
                        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
                            Company Position
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Department</p>
                                <p className="text-base font-medium text-gray-800">
                                    {user?.department?.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Role</p>
                                <p className="text-base font-medium text-gray-800">
                                    {user?.job?.title}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Supervisor</p>
                                <p className="text-base font-medium text-gray-800">
                                    {user?.department?.supervisor?.display_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Site</p>
                                <p className="text-base font-medium text-gray-800">
                                    {user?.job?.company?.location}
                                </p>
                            </div>

                        </div>
                    </div>
                </div >
            )}

        </>
    )
}

export default ProfileForm