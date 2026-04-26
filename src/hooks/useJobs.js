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
                .select(`*`)
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

            // 4. Insert new job
            const { data, error } = await supabase
                .from('jobs')
                .insert([{
                    title: jobData.title,
                    type: jobData.type,
                    category: jobData.category,
                    description: jobData.description,
                    salary: jobData.salary,
                    site: jobData.site
                }])
                .select()
                

            if (error) throw error;

            if (data?.length) {
                setJobs(prev => [data[0], ...prev]);
            }

            return { success: true, data };

        } catch (err) {
            console.log('Error submitting job', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setSubmitting(false);
        }
    };

    const updateJob = async (jobId, title, type, category, salary, description, site, isVisible) => {
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
                    description,
                    site,
                    is_visible: isVisible
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

    const updateCourses = async (jobId, courses = []) => {
        try {
            // Fetch existing courses for comparison
            const { data: existing, error: fetchError } = await supabase
                .from('courses')
                .select('id, title, course_link')
                .eq('job_id', jobId)

            if (fetchError) throw fetchError

            // Check if anything actually changed
            const hasChanges =
                existing.length !== courses.length ||
                courses.some((c) => {
                    const match = existing.find(e => e.id === c.id)
                    return !match || match.title !== c.title || match.course_link !== c.link
                })

            if (!hasChanges) return true // no changes, skip delete/insert

            // Delete existing courses for this job first
            const { error: deleteError } = await supabase
                .from('courses')
                .delete()
                .eq('job_id', jobId)

            if (deleteError) throw deleteError

            // Insert new courses if any
            if (courses.length === 0) return true

            const { error: insertError } = await supabase
                .from('courses')
                .insert(courses.map(c => ({
                    title: c.title,
                    course_link: c.link,
                    job_id: jobId
                })))

            if (insertError) throw insertError
            return true

        } catch (err) {
            console.log('Error updating courses:', err)
            return false
        }
    }

    const deleteJob = async (jobId) => {
        setLoading(true);
        setError(false);
        try {
            const { error: deleteError } = await supabase
                .from('jobs')
                .delete()
                .eq("id", jobId)

            if (deleteError) throw deleteError;
            return true;

        } catch (err) {
            console.log('Error deleting job:', err);
            setError(err.message)
            return false;
        } finally {
            setLoading(false);
        }
    };



    return { jobs, loading, submitting, error, fetchJobs, submitJob, updateCourses, updateJob, deleteJob, }
}


export default useJobs