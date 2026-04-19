import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";

const useEnrollees = (targetUserId = null) => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnrollments = async () => {
            setLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const currentUserId = session?.user?.id

                if (!currentUserId) throw new Error("User not authenticated")

                const queryUserId = targetUserId || currentUserId

                const { data, error } = await supabase
                    .from("enrollees")
                    .select(`
                        id,
                        completed,
                        enrolled_at,
                        course:courses (
                            id,
                            title,
                            job:jobs (
                                id,
                                title
                            )
                        )
                    `)
                    .eq("user_id", queryUserId);

                if (error) throw error;

                // Group courses by job
                const grouped = {};
                for (const enrollment of data) {
                    const job = enrollment.course?.job;
                    if (!job) continue;

                    if (!grouped[job.id]) {
                        grouped[job.id] = {
                            jobId: job.id,
                            jobTitle: job.title,
                            courses: [],
                        };
                    }

                    grouped[job.id].courses.push({
                        enrollmentId: enrollment.id,
                        courseId: enrollment.course.id,
                        courseTitle: enrollment.course.title,
                        completed: enrollment.completed,
                    });
                }

                setEnrollments(Object.values(grouped));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [targetUserId]);

    const updateCompleted = async (enrolleeId) => {
        setLoading(true)
        setError(null)

        try {
            const { error: updateError } = await supabase
                .from("enrollees")
                .update({ completed: true })
                .eq("id", enrolleeId)

            if (updateError) throw updateError;
            return true;
        } catch (err) {
            console.log('Error updating status:', err);
            setError(err.message)
            return false;
        } finally {
            setLoading(false)
        }
    }

    return { enrollments, loading, error, updateCompleted };
};

export default useEnrollees;