import { useState, useEffect } from 'react'
import supabase from '../utils/supabaseClient'

const usePrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [mentorPrograms, setMentorPrograms] = useState([])
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

    const fetchMentorPrograms = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data: authData, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;

            const userId = authData?.user?.id;
            if (!userId) throw new Error('No authenticated user found');

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
                .eq('mentor', userId)
                .order('created_at', { ascending: false })
                .order('updated_at', { ascending: false })

            if (fetchError) throw fetchError;

            setMentorPrograms(data || []);
        } catch (err) {
            console.log('Error fetching programs', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMentorPrograms();
    }, []);

    const updateProgram = async (programId, updates) => {
        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('programs')
                .update(updates)
                .eq('id', programId);

            if (updateError) throw updateError;
            return true;
        } catch (err) {
            console.log('Error updating program', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const submitProgram = async (programPayload) => {
        setLoading(true);
        setError(null);

        try {
            const { data: authData, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;

            const mentorId = authData?.user?.id;
            if (!mentorId) {
                throw new Error('No authenticated user found for mentor');
            }

            const { data, error: insertError } = await supabase
                .from('programs')
                .insert([
                    {
                        ...programPayload,
                        mentor: mentorId,
                    },
                ])
                .select()

            if (insertError) throw insertError;

            if (data?.length) {
                setPrograms(prev => [data[0], ...prev]);
            }

            return { success: true, data };
        } catch (err) {
            console.log('Error submitting program', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const deleteProgram = async (programId) => {
        setLoading(true);
        setError(null);

        try {
            const { error: deleteError } = await supabase
                .from('programs')
                .delete()
                .eq('id', programId);

            if (deleteError) throw deleteError;
            return true;
        } catch (err) {
            console.log('Error deleting program', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { programs, mentorPrograms, loading, error, fetchPrograms, fetchMentorPrograms, updateProgram, submitProgram, deleteProgram };
}

export default usePrograms
