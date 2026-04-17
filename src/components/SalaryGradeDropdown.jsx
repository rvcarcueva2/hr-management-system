import { useState } from 'react'
import { TbBinaryTree2Filled } from "react-icons/tb";



const SalaryGradeDropdown = ({ selectedSalaryGrade, setSelectedSalaryGrade }) => {

    const [showDropdown, setShowDropdown] = useState(false)

    const listClass = (salary) => {
        return selectedSalaryGrade === salary
            ? 'bg-gray-100 text-black'
            : 'text-gray-700';
    };

    const salaries = [
        "All Salary Grades",
        "SG 25",
        "SG 26",
        "SG 27",
        "SG 28",
        "SG 29"
    ]
    return (
        <>
            <div className="relative inline-block ">

                {/* Button */}
                <button
                    onClick={() => setShowDropdown((prevState) => (!prevState))}
                    className="border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 hover:shadow-sm cursor-pointer"
                >
                    <TbBinaryTree2Filled className="w-4 h-4 text-gray-600" />
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

                        {/* Salary Grades */}
                        {salaries.map((salary, index) => (
                            <li
                                key={index}
                                onClick={() => setSelectedSalaryGrade(salary)}
                                className={`px-4 py-2 text-sm cursor-pointer transition hover:bg-gray-100 ${listClass(salary)}`}
                            >
                                {salary}
                            </li>

                        ))}

                    </ul>
                </div>

            </div>
        </>
    )
}

export default SalaryGradeDropdown