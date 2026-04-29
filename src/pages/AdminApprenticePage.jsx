import React from 'react'
import { DataTable } from '../components/ApprenticeTable'
import useApprentice from '../hooks/useApprentice';
import Spinner from '@/components/Spinner';


const AdminApprenticePage = () => {
    const { apprentices, loading, error, updateStatus } = useApprentice({ includeAll: true });
    if (loading) return <Spinner />
    if (error) return error
    return (
        <>
            <DataTable data={apprentices} updateStatus={updateStatus} />
        </>
    )
}

export default AdminApprenticePage