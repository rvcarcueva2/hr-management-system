import { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

const useCourses = (jobId) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!jobId) return;

        const fetchCourses = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('job_id', Number(jobId));

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            setCourses(data ?? []);
            setLoading(false);
        };

        fetchCourses();
    }, [jobId]);

    return { courses, loading, error };
};

export default useCourses;