import { FaCalendar } from "react-icons/fa";
import AvatarUpload from "./AvatarUpload";



const MentorListing = ({ program, mentorAvatarUrl }) => {
    const description = program.description || '';
    const previewDescription = description.length > 100
        ? `${description.substring(0, 100)}...`
        : description;

    const formatMonthYear = (value) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
    };

    const startLabel = formatMonthYear(program.start_date);
    const endLabel = formatMonthYear(program.end_date);
    const dateRange = startLabel && endLabel ? `${startLabel} - ${endLabel}` : startLabel || endLabel || 'TBA';

    const mentorName = program.mentor?.display_name || 'Mentor';
    const mentorTitle = program.mentor?.job?.title || program.topic || program.type || 'Mentorship Program';
    const avatarUrl = mentorAvatarUrl || program.mentor?.avatar_url;

    return (
        <>
            {/* <!-- Job Listing  --> */}
            <div className="bg-white rounded-xl shadow-md relative ">
                <div className=" flex ">
                    <div >
                        <AvatarUpload
                            userId={program.mentor?.id}
                            isViewOnly
                            avatarUrl={avatarUrl}
                            alt={mentorName}
                            wrapperClassName="w-auto md:w-auto gap-0"
                            className="w-20 h-20 border m-4 mt-8"
                        />
                    </div>

                    <div className="p-2 mt-2 ">
                        <h1 className='font-bold text-lg'>{mentorName}</h1>
                        <h3 className="text-[#0d624d] text-sm mb-2">{mentorTitle}</h3>
                        <p className='text-sm'>{previewDescription}</p>

                    </div>


                </div>
                <div className="flex justify-between mb-4 p-3">
                    <div className='flex text-sm text-[#8b5033] p-2 gap-2 '>
                        <FaCalendar className='m-auto' />
                        <p className='mt-0.5'>
                            {dateRange}
                        </p>
                    </div>
                    <a
                        href={`/programs/${program.id}`}
                        className="h-9 bg-white border text-black px-4 py-2 rounded-lg text-center text-sm hover:shadow-md transition-shadow"
                    >
                        View Program
                    </a>
                </div>
            </div>

        </>
    )
}

export default MentorListing