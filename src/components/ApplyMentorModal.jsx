import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUsers from "@/hooks/useUsers";
import AvatarUpload from "./AvatarUpload";
import { FaPaperclip } from "react-icons/fa6";
import Spinner from "./Spinner";
import { toast } from "sonner";
import useApply from "@/hooks/useApply";
import { useParams } from 'react-router-dom';
import supabase from "@/utils/supabaseClient";

const qualifications = [
    "3 years of experience in the company",
    "Must be in SG 27 or higher",
    "Strong communication skills",
    "Have a growth mindset and willing to help others",
];


const ApplyMentorModal = ({ setShowModal, onApplySuccess }) => {
    const { user, loading } = useUsers();
    const { id } = useParams();
    const [step, setStep] = useState(1);
    const { submitApplication } = useApply();
    const [jobDescription, setJobDescription] = useState("");
    
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeError, setResumeError] = useState(false);
    const [coverLetterFile, setCoverLetterFile] = useState(null);
    const [coverLetterError, setCoverLetterError] = useState(false);
    const [submitRequested, setSubmitRequested] = useState(false);


    const navigate = useNavigate();
    const hasSubmittedRef = useRef(false);

    useEffect(() => {
        let isMounted = true;

        const fetchJobDescription = async () => {
            const { data, error } = await supabase
                .from("jobs")
                .select("description")
                .eq("id", 47)
                .single();

            if (error || !data) return;
            if (!isMounted) return;

            setJobDescription(data.description ?? "");
        };

        fetchJobDescription();

        return () => {
            isMounted = false;
        };
    }, []);
    
    useEffect(() => {
        if (!submitRequested || loading) return;
        if (!user?.id || !resumeFile || !coverLetterFile) return;
        if (hasSubmittedRef.current) return;

        hasSubmittedRef.current = true;

        const submitMentorApplication = async () => {

            const toastId = toast.loading("Submitting mentor application...");
            const success = await submitApplication(
                user.id,
                47,
                resumeFile,
                coverLetterFile
            );

            if (!success) {
                toast.error("Failed to submit mentor application", { id: toastId });
                setSubmitRequested(false);
                hasSubmittedRef.current = false;
                return;
            }

            toast.success("Mentor application submitted successfully!", { id: toastId });
            onApplySuccess?.();
            setShowModal(false);
            setSubmitRequested(false);

        };

        submitMentorApplication();
    }, [
        submitRequested,
        loading,
        user?.id,
        resumeFile,
        coverLetterFile,
        submitApplication,
        onApplySuccess,
        setShowModal,
    ]);

    const handleSubmit = async () => {
        if (!resumeFile) {
            setResumeError(true);
            return;
        }

        if (!coverLetterFile) {
            setCoverLetterError(true);
            return;
        }

        setSubmitRequested(true);
        setTimeout(() => {
            navigate('/my-application');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-gray-50 rounded-lg shadow-lg w-full max-w-lg p-8 relative">
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    Apply as a Mentor
                </h2>
                <p className="text-gray-500 mb-6 text-sm">
                    {step === 1
                        ? "Review the qualifications before applying"
                        : step === 2
                            ? "Review your information below"
                            : "Upload your resume and cover letter"}
                </p>

                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-300 ease-in-out"
                                style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
                            >
                                <div className="w-full shrink-0 flex items-start rounded-lg mb-2">
                                    <div className="flex flex-col p-6 m-auto border bg-white rounded-lg gap-4 shadow-md w-96">
                                        <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                                        <p className='text-sm'>{jobDescription}</p>
                                        <ul className=" list-disc text-sm text-gray-600 space-y-2 px-2">
                                            {qualifications.map((qualification) => (
                                                <li key={qualification}>{qualification}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="w-full shrink-0 flex items-start rounded-lg mb-2">
                                    <div className="flex p-4 m-auto border bg-white rounded-lg gap-3 shadow-md">
                                        <div className="flex-1">
                                            <div className="shrink-0 flex justify-center">
                                                <AvatarUpload
                                                    userId={user?.id}
                                                    isViewOnly
                                                    className="w-24 h-24"
                                                    wrapperClassName="w-auto"
                                                />
                                            </div>

                                            <form autoComplete="off" className="flex flex-col">
                                                <input type="hidden" value={user?.id ?? ""} />

                                                <div className="w-full px-4 py-2 text-sm font-bold text-[#378ADD] focus:outline-none text-center border-b mb-2 cursor-default">
                                                    {user?.employee_id ?? ""}
                                                </div>

                                                <div className="w-full px-4 py-1 text-sm font-semibold text-gray-600 focus:outline-none cursor-default">
                                                    {user?.first_name}
                                                    <span> {user?.last_name}</span>
                                                </div>

                                                <div className="w-full px-4 py-1 text-sm text-gray-500 focus:outline-none cursor-default">
                                                    {user?.email ?? ""}
                                                </div>

                                                <div className="w-full px-4 py-1 text-sm text-gray-500 focus:outline-none cursor-default">
                                                    {user?.job?.salary ?? ""}
                                                </div>
                                                <textarea
                                                    className="w-full px-4 py-1 text-sm text-gray-500 focus:outline-none resize-none cursor-default"
                                                    rows={2}
                                                    defaultValue={user?.job?.site ?? ""}
                                                    readOnly
                                                />
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full shrink-0">
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

                                    <div className="w-full">
                                        <div className="flex justify-between">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                                            {coverLetterError && (
                                                <p className="text-red-500 text-xs mt-1">Cover letter is required.</p>
                                            )}
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
                                                    setCoverLetterError(false);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex items-center justify-center gap-2 mt-4 mb-4">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === 1 ? "bg-[#378ADD]" : "bg-gray-300"}`} />
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === 2 ? "bg-[#378ADD]" : "bg-gray-300"}`} />
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === 3 ? "bg-[#378ADD]" : "bg-gray-300"}`} />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                            className="px-5 py-2 text-sm border rounded-full hover:shadow-sm cursor-pointer"
                        >
                            Back
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-5 py-2 text-sm border rounded-full hover:shadow-sm cursor-pointer"
                        >
                            Cancel
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={() => setStep((prev) => Math.min(3, prev + 1))}
                            className="px-5 py-2 text-sm bg-[#378ADD] text-white rounded-full hover:shadow-lg cursor-pointer"
                        >
                            Next
                        </button>
                    ) : (
                        <button
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
        </div>
    );
};

export default ApplyMentorModal;