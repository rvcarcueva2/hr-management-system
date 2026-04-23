import React from 'react'
import Image from '../assets/images/mentor-image.png'
import { Separator } from './ui/separator'

const ApplyMentor = () => {
    return (
        <>
            <section className=" h-100 py-20 my-30 rounded-xl bg-white shadow-md relative">
                <div className="max-w-7xl  my-10 mx-auto px-10">

                    <div className="flex items-center justify-between ">

                        <div className="shrink-0 m-auto">
                            <img
                                src={Image}
                                alt="hero-image"
                                className="w-100 scale-190 -mt-12 "
                            />
                        </div>
                        <div className="max-w-lg m-auto ">
                            <h1 className="text-4xl -mt-14 font-extrabold text-black">
                                Apply as a mentor now!
                            </h1>
                            <p className="mt-4 text-lg text-gray-600 font-medium">

                            </p>
                            <p className="mt-4 text-lg text-gray-600 font-medium">
                                Share your expertise, guide aspiring professionals, and be part of a community that values growth, leadership and real bussiness impact.
                            </p>
                            <button
                                className="border py-3 px-6 rounded-full mt-6 transition-shadow bg-white  hover:shadow-sm cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    Apply Now
                                </span>

                            </button>
                        </div>



                    </div>

                </div>
            </section >
        </>
    )
}

export default ApplyMentor