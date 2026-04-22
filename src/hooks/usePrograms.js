import { useState, useEffect } from 'react'
import supabase from '../utils/supabaseClient'

const usePrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPrograms = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('programs')
                .select(`*,
                    mentor:users!programs_mentor_fkey (
                        id,
                        display_name,
                        avatar_url,
                        job:jobs!users_job_id_fkey (
                            title
                        )
                    )
                `)
                .order('created_at', { ascending: false })
                .order('updated_at', { ascending: false })

            if (fetchError) throw fetchError;

            setPrograms(data || []);
        } catch (err) {
            console.log('Error fetching programs', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPrograms();
    }, []);

    return { programs, loading, error, fetchPrograms };
}

export default usePrograms
