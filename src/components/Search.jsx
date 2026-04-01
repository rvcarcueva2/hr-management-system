import { useState } from 'react'
import { FaSearch } from "react-icons/fa"
import CategoryDropdown from './CategoryDropdown'
import useJobs from '../hooks/useJobs'

const Search = ({search, setSearch}) => {

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}
                className="ml-auto flex items-center border border-gray-300 rounded-lg w-80 max-w-md">
                <button
                    type="submit"
                    className="px-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    <FaSearch className="w-4 h-4" />
                </button>
                <input
                    type="text"
                    placeholder="Search jobs..."
                    className="flex-1 px-1 py-2 text-sm text-gray-800 bg-transparent outline-none"
                    value = {search}
                    onChange={(e)=> setSearch(e.target.value)}
                />
            </form>



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

        </>
    )
}

export default Search