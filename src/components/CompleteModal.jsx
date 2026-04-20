import React, { useState } from 'react'
import { Separator } from './ui/separator'
import { toast } from "sonner"

const CompleteModal = ({ setShowCompleteModal, enrolleeId, updateCompleted }) => {
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
        setLoading(true)
        const success = await updateCompleted(enrolleeId)
        setLoading(false)

        if (success) {
            toast.success("Course marked as complete!")
            setShowCompleteModal(false)
        } else {
            toast.error("Something went wrong. Please try again.")
        }

        setTimeout(() => window.location.reload(), 1500)
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 supports-backdrop-filter:backdrop-blur-xs">
            <div className="bg-gray-50 rounded-lg shadow-lg w-full max-w-md p-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    Confirm to complete this course
                </h2>
                <Separator />

                <p className="mt-4 text-sm text-gray-600">
                    Once confirmed this course will be marked as complete. Note that this action cannot be undone.
                </p>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="px-5 py-2 text-sm bg-[#378ADD] text-white rounded-full hover:shadow-lg cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Confirm"}
                    </button>
                    <button
                        onClick={() => setShowCompleteModal(false)}
                        className="px-5 py-2 text-sm border rounded-full hover:shadow-sm cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CompleteModal