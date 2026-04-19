import React, { useState } from 'react'
import { Separator } from './ui/separator'
import supabase from '../utils/supabaseClient'
import { toast } from "sonner"

const EnrollModal = ({ setShowEnrollModal, courses, jobTitle, onEnrollSuccess }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleConfirm = async () => {
        setLoading(true)
        setError(null)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const userId = session?.user?.id

            if (!userId) throw new Error("User not authenticated")

            const rows = courses.map(course => ({
                user_id: userId,
                course_id: course.id,
            }))

            const { error: insertError } = await supabase
                .from("enrollees")
                .insert(rows)

            if (insertError) {
                if (insertError.code === "23505") {
                    throw new Error("You are already enrolled in one or more of these courses.")
                }
                throw insertError
            }

            onEnrollSuccess()
            setShowEnrollModal(false)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
            toast.success('You have successfully enrolled in this course!')
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-gray-50 rounded-lg shadow-lg w-full max-w-md p-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    Confirm to enroll in this course
                </h2>
                <Separator />

                <div className="mt-3 space-y-1">
                    <p className="text-sm text-gray-500">Path</p>
                    <p className="font-semibold text-gray-800">{jobTitle}</p>
                </div>



                <p className="mt-4 text-sm text-gray-600">
                    Once confirmed you are expected to finish the course at your own pace.
                </p>

                {error && (
                    <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
                )}

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="px-5 py-2 text-sm bg-[#378ADD] text-white rounded-full hover:shadow-lg cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Enrolling..." : "Confirm"}
                    </button>
                    <button
                        onClick={() => setShowEnrollModal(false)}
                        disabled={loading}
                        className="px-5 py-2 text-sm border rounded-full hover:shadow-sm cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EnrollModal