import { useState } from 'react'
import { FaBuilding } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { BsLinkedin } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { AiFillInfoCircle } from "react-icons/ai";
import { FaUserGraduate } from "react-icons/fa";
import AvatarUpload from './AvatarUpload';
import { useParams } from 'react-router-dom'
import useEnrollees from "../hooks/useEnrollees";
import useUsers from '@/hooks/useUsers';
import CompleteModal from './CompleteModal';


const ProfileForm = ({ profile }) => {
    const { id } = useParams();
    const { user } = useUsers();
    const isOwnProfile = user?.id === id;
    const isReviewer = user?.role === 'Reviewer';
    const canViewEnrollments = isOwnProfile || isReviewer;

    const { enrollments, updateCompleted } = useEnrollees(id || null)

    const [openJobs, setOpenJobs] = useState({});

    const icon = [
        { icon: BsLinkedin, size: 18 },
        { icon: IoMdMail, size: 20, link: `mailto:${profile?.email}` }
    ]

    const toggleJob = (jobId) => {
        setOpenJobs((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
    };

    const getCompletion = (courses) => {
        if (!courses.length) return 0;
        const done = courses.filter((c) => c.completed).length;
        return Math.round((done / courses.length) * 100);
    };

    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [selectedEnrolleeId, setSelectedEnrolleeId] = useState(null);

    const isViewOnly = !!id && user?.id !== id;




    return (
        <>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 ">

                <div className="w-full my-6 lg:col-span-2">

                    <div className="p-6 m-auto mb-4 w-full h-full bg-white border rounded-lg shadow-md flex flex-col">
                        <form className="flex flex-col md:flex-row gap-14 items-start">
                            <AvatarUpload userId={id || user?.id} isViewOnly={isViewOnly} />
                            <div className="w-full space-y-5">
                                <div className='my-2'>
                                    <p className="block text-xl font-semibold mb-1">{profile?.display_name}</p>
                                </div>
                                <div>
                                    <p className="block text-md text-gray-600 font-medium mb-1">
                                        {profile?.bio}
                                    </p>
                                </div>
                                <ul className='flex gap-2'>
                                    {icon.map((item, index) => {
                                        const Icon = item.icon
                                        return (
                                            <li key={index} className='border rounded-full p-2'>
                                                <a href={item.link}>
                                                    <Icon size={item.size} className='text-gray-600' />
                                                </a>
                                            </li>
                                        )
                                    })}
                                </ul>

                            </div>
                        </form>
                        <div className="px-6 py-6 w-full mt-6">
                            {/* Personal Information */}
                            <div className='flex gap-3'>
                                <AiFillInfoCircle className='text-[22px] mt-0.5 text-[#0F6E56]' />
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Personal Information
                                </h2>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-base font-medium text-gray-800">
                                        {profile?.email}
                                    </p>
                                </div>


                                <div>
                                    <p className="text-sm text-gray-500">Employee ID</p>
                                    <p className="text-base font-medium text-gray-800">
                                        {profile?.employee_id}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="text-base font-medium text-gray-800">
                                        {profile?.address}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="text-base font-medium text-gray-800">
                                        {profile?.phone}
                                    </p>
                                </div>
                            </div>

                            {/* Job Position */}
                            <div className='flex gap-3 mt-6'>
                                <FaBuilding className='text-lg mt-1 text-[#0F6E56]' />
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Company Position
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Department</p>
                                    <p className="text-base font-medium text-gray-800">
                                        {profile?.department?.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="text-base font-medium text-gray-800">
                                        {profile?.job?.title}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Supervisor</p>
                                    <p className="text-base font-medium text-gray-800">
                                        {profile?.department?.supervisor?.display_name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Site</p>
                                    <p className="text-base font-medium text-gray-800">
                                        {profile?.job?.company?.location}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div >

                {/* Courses */}
                <div className="w-full my-6 lg:col-span-3">
                    <div className="p-6 m-auto mb-4 w-full h-full bg-white border rounded-lg shadow-md">
                        <div className="my-2 flex gap-3">
                            <FaUserGraduate className="text-lg mt-1 text-[#0F6E56]" />
                            <p className="block text-xl font-semibold mb-1">Courses Enrolled</p>
                        </div>

                        {!canViewEnrollments ? (
                            ''
                        ) : enrollments.length === 0 ? (
                            <p className="text-sm mt-4 text-gray-400">No courses enrolled yet.</p>
                        ) : (
                            enrollments.map(({ jobId, jobTitle, courses }) => {
                                const completion = getCompletion(courses);
                                const isOpen = !!openJobs[jobId];

                                return (
                                    <div key={jobId} className="bg-white p-6 rounded-lg border shadow-md my-6">
                                        {/* Header */}
                                        <div
                                            onClick={() => toggleJob(jobId)}
                                            className="flex justify-between items-center cursor-pointer"
                                        >
                                            <h3 className="text-lg font-bold">{jobTitle}</h3>
                                            <p className="text-xs text-gray-500 font-semibold text-end">
                                                {completion}% Complete
                                            </p>
                                        </div>

                                        {/* Courses dropdown */}
                                        <div
                                            className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            {courses.map((course) => (
                                                <>
                                                    <div className='flex '>

                                                        <a
                                                            key={course.courseId}
                                                            href={course.courseLink}
                                                            target="_blank"

                                                            className="flex w-119 bg-gray-50 border rounded-lg p-4 my-2 mr-3 shadow-sm hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            <p className="font-bold text-gray-800">{course.courseTitle}</p>
                                                        </a>
                                                        {course.completed ? (
                                                            <div className='m-auto '>
                                                                <FaRegCircleCheck className='text-[26px] text-green-700 pb-1' />
                                                            </div>
                                                        ) : (id && user?.role === 'Reviewer' && user?.id !== id) ? (
                                                            <button
                                                                disabled
                                                                className='m-auto w-40 text-center cursor-default'>
                                                                <p className="text-xs font-bold text-gray-500">Not Completed</p>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedEnrolleeId(course.enrollmentId);
                                                                    setShowCompleteModal(true);
                                                                }}
                                                                className='m-auto w-40 text-center'>
                                                                <p className="text-xs font-bold text-gray-500 hover:text-gray-600 cursor-pointer">Mark as Complete</p>
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            ))}
                                        </div>
                                    </div >
                                );
                            })
                        )}
                        {showCompleteModal &&
                            <CompleteModal
                                setShowCompleteModal={setShowCompleteModal}
                                enrolleeId={selectedEnrolleeId}
                                updateCompleted={updateCompleted}
                            />
                        }
                    </div>
                </div>

            </div>

        </>
    )
}

export default ProfileForm