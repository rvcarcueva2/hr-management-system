import { useState, useEffect } from 'react'
import supabase from '../utils/supabaseClient';

const useJobs = () => {
    const [jobs, setJobs] = useState([]); // Default is empty array
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {

            try {
                const { data } = await supabase
                    .from('jobs')
                    .select(`*, companies(name, description, contact_email, contact_phone)`)
                    .order('created_at', { ascending: false })

                setJobs(data); // useStateVariableName will receive the data
            } catch (error) {
                console.log('Error fetchind data', error);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []
    )

    return { jobs, loading }
}

export default useJobs