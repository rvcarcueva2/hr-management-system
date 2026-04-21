import { useState } from "react"
import { useNavigate } from "react-router-dom";
import useUsers from "@/hooks/useUsers";
import useAvatarUpload from "@/hooks/useAvatarUpload";
import { FaPaperclip } from "react-icons/fa6";
import useApply from "@/hooks/useApply";
import Spinner from "./Spinner";
import { toast } from 'sonner'



const ApplyModal = ({ setShowModal, job, onApplySuccess }) => { // Props from JobPage
    const { user, loading } = useUsers();
    const { avatarUrl } = useAvatarUpload();
    const [step, setStep] = useState(1);

    const { submitApplication } = useApply();
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeError, setResumeError] = useState(false);
    const [coverLetterFile, setCoverLetterFile] = useState(null);
    const [coverLetterError, setCoverLetterError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async () => {

        // Input validating
        if (!resumeFile) {
            setResumeError(true);
            return;
        }

        if (!coverLetterFile) {
            setCoverLetterError(true);
            return;
        }

        const toastId = toast.loading('Submitting application...')

        const success = await submitApplication(user?.id, job?.id, resumeFile, coverLetterFile);

        if (!success) {
            toast.error('Failed to submit application', { id: toastId })
            return;
        }

        toast.success('Application submitted successfully!', { id: toastId })
        onApplySuccess?.()
        setShowModal(false);
        setTimeout(() => {
            navigate('/my-application');
        }, 1500);
    };



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

            {/* Modal */}
            <div className="bg-gray-50 rounded-lg shadow-lg w-full max-w-lg p-8 relative">

                <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    Apply Now
                </h2>
                <p className="text-gray-500 mb-6 text-sm">
                    {step === 1 ? 'Review your information below' : 'Upload your resume and cover letter'}
                </p>

                {/* Slider Wrapper */}
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="overflow-hidden">


                            <div
                                className="flex  transition-transform duration-300 ease-in-out"
                                style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
                            >


                                {/* Step 1 */}
                                < div className="w-full shrink-0 flex items-start rounded-lg mb-2  ">

                                    <div className="flex p-4 m-auto border bg-white rounded-lg gap-3 shadow-md">

                                        {/* Avatar */}
                                        <div className="flex-1  ">
                                            <div className="shrink-0 flex justify-center">
                                                <div className="bg-gray-200 rounded-full w-24 h-24 border ">
                                                    {avatarUrl ? (
                                                        <img
                                                            src={avatarUrl}
                                                            alt="Avatar"
                                                            className="w-full h-full rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="bg-gray-200 rounded-full w-24 h-24" />
                                                    )}
                                                </div>
                                            </div>


                                            {/* Form */}
                                            <form autoComplete="off" className="flex flex-col ">

                                                <input
                                                    type="hidden"
                                                    value={user?.id ?? ""}
                                                />

                                                <div className="w-full px-4 py-2 text-sm font-bold text-[#378ADD] focus:outline-none text-center border-b mb-2 cursor-default"
                                                >
                                                    {user?.employee_id ?? ""}
                                                </div>

                                                <div className=" w-full  px-4 py-1 text-sm font-semibold text-gray-600 focus:outline-none cursor-default"
                                                >
                                                    {user?.first_name}<span> {user?.last_name}</span>
                                                </div>


                                                <div className="w-full px-4 py-1 text-sm text-gray-500 focus:outline-none cursor-default"
                                                >
                                                    {user?.email ?? ""}
                                                </div>

                                                <div className="w-full px-4 py-1 text-sm text-gray-500 focus:outline-none cursor-default"
                                                >
                                                    {user?.job?.salary ?? ""}

                                                </div>
                                                <textarea
                                                    className="w-full px-4 py-1 text-sm text-gray-500 focus:outline-none resize-none cursor-default"
                                                    rows={2}
                                                    defaultValue={user?.job.company?.location ?? ""}
                                                    readOnly
                                                />
                                            </form>
                                        </div>

                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="w-full shrink-0">
                                    {/* Resume */}
                                    <div className="w-full mb-4">
                                        <div className="flex justify-between">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                                            {resumeError && <p className="text-red-500 text-xs mt-1">Resume is required.</p>}
                                        </div>
                                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#378ADD] hover:bg-blue-50 transition-colors duration-200 group">
                                            <FaPaperclip className="text-gray-400 group-hover:text-[#378ADD] text-xl mb-2 transition-colors duration-200" />
                                            {resumeFile ? (
                                                <span className="text-sm text-[#378ADD] font-medium">{resumeFile.name}</span>
                                            ) : (
                                                <>
                                                    <span className="text-sm text-gray-400 group-hover:text-[#378ADD] transition-colors duration-200">Click to upload resume</span>
                                                    <span className="text-xs text-gray-300 mt-1">PDF, DOC, DOCX</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.doc,.docx"

                                                onChange={(e) => {
                                                    setResumeFile(e.target.files[0]);
                                                    setResumeError(false);
                                                }}
                                            />
                                        </label>

                                    </div>

                                    {/* Cover Letter */}
                                    <div className="w-full">
                                        <div className="flex justify-between">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                                            {coverLetterError && <p className="text-red-500 text-xs mt-1">Cover letter is required.</p>}
                                        </div>
                                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#378ADD] hover:bg-blue-50 transition-colors duration-200 group">
                                            <FaPaperclip className="text-gray-400 group-hover:text-[#378ADD] text-xl mb-2 transition-colors duration-200" />
                                            {coverLetterFile ? (
                                                <span className="text-sm text-[#378ADD] font-medium">{coverLetterFile.name}</span>
                                            ) : (
                                                <>
                                                    <span className="text-sm text-gray-400 group-hover:text-[#378ADD] transition-colors duration-200">Click to upload resume</span>
                                                    <span className="text-xs text-gray-300 mt-1">PDF, DOC, DOCX</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.doc,.docx"
                                                required
                                                onChange={(e) => {
                                                    setCoverLetterFile(e.target.files[0]);
                                                    setCoverLetterError(false)
                                                }}
                                            />
                                        </label>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </>)}

                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mt-4 mb-4">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === 1 ? 'bg-[#378ADD]' : 'bg-[#378ADD]'}`} />
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-[#378ADD]' : 'bg-gray-300'}`} />
                </div>

                {/* Button */}
                <div className="flex justify-end gap-2 mt-4">
                    {step === 2 ? (< button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-2 text-sm border rounded-full hover:shadow-sm cursor-pointer"
                    >
                        Back
                    </button>) : (< button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-5 py-2 text-sm border rounded-full hover:shadow-sm cursor-pointer"
                    >
                        Cancel
                    </button>)}

                    {step === 1 ? (<button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-5 py-2 text-sm bg-[#378ADD] text-white rounded-full hover:shadow-lg cursor-pointer"
                    >
                        Next
                    </button>) : (<button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 text-sm bg-[#378ADD] text-white rounded-full hover:shadow-lg cursor-pointer"
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>

                    )}
                </div>
            </div>

        </div >
    );
}

export default ApplyModal