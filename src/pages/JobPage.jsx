import supabase from '../utils/supabaseClient'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useLoaderData } from 'react-router-dom'
import { FaChevronLeft, FaMapMarker, FaCircle, FaChevronDown } from 'react-icons/fa';
import { FaRegCircleCheck } from "react-icons/fa6";
import ApplyModal from '../components/ApplyModal';
import useCourses from '../hooks/useCourses';
import EnrollModal from '@/components/EnrollModal';

const JobPage = () => {
    const { id } = useParams();
    const job = useLoaderData(); // useLoaderData is the jobLoader
    const { courses } = useCourses(id);
    const [showModal, setShowModal] = useState(false);
    const [showLearnDropdown, setShowLearnDropdown] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);

    const [isEnrolled, setIsEnrolled] = useState(false);
    useEffect(() => {
        const checkEnrollment = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const userId = session?.user?.id
            if (!userId || !courses.length) return

            const courseIds = courses.map(c => c.id)

            const { data } = await supabase
                .from("enrollees")
                .select("id")
                .eq("user_id", userId)
                .in("course_id", courseIds)
                .limit(1)

            if (data && data.length > 0) setIsEnrolled(true)
        }

        checkEnrollment()
    }, [courses]) // runs whenever courses load

    const [hasApplied, setHasApplied] = useState(false);
    useEffect(() => {
        const checkApplication = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const userId = session?.user?.id
            if (!userId) return

            const { data } = await supabase
                .from("applications")
                .select("id")
                .eq("user_id", userId)
                .eq("job_id", id)
                .limit(1)

            if (data && data.length > 0) setHasApplied(true)
        }

        checkApplication()
    }, [id])

    return (
        <>
            <div className='max-w-6xl mx-auto min-h-screen'>
                <section>
                    <div className=' container mt-6 py-6 px-6 '>
                        <Link
                            to='/jobs'
                            className='text-[#378ADD] hover:text-[#6baef1] flex items-center group'
                        >
                            <FaChevronLeft className='mr-2 transition-transform duration-300  group-hover:-translate-x-1' />
                            Back to Job Listings
                        </Link>
                    </div>
                </section>

                <section>
                    <div className='container m-auto py-10 px-6'>
                        <div className='grid grid-cols-1 md:grid-cols-1 w-full gap-6'>
                            <main>
                                <div className='p-8  w-full'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <div className='text-gray-500'>{job.type}</div>

                                        <button
                                            onClick={() => !hasApplied && setShowModal(true)}
                                            className={`border py-3 px-6 rounded-full transition-shadow
                                                ${hasApplied
                                                    ? "bg-white text-[#0d624d] cursor-default"
                                                    : "bg-white hover:shadow-md cursor-pointer"
                                                }`}
                                            disabled={hasApplied}
                                        >
                                            {hasApplied ? (
                                                <span className="flex items-center gap-2">
                                                    <FaRegCircleCheck className='text-[17px]' /> Applied
                                                </span>
                                            ) : "Apply Now"}
                                        </button>

                                        {showModal && (
                                            <ApplyModal
                                                setShowModal={setShowModal}
                                                job={job}
                                                onApplySuccess={() => setHasApplied(true)}  //  update instantly on success
                                            />
                                        )}

                                    </div>

                                    <h1 className='text-3xl font-bold mb-3'>{job.title}</h1>
                                    <div className='flex items-center'>
                                        <FaMapMarker className='text-[#8b5033] mr-1 -mt-1' />
                                        <p className='text-[#8b5033]'>{job.site}</p>
                                    </div>
                                </div>

                                <div className='bg-white p-6 rounded-lg border shadow-md mt-6'>

                                    
                                    <h3 className='text-[#0d624d] text-lg font-bold  mb-6'>
                                        Job Description
                                    </h3>

                                    <p className='mb-4'>{job.description}</p>

                                    <h3 className='text-[#0d624d] text-lg font-bold mb-2'>
                                        Salary
                                    </h3>

                                    <p className='mb-4'>{job.salary} </p>

                                </div>

                                {/* Learning Path */}
                                <div className="bg-white p-6 rounded-lg border shadow-md my-6 ">

                                    {/* Header */}
                                    <div
                                        onClick={() => setShowLearnDropdown((prev) => !prev)}
                                        className="flex justify-between items-center cursor-pointer"
                                    >
                                        <h3 className="text-[#0d624d] text-lg font-bold">
                                            Learning Path
                                        </h3>

                                        <FaChevronDown
                                            className={`text-gray-500 transition-transform duration-300 ${showLearnDropdown ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>

                                    {/* Animated Content */}
                                    <div
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${showLearnDropdown ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        {/*  Inner Course Card */}

                                        {courses.map(course => (
                                            <div key={course.id}>
                                                {
                                                    <>
                                                        <Link to={course.course_link} target="_blank" className='text-lg'>
                                                            <div className="bg-gray-50 border rounded-lg p-4 my-2 shadow-sm hover:bg-gray-100 ">

                                                                <h1 className='font-bold text-gray-800'>{course.title}</h1>
                                                                <p className='text-sm text-gray-500'>{course.description}</p>

                                                            </div>
                                                        </Link>
                                                    </>
                                                }

                                            </div>
                                        ))}
                                        <div className="text-end mt-6 mb-2">

                                            {/* <button
                                                onClick={() => !isEnrolled && setShowEnrollModal(true)}
                                                className="bg-[#378ADD] text-white border py-3 px-5 rounded-full hover:shadow-md transition-shadow cursor-pointer text-sm"
                                            >
                                               {isEnrolled ? "Enrolled" : "Enroll Course"}
                                            </button> */}

                                            {isEnrolled ? (
                                                <span className="flex items-center justify-end gap-2 text-[#0d624d] font-medium">
                                                    <FaRegCircleCheck className="text-md" /> Enrolled
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => setShowEnrollModal(true)}
                                                    className="bg-[#0d624d] text-white border py-3 px-5 rounded-full hover:shadow-md transition-shadow cursor-pointer text-sm"
                                                >
                                                    Enroll Course
                                                </button>
                                            )}

                                        </div>
                                        {showEnrollModal && (
                                            <EnrollModal
                                                setShowEnrollModal={setShowEnrollModal}
                                                courses={courses}
                                                jobTitle={job.title}
                                                onEnrollSuccess={() => setIsEnrolled(true)}
                                            />
                                        )}

                                    </div>

                                </div>
                            </main>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

const jobLoader = async ({ params }) => {
    const { data, error } = await supabase
        .from('jobs')
        .select(`*`)
        .eq('id', params.id)
        .single()

    if (error) throw new Error(error.message);

    return data
};


export { JobPage as default, jobLoader };