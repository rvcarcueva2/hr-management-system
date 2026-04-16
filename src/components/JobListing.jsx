import { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaMapMarker } from 'react-icons/fa'


const JobListing = ({ job }) => {

    const [showFullDescription] = useState(false);

    let description = job.description;

    if(!showFullDescription){
        description = description.substring(0,100) + '...'
    }

    return (
        <>
            {/* <!-- Job Listing  --> */}
            <div className="bg-white rounded-xl shadow-md relative">
                <div className="p-4">
                    <div className="mb-6">
                        <div className="text-gray-600 my-2">{job.type}</div>
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        <p className='my-2 text-sm text-[#378ADD]'>{job.category}</p>
                    </div>

                    <div className="mb-5">
                        {description}
                    </div>
                    
                    <h3 className="text-[#0d624d] mb-2">{job.salary}</h3>

                    <div className="border border-gray-100 mb-5"></div>

                    <div className="flex flex-col lg:flex-row justify-between mb-4">
                        <div className="text-[#378ADD] mb-3 flex">
                            <FaMapMarker className='mx-2' />
                            <p className='-mt-0.5'>{job.companies?.location}</p>
                        </div>
                        <Link
                            to={`/jobs/${job.id}`}
                            className="h-9 bg-white border text-black px-4 py-2 rounded-lg text-center text-sm hover:shadow-md transition-shadow"
                        >
                            Read More
                        </Link>
                    </div>
                </div>
            </div>

        </>
    )
}

export default JobListing