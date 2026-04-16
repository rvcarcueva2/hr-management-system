import { useState, useEffect } from 'react'
import supabase from '../utils/supabaseClient';

const useJobs = () => {
    const [jobs, setJobs] = useState([]); // Default is empty array
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Fetching jobs
    const fetchJobs = async () => {

        try {
            const { data } = await supabase
                .from('jobs')
                .select(`*, companies(name, description, contact_email, contact_phone, location)`)
                .order('created_at', { ascending: false })
                .order('updated_at', { ascending: false })

            setJobs(data); // useStateVariableName will receive the data
        } catch (error) {
            console.log('Error fetchind data', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchJobs();
    }, []);

    // Submitting a job
    const submitJob = async (jobData) => {
        setSubmitting(true);
        setError(null);

        try {
            // 1. Get current authenticated user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;

            // 2. Get user's job_id
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('job_id')
                .eq('id', user.id)
                .single();

            if (userError) throw userError;

            if (!userData.job_id) {
                throw new Error("User has no job assigned.");
            }

            // 3. Get company_id from that job
            const { data: jobInfo, error: jobError } = await supabase
                .from('jobs')
                .select('company_id')
                .eq('id', userData.job_id)
                .single();

            if (jobError) throw jobError;

            if (!jobInfo.company_id) {
                throw new Error("User's job has no company assigned.");
            }

            // 4. Insert new job
            const { data, error } = await supabase
                .from('jobs')
                .insert([{
                    title: jobData.title,
                    type: jobData.type,
                    category: jobData.category,
                    description: jobData.description,
                    salary: jobData.salary,
                    company_id: jobInfo.company_id, //  Auto insert from the company_id
                }])
                .select(`*, companies(name, description, contact_email, contact_phone, location)`);

            if (error) throw error;

            setJobs(prev => [data[0], ...prev]);

            return { success: true, data };

        } catch (err) {
            console.log('Error submitting job', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setSubmitting(false);
        }
    };

    const updateJob = async (jobId, title, type, category, salary, description) => {
        setLoading(true);
        setError(null);
        try {
            const { error: updateError } = await supabase
                .from('jobs')
                .update({
                    title,
                    type,
                    category,
                    salary,
                    description
                })
                .eq("id", jobId)
                

            if (updateError) throw updateError;
            return true;

        } catch (err) {
            console.log('Error updating job:', err);
            setError(err.message)
            return false;
        } finally {
            setLoading(false)
        }
    };

    return { jobs, loading, submitting, error, fetchJobs, submitJob, updateJob  }
}


export default useJobs