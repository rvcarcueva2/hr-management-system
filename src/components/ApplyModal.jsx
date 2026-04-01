import { useState } from "react"


const ApplyModal = ({ setShowModal }) => {
    const [step, setStep] = useState(1);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

            {/* Modal */}
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative">

                <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    Apply Now
                </h2>
                <p className="text-gray-500 mb-6 text-sm">
                    {step === 1 ? 'Review your information below' : 'Upload your resume and cover letter'}
                </p>

                {/* Slider Wrapper */}
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
                    >

                        {/* Step 1 */}
                        <div className="w-full flex-shrink-0">
                            <form>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full px-4 py-2 border rounded-lg mb-4"
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full px-4 py-2 border rounded-lg mb-4"
                                />
                                <input
                                    type="text"
                                    placeholder="Middle Name"
                                    className="w-full px-4 py-2 border rounded-lg mb-4"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-4 py-2 border rounded-lg mb-4"
                                />


                            </form>
                        </div>

                        {/* Step 2 */}
                        <div className="w-full flex-shrink-0">
                            <div className="w-full">
                                <label className="block text-sm mb-2">Resume</label>
                                <input
                                    type="file"
                                    className="w-full mb-4"
                                />
                            </div>

                            <div className="w-full h-40 ">
                                <label className="block text-sm mb-2">Cover Letter</label>
                                <input
                                    type="file"
                                    className="w-full mb-4"
                                />
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>


                </div>

                {/* Button */}
                <div className="flex justify-end gap-3 mt-4">
                    {step === 2 ? (< button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-2 border rounded-lg hover:shadow-sm"
                    >
                        Back
                    </button>) : (< button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-5 py-2 border rounded-lg hover:shadow-sm"
                    >
                        Cancel
                    </button>)}

                    {step === 1 ? (<button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-5 py-2 bg-[#378ADD] text-white rounded-lg hover:shadow-lg"
                    >
                        Next
                    </button>) : (<button
                        type="submit"
                        className="px-5 py-2 bg-[#378ADD] text-white rounded-lg hover:shadow-lg"
                    >
                        Submit
                    </button>)}

                </div>
            </div>
        </div >
    );
}

export default ApplyModal