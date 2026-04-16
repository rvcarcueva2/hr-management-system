import React from 'react'
import { DataTable } from '../components/ApplicationsTable'
import useApplications from '../hooks/useApplications';
import Spinner from '@/components/Spinner';

const AdminApplicationsPage = () => {
    const { applications, loading, error } = useApplications();

    if (loading) return <Spinner loading={loading} />;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <DataTable data={applications} />
        </>
    )
}

export default AdminApplicationsPage
