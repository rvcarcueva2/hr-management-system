import React from 'react'


const JobCategoryCard = ({ icon: Icon, label, openings }) => { // Props from JobCategories
    return (


        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-6 w-full sm:w-[calc(25%-1rem)] h-20 cursor-pointer hover:shadow-md transition-shadow">

            {/* Icon + Label */}
            <div className=" flex items-center gap-4">
                <div className="w-12 h-12  rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#0d624d]" />
                </div>
                <div>
                    <p className="text-base font-semibold text-gray-900">{label}</p>
                    <p className="text-sm text-gray-500">
                        {openings} open positions
                    </p>
                </div>
            </div>

        </div>


    )
}

export default JobCategoryCard