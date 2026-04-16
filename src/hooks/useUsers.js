import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";

const useUsers = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);

            try {
                const { data: { session } } = await supabase.auth.getSession();
                const userId = session?.user?.id;

                const { data, error } = await supabase
                    .from('users')
                    .select(`*,
            department:departments!users_department_id_fkey (
                name,
                supervisor:users!department_supervisor_id_fkey (
                    display_name
                )
            ),
            job:jobs!users_job_id_fkey (
                title,
                salary,
                company:companies!jobs_company_id_fkey (
                    location
                )
            )`)
                .eq('id', userId)
                .single();

                if (error) throw error;

                setUser(data || null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // ← only once
            }
        };

        fetchUsers();
    }, []);

    return { user, loading, error };
};

export default useUsers;