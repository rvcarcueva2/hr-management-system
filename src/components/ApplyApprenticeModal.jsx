import { useNavigate } from "react-router-dom";
import useUsers from "@/hooks/useUsers";
import useApprentice from "@/hooks/useApprentice";
import { toast } from 'sonner'
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,

} from "@/components/ui/card"
import { Separator } from "./ui/separator";



const ApplyApprenticeModal = ({ setShowModal, program, onApplySuccess }) => {

    const { user } = useUsers();
    const { submitApplication } = useApprentice();

    const navigate = useNavigate();

    const handleSubmit = async () => {


        const toastId = toast.loading('Submitting application...')

        const success = await submitApplication(user?.id, program?.id);

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


            <Card className="w-full max-w-md mx-4 rounded-lg">
                <CardHeader>
                    <CardTitle className={`font-bold`}>Confirm to apply for this program </CardTitle>
                    <Separator />
                    <CardDescription className={`mt-2`}>
                        Once you applied to this program, please wait for the mentor's approval. This mentorship program requires all applicants to attend at the given schedule.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">




                    {/* Button */}
                    <div className="flex justify-end gap-2 mt-4">
                        < button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-5 py-2 text-sm border rounded-full hover:shadow-sm cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}

                            className="px-5 py-2 text-sm bg-[#378ADD] text-white rounded-full hover:shadow-lg cursor-pointer"
                        >
                            Apply
                        </button>

                    </div>
                </CardFooter>
            </Card>
        </div>

    );
}

export default ApplyApprenticeModal