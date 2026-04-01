import React from 'react'
import { Link } from 'react-router-dom'

const JobType = ({ setSelectedType }) => {

    const type = [
        'All Types',
        'On-site',
        'Remote',
        'Hybrid'
    ]
    return (
        <>
            {type.map((type, index) => (

                <Link
                    key={index}
                    onClick={() => setSelectedType(type)}
                    className="bg-gray-100 hover:bg-gray-50 rounded-3xl px-3 py-1 border border-gray-300">
                    <p className="text-sm">{type}</p>
                </Link>

            ))}


        </>
    )
}

export default JobType