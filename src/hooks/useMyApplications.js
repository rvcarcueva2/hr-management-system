import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";

const useMyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("User not authenticated");

                const { data, error } = await supabase
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
                    .eq("user_id", user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setApplications(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const deleteApplication = async (applicationId) => {
        setLoading(true);
        setError(false);

        try {
            const { error: deleteError } = await supabase
                .from("applications")
                .delete()
                .eq("id", applicationId)

            if (deleteError) throw deleteError;
            return true;

        } catch (err) {
            console.log('Error deleteing job:', err)
            setError(err.message)
            return false;
        } finally {
            setLoading(false)
        }
    };

    return { applications, loading, error, deleteApplication };
};

export default useMyApplications;