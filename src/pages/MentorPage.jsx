import supabase from '../utils/supabaseClient'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useLoaderData } from 'react-router-dom'
import { FaChevronLeft, FaMapMarker, FaCircle, FaChevronDown } from 'react-icons/fa';
import { FaLightbulb } from "react-icons/fa6";
import { FaRegCircleCheck } from "react-icons/fa6";
import ApplyModal from '../components/ApplyModal';
import useCourses from '../hooks/useCourses';
import EnrollModal from '@/components/EnrollModal';
import AvatarUpload from "../components/AvatarUpload";

const MentorPage = () => {
    const { id } = useParams();
    const program = useLoaderData(); // useLoaderData is the programLoader
    const [showModal, setShowModal] = useState(false);
    const [showLearnDropdown, setShowLearnDropdown] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);

    // const [isEnrolled, setIsEnrolled] = useState(false);
    // useEffect(() => {
    //     const checkEnrollment = async () => {
    //         const { data: { session } } = await supabase.auth.getSession()
    //         const userId = session?.user?.id


    //         const { data } = await supabase
    //             .from("enrollees")
    //             .select("id")
    //             .eq("user_id", userId)
    //             .in("course_id", courseIds)
    //             .limit(1)

    //         if (data && data.length > 0) setIsEnrolled(true)
    //     }

    //     checkEnrollment()
    // }, [courses]) // runs whenever courses load

    const mentorName = program.mentor?.display_name || 'Mentor';
    const avatarUrl = program.mentor?.avatar_url;

    // const [hasApplied, setHasApplied] = useState(false);
    // useEffect(() => {
    //     const checkApplication = async () => {
    //         const { data: { session } } = await supabase.auth.getSession()
    //         const userId = session?.user?.id
    //         if (!userId) return

    //         const { data } = await supabase
    //             .from("applications")
    //             .select("id")
    //             .eq("user_id", userId)
    //             .eq("job_id", id)
    //             .limit(1)

    //         if (data && data.length > 0) setHasApplied(true)
    //     }

    //     checkApplication()
    // }, [id])

    return (
        <>
            <div className='max-w-6xl mx-auto min-h-screen'>
                <section>
                    <div className=' container mt-6 py-6 px-6 '>
                        <Link
                            to='/mentors'
                            className='text-[#378ADD] hover:text-[#6baef1] flex items-center group'
                        >
                            <FaChevronLeft className='mr-2 transition-transform duration-300  group-hover:-translate-x-1' />
                            Back to Mentor Listings
                        </Link>
                    </div>
                </section>

                <section>
                    <div className='container m-auto py-10 px-6'>
                        <div className='grid grid-cols-1 md:grid-cols-1 w-full gap-6'>
                            <main>
                                <div className='p-8  w-full'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <div className='text-gray-500'>{program.type}</div>

                                        <button
                                            className="border py-3 px-6 rounded-full transition-shadow cursor-pointer"
                                        > <span className="flex items-center gap-2">
                                                {/* <FaRegCircleCheck className='text-[17px]' /> Applied */}
                                                Apply Now
                                            </span>
                                        </button>

                                        {/* {showModal && (
                                            <ApplyModal
                                                setShowModal={setShowModal}
                                                job={job}
                                                onApplySuccess={() => setHasApplied(true)}  //  update instantly on success
                                            />
                                        )} */}

                                    </div>

                                    <h1 className='text-3xl font-bold mb-3'>{program.title}</h1>
                                    <div className='flex items-center'>
                                        <FaLightbulb className='text-[#8b5033] mr-1 -mt-1' />
                                        <p className='text-[#8b5033]'>{program.topic}</p>
                                    </div>
                                </div>

                                <div className='bg-white p-6 rounded-lg border shadow-md mt-6'>

                                    <div className="flex items-center mb-6 ">
                                        {/*  Mentor Avatar */}
                                        <span className='ml-6'>

                                            <AvatarUpload
                                                userId={program.mentor?.id}
                                                isViewOnly
                                                avatarUrl={avatarUrl}
                                                alt={mentorName}
                                                wrapperClassName="w-auto"
                                                className="w-14 h-14 border  "
                                            />
                                        </span>
                                        <div className='block'>

                                            <h3 className='text-lg font-bold'>
                                                {program.mentor?.display_name}
                                            </h3>
                                            <h3 className='text-[#0d624d] text-sm '>
                                                {program.mentor?.job?.title}
                                            </h3>
                                        </div>
                                    </div>


                                    <p className='mb-4'>{program.description}</p>

                                    <h3 className='text-[#0d624d] text-lg font-bold mb-2'>
                                        Program Duration
                                    </h3>

                                    <p className='mb-4'>{program.start_date} </p>

                                </div>


                            </main>
                        </div>
                    </div >
                </section >
            </div >
        </>
    );
};

const programLoader = async ({ params }) => {
    const { data, error } = await supabase
        .from('programs')
        .select(`*,
            mentor:users!programs_mentor_fkey (
                id,
                display_name,
                avatar_url,
                job:jobs!users_job_id_fkey (
                    title
                )
            )
        `)
        .eq('id', params.id)
        .single()

    if (error) throw new Error(error.message);

    return data
};


export { MentorPage as default, programLoader };