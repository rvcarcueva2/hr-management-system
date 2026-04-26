import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";

const useUsers = () => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const userId = session?.user?.id;

                if (!userId) {
                    throw new Error("User not authenticated");
                }


                const [{ data: currentUser, error: userError }, { data: allUsers, error: usersError }] = await Promise.all([
                    supabase
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
                                site
                            )`)
                        .eq('id', userId)
                        .single(),
                    supabase
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
                                site
                            )`)
                        .order('created_at', { ascending: false })
                ]);

                if (userError) throw userError;
                if (usersError) throw usersError;

                setUser(currentUser || null);
                setUsers(allUsers || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { user, users, loading, error };
};

export default useUsers;

