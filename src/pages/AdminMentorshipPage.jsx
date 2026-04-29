import React from 'react'
import { DataTable } from '../components/MentorshipTable'
import usePrograms from '@/hooks/usePrograms';
import Spinner from '@/components/Spinner';

const AdminMentorshipPage = () => {
    const { mentorPrograms, loading, error } = usePrograms();

    if (loading) return <Spinner loading={loading} />;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <DataTable data={mentorPrograms} />

        </>
    )
}

export default AdminMentorshipPage