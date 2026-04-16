import supabase from '../utils/supabaseClient'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useLoaderData } from 'react-router-dom'
import { FaChevronLeft, FaMapMarker, FaCircle, FaChevronDown } from 'react-icons/fa';
import ApplyModal from '../components/ApplyModal';
import useCourses from '../hooks/useCourses';

const JobPage = () => {
    const { id } = useParams();
    const job = useLoaderData(); // useLoaderData is the jobLoader
    const { courses } = useCourses(id);
    const [showModal, setShowModal] = useState(false);
    const [showLearnDropdown, setShowLearnDropdown] = useState(false);




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
                                            onClick={() => setShowModal(true)}
                                            className="bg-white text-black border py-2 px-6 rounded-full hover:shadow-md transition-shadow cursor-pointer"
                                        >
                                            Apply Now
                                        </button>

                                        {showModal && ( // Only shows true no need a false signature
                                            <ApplyModal setShowModal={setShowModal} job={job}/>
                                        )}

                                    </div>

                                    <h1 className='text-3xl font-bold mb-3'>{job.title}</h1>
                                    <div className='flex items-center'>
                                        <FaMapMarker className='text-[#378ADD] mr-1 -mt-1' />
                                        <p className='text-[#378ADD]'>{job.companies?.location}</p>
                                    </div>
                                </div>

                                <div className='bg-white p-6 rounded-lg border shadow-md mt-6'>

                                    {/* Company Profile */}
                                    <div className='flex gap-2'>
                                        <FaCircle className='text-gray-200 w-10 h-auto -mt-2' />
                                        <h2 className='text-lg'>{job.companies?.name}</h2>
                                    </div>

                                    <h3 className='text-[#0d624d] text-lg font-bold mt-6 mb-6'>
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
        .select(`*,
        companies (
            name,
            description,
            contact_email,
            contact_phone,
            location
        )`)
        .eq('id', params.id)
        .single()

    if (error) throw new Error(error.message);

    return data
};


export { JobPage as default, jobLoader };