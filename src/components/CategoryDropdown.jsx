import { useState } from 'react'
import { FaLayerGroup, } from 'react-icons/fa'

const CategoryDropdown = ({ selectedCategory, setSelectedCategory }) => { //useState for JobListings.jsx

    const [showDropdown, setShowDropdown] = useState(false);

    const categories = [
        'All Categories',
        'Technology',
        'Design',
        'Human Resources',
        'Bussiness Management',
        'Technical Support',
        'Leadership',
        'Data & Analytics',
        'Knowledge & Development',
    ]

    const listClass = (category) => {
        return selectedCategory === category
            ? 'bg-gray-100 text-black'
            : 'text-gray-700';
    };


    return (
        <>
            {/* 
                <button
                    onClick={() => setShowDropdown((prevState) => (!prevState))}
                    className='border border-gray-300  rounded-lg px-3 py-2 '>
                    <FaLayerGroup className=' w-4 h-5 text-[#0d624d] ' />

                    {showDropdown ? (
                        categories.map((category, index) => (
                            <ul>
                                <li key={index}>{category}</li>
                            </ul>
                        ))) : (
                        ''
                    )}
                    <button/>
                    
                    */}

            <div className="relative inline-block ">

                {/* Button */}
                <button
                    onClick={() => setShowDropdown((prevState) => (!prevState))}
                    className="border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
                >
                    <FaLayerGroup className="w-4 h-4 text-[#0d624d]" />
                </button>

                {/* Dropdown */}
                <div
                    className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 transition-all duration-200 ease-out origin-top
                    ${showDropdown
                            ? 'opacity-100 scale-100 translate-y-0'
                            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                        }`}
                >
                    <ul className="py-2">
                         
                        {/* Categories */}
                        {categories.map((category, index) => (
                            <li
                                key={index}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 text-sm cursor-pointer transition hover:bg-gray-100 ${listClass(category)}`}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </>
    )
}

export default CategoryDropdown