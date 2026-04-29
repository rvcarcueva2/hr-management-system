import supabase from '../utils/supabaseClient'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useLoaderData } from 'react-router-dom'
import { FaChevronLeft} from 'react-icons/fa';
import { FaLightbulb } from "react-icons/fa6";
import { FaRegCircleCheck } from "react-icons/fa6";
import AvatarUpload from "../components/AvatarUpload";
import ApplyApprenticeModal from '@/components/ApplyApprenticeModal';
import useApprentice from '@/hooks/useApprentice';

const MentorPage = () => {
    const { id } = useParams();
    const program = useLoaderData(); // useLoaderData is the programLoader
    const [showModal, setShowModal] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const { fetchApprentice } = useApprentice();


    const mentorName = program.mentor?.display_name || 'Mentor';
    const avatarUrl = program.mentor?.avatar_url;

    useEffect(() => {
        const checkApplication = async () => {
            const data = await fetchApprentice();
            const applied = data?.some((item) => item?.program?.id === program?.id);
            setHasApplied(Boolean(applied));
        };

        checkApplication();
    }, [fetchApprentice, program?.id]);

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
                                            <ApplyApprenticeModal
                                                setShowModal={setShowModal}
                                                program={program}
                                                onApplySuccess={() => setHasApplied(true)}  //  update instantly on success
                                            />
                                        )}

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

                                    <p>
                                        {new Date(program.start_date).toLocaleString('en-US', {
                                            timeZone: 'Asia/Taipei',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',


                                        })}
                                        <span> - </span>
                                        {new Date(program.end_date).toLocaleString('en-US', {
                                            timeZone: 'Asia/Taipei',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',


                                        })}
                                    </p>
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