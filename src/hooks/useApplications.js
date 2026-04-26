import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";

const useApplications = () => {
    const [applications, setApplications] = useState([]);
    const [assigneeOptions, setAssigneeOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const [{ data, error }, { data: assigneeOptions, error: assigneeError }] = await Promise.all([
                    supabase
                        .from('applications')
                        .select(`
                    id,
                    status,
                    resume_url,
                    cover_letter_url,
                    created_at,
                    updated_at,
                    job:jobs!applications_job_id_fkey (
                        title,
                        site
                    ),
                    applicant:users!applications_user_id_fkey (
                        id,
                        employee_id,
                        email,
                        display_name
                    ),
                    reviewer:users!applications_reviewer_id_fkey (
                        id,
                        display_name
                    ),
                    assigned:users!applications_assigned_fkey (
                        id,
                        display_name
                    )
                `)
                        .neq('job_id', 47) // Except job_id 47
                        .order('created_at', { ascending: false }),
                    supabase
                        .from('users')
                        .select('id, display_name')
                        .eq('role', 'Reviewer')
                ]);

                if (error) throw error;
                if (assigneeError) throw assigneeError;

                setApplications(data || []);
                setAssigneeOptions(assigneeOptions || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);


    // Updating an Application
    const updateStatus = async (applicationId, status, reviewerId, assignedId) => {
        setError(null);
        try {
            const { error: updateError } = await supabase
                .from("applications")
                .update({
                    status,
                    ...(reviewerId && { reviewer_id: reviewerId }),
                    ...(assignedId && { assigned: assignedId }),
                })
                .eq("id", applicationId);

            if (updateError) throw updateError;

            // Update in place no re - fetch needed
            setApplications(prev => prev.map(app =>
                app.id === applicationId
                    ? {
                        ...app,
                        status,
                        ...(reviewerId && { reviewer: assigneeOptions.find(u => u.id === reviewerId) }),
                        ...(assignedId && { assigned: assigneeOptions.find(u => u.id === assignedId) }),
                    }
                    : app
            ));

            return true;

        } catch (err) {
            console.error("Error updating status:", err);
            setError(err.message);
            return false;
        }
    };

    return { applications, assigneeOptions, updateStatus, loading, error };
};

export default useApplications;