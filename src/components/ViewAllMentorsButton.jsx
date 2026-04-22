import { FaChevronRight } from "react-icons/fa"

const ViewAllMentorsButton = () => {
    return (
        <>

            <section className="flex justify-end w-full -mt-4 mb-10 px-6 ">

                <a
                    href='/mentors'
                    className=' flex items-center group  bg-[#0d624d] text-white text-center py-3 px-4 rounded-xl hover:shadow-md transition-shadow'
                >
                    View All Mentors
                    <FaChevronRight className='ml-2 transition-transform duration-300  group-hover:translate-x-1' />
                </a>

            </section>
        </>
    )
}

export default ViewAllMentorsButton