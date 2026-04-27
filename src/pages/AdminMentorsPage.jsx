import React, { useEffect, useState } from 'react'
import { DataTable } from '../components/MentorsTable'
import { useSearchParams } from 'react-router-dom'
import useApplications from '../hooks/useApplications';
import Spinner from '@/components/Spinner';
import supabase from '../utils/supabaseClient';

const AdminMentorsPage = () => {
  const { assigneeOptions, updateStatus: baseUpdateStatus } = useApplications();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const autoOpenApplicantName = searchParams.get('applicant');

  useEffect(() => {
    const fetchMentorApplications = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
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
          .eq('job_id', 47)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setApplications(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorApplications();
  }, []);

  const updateStatus = async (applicationId, status, reviewerId, assignedId) => {
    const success = await baseUpdateStatus(applicationId, status, reviewerId, assignedId);
    if (!success) return false;

    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
            ...app,
            status,
            ...(reviewerId && {
              reviewer: assigneeOptions.find((u) => u.id === reviewerId),
            }),
            ...(assignedId && {
              assigned: assigneeOptions.find((u) => u.id === assignedId),
            }),
          }
          : app
      )
    );

    return true;
  };

  if (loading) return <Spinner loading={loading} />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <DataTable
        data={applications}
        assigneeOptions={assigneeOptions}
        updateStatus={updateStatus}
        autoOpenApplicantName={autoOpenApplicantName}
      />
    </>
  )
}

export default AdminMentorsPage