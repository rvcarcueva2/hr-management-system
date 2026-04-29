import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";

const useApprentice = (options = {}) => {
    const { includeAll = false, autoFetch = true } = options;
    const [apprentices, setApprentices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApprentice = async (userId, fetchOptions = {}) => {
        setLoading(true);
        setError(null);

        try {
            const shouldIncludeAll = fetchOptions.includeAll ?? includeAll;
            let resolvedUserId = userId;
            if (!resolvedUserId && !shouldIncludeAll) {
                const { data: { session }, error: authError } = await supabase.auth.getSession();
                if (authError) throw authError;
                resolvedUserId = session?.user?.id ?? null;
            }

            let query = supabase
                .from("apprentice")
                .select(`
                    id,
                    status,
                    created_at,
                    updated_at,
                    applicant:users!apprentice_user_id_fkey (
                        id,
                        employee_id,
                        email,
                        display_name,
                        avatar_url,
                        job:jobs!users_job_id_fkey (
                        id,
                        title
                        )
                    ),
                    
                    program:programs!apprentice_program_id_fkey (
                        id,
                        title,
                        topic,
                        type,
                        mentor:users!programs_mentor_fkey (
                            id,
                            display_name,
                            avatar_url
                        )
                    )
                `)
                .order("created_at", { ascending: false });

            if (resolvedUserId && !shouldIncludeAll) {
                query = query.eq("user_id", resolvedUserId);
            }

            const { data, error: fetchError } = await query;
            if (fetchError) throw fetchError;

            setApprentices(data || []);
            return data || [];
        } catch (err) {
            console.log("Error fetching apprentice applications", err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!autoFetch) return;
        fetchApprentice(undefined, { includeAll });
    }, [autoFetch, includeAll]);

    const submitApplication = async (userId, programId) => {
        setLoading(true);
        setError(null);

        try {
            if (!userId || !programId) {
                throw new Error("Missing user or program");
            }

            const { error: insertError } = await supabase
                .from("apprentice")
                .insert({
                    user_id: userId,
                    program_id: programId,
                });

            if (insertError) throw insertError;

            return true;
        } catch (err) {
            console.error("Error submitting apprentice application:", err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (applicationId, status) => {
        setError(null);

        try {
            const { data, error: updateError } = await supabase
                .from("apprentice")
                .update({ status })
                .eq("id", applicationId)
                

            if (updateError) throw updateError;
            
            const updatedAt = new Date().toISOString();
            setApprentices((prev) =>
                prev.map((app) =>
                    app.id === applicationId
                        ? { ...app, status, updated_at: updatedAt }
                        : app
                )
            );

            return true;
        } catch (err) {
            console.error("Error updating apprentice status:", err);
            setError(err.message);
            return false;
        }
    };

    return { apprentices, loading, error, fetchApprentice, submitApplication, updateStatus };
};

export default useApprentice;
