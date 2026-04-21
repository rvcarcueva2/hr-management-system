import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { DataTable } from '../components/ApplicationsTable'
import useApplications from '../hooks/useApplications';
import Spinner from '@/components/Spinner';

const AdminApplicationsPage = () => {
    const { applications, assigneeOptions, updateStatus, loading, error } = useApplications();
    const [searchParams] = useSearchParams();
    const autoOpenApplicantName = searchParams.get('applicant');

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

export default AdminApplicationsPage
