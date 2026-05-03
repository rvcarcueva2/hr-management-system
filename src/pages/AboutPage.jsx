import { useEffect } from "react";
import Image from '../assets/images/about-image.png'
import Dev from '../assets/images/about-dev-image.png'
import { IoIosDocument } from "react-icons/io";
import { LuListChecks } from "react-icons/lu";
import { MdDashboard } from "react-icons/md";
import { MdAccountTree } from "react-icons/md";
import { IoCalendar } from "react-icons/io5";
import { RiRobot2Fill } from "react-icons/ri";
import Reveal from '@/components/Reveal';





const AboutPage = () => {
    useEffect(() => {
        document.title = 'About | RecruitEase'
    }, []);

    return (
        <>
            <Reveal animation="animate-fade-in-down">

                <section className="bg-white flex h-120 py-20 px-30 ">
                    <div className="max-w-xl  m-auto px-10 ">
                        <p className='text-4xl font-bold mb-2'>Empowering careers</p>
                        <p>
                            RecruitEase is built on a simple belief: <strong>"If the plant is big enough to hold in a small pot, place it to a bigger and better pot"</strong>.
                        </p>
                        <p>
                            This application help organizations unlock internal talent, streamline hiring workflows, and give every employee a clear path forward.
                        </p>
                    </div>
                    <div className="max-w-xl  m-auto px-10 ">
                        <img
                            src={Image}
                            alt="hero-image"
                            className="w-100 scale-200 -mt-12 "
                        />
                    </div>
                </section>

            </Reveal>


            <section className="min-h-200 py-10 ">
                <div className="max-w-8xl  my-10 mx-auto px-20 text-center ">
                    <Reveal animation="animate-fade-in-up">

                        <p className='text-4xl font-bold mb-2 '>My product</p>
                    </Reveal>
                    <Reveal animation="animate-fade-in-up">
                        <p>
                            RecruitEase brings your internal hiring process into one place.
                        </p>
                    </Reveal>
                    <div className='flex flex-row justify-evenly flex-wrap mt-10 '>
                        <Reveal animation="animate-slide-in-bottom">
                            <div className="bg-white shadow-md rounded-lg w-100 h-75 mb-10 p-4 ">
                                <IoIosDocument className=' border p-4 text-[70px] bg-green-700/10 text-[#0d624d] border-green-300 rounded-xl mt-10 mx-4' />
                                <p className='mt-6 mx-4 text-start text-xl font-bold'>Applications Management</p>
                                <p className='mt-2 mx-4 text-start'>Process and monitor employee applications in real time.</p>
                            </div>
                        </Reveal>
                        <Reveal animation="animate-slide-in-bottom">
                            <div className="bg-white shadow-md rounded-lg w-100 h-75 mb-10 p-4 ">
                                <LuListChecks className=' border p-4 text-[70px]  bg-green-700/10 text-[#0d624d] border-green-300 rounded-xl mt-10 mx-4' />
                                <p className='mt-6 mx-4 text-start text-xl font-bold'>Jobs and Mentorships Posting</p>
                                <p className='mt-2 mx-4 text-start'>Publish internal openings and reach the right people.</p>
                            </div>
                        </Reveal>
                        <Reveal animation="animate-slide-in-bottom">

                            <div className="bg-white shadow-md rounded-lg w-100 h-75 mb-10 p-4 ">
                                <MdDashboard className=' border p-4 text-[70px]  bg-green-700/10 text-[#0d624d] border-green-300 rounded-xl mt-10 mx-4' />
                                <p className='mt-6 mx-4 text-start text-xl font-bold'>Dashboard</p>
                                <p className='mt-2 mx-4 text-start'>Review trends and insights for better decision-making.</p>
                            </div>
                        </Reveal>
                        <Reveal animation="animate-slide-in-bottom">
                            <div className="bg-white shadow-md rounded-lg w-100 h-75 mb-10 p-4 ">
                                <IoCalendar className=' border p-4 text-[70px]  bg-green-700/10 text-[#0d624d] border-green-300 rounded-xl mt-10 mx-4' />
                                <p className='mt-6 mx-4 text-start text-xl font-bold'>Calendar</p>
                                <p className='mt-2 mx-4 text-start'>View and manage interview schedules with ease.</p>
                            </div>
                        </Reveal>
                        <Reveal animation="animate-slide-in-bottom">
                            <div className="bg-white shadow-md rounded-lg w-100 h-75 mb-10 p-4 ">
                                <MdAccountTree className=' border p-4 text-[70px]  bg-green-700/10 text-[#0d624d] border-green-300 rounded-xl mt-10 mx-4' />
                                <p className='mt-6 mx-4 text-start text-xl font-bold'>Access Control</p>
                                <p className='mt-2 mx-4 text-start'>Control roles, permissions, and access with confidence.</p>
                            </div>
                        </Reveal>
                        <Reveal animation="animate-slide-in-bottom">
                            <div className="bg-white shadow-md rounded-lg w-100 h-75 mb-10 p-4 ">
                                <RiRobot2Fill className=' border p-4 text-[70px]  bg-green-700/10 text-[#0d624d] border-green-300 rounded-xl mt-10 mx-4' />
                                <p className='mt-6 mx-4 text-start text-xl font-bold'>AI Assistant</p>
                                <p className='mt-2 mx-4 text-start'>Ask questions to our friendly and AI assistant Rex!</p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>
            <section className=" h-100  px-30 ">
                <div className='flex px-6 py-10  '>
                    <div className="max-w-xl  m-auto px-10 ">
                        <Reveal animation="animate-slide-in-left">
                            <p className='text-3xl text-center mb-2 font-bold text-[#0d624d]'>Mission</p>
                            <p className='text-justify'>
                                RecruitEase, believe that career growth shouldn't require leaving your organization. Internal mobility is one of the most underutilized drivers of employee satisfaction and retention.
                                RecruitEase is designed from the ground up to give employees the visibility, tools, and support they need to evolve within the company they already call home.
                            </p>
                        </Reveal>
                    </div>
                    <Reveal animation="animate-slide-in-right">
                        <div className="max-w-xl  m-auto px-10 ">
                            <p className='text-3xl text-center mb-2 font-bold text-[#0d624d]'>Vision</p>
                            <p className='text-justify'>
                                RecruitEase envision a future where no employee feels they have to look outside to grow. By connecting people with opportunities, mentors, and resources already within their organization,
                                RecruitEase helps companies build cultures of continuous development, reducing turnover, increasing engagement, and recognizing the full potential of every individual on the team.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>
            <Reveal animation="animate-fade-in-up">

                <section className=" max-w-7xl h-100 py-20 mb-30 rounded-xl bg-white shadow-md relative mx-auto">
                    <div className=" my-10 mx-auto px-10">

                        <div className="flex items-center justify-between ">

                            <div className="shrink-0 m-auto">
                                <img
                                    src={Dev}
                                    alt="hero-image"
                                    className="w-100 scale-190 -mt-12 "
                                />
                            </div>
                            <div className="max-w-lg m-auto ">
                                <h1 className="text-4xl -mt-14 font-extrabold text-black">
                                    The dev behind the project
                                </h1>
                                <p className="mt-4 text-lg text-gray-600 font-medium">

                                </p>
                                <p className="mt-4 text-lg text-gray-600 font-medium">
                                    Meet Reycel John Emmanuel Carcueva, an aspiring Software Engineer with a goal of making people work with <span className='text-[#0d624d] font-bold'>Ease</span> trough his applications.
                                </p>
                            </div>
                        </div>
                    </div>
                </section >
            </Reveal>
        </>
    )
}

export default AboutPage