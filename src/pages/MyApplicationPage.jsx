import React from 'react'
import { DataTable } from '../components/MyApplicationsTable'
import useMyApplications from '../hooks/useMyApplications';
import Spinner from '@/components/Spinner';

const MyApplicationPage = () => {
    const { applications, loading, error } = useMyApplications();

    if (loading) return <><div className=" min-h-120 items-start justify-center pt-18 px-30 "><Spinner loading={loading} /></div></>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className=" min-h-120 items-start justify-center pt-18 px-30 ">
                <Spinner loading={loading} />
                <h1 className='text-3xl font-bold mb-10 ml-6'>My Applications</h1>
                <DataTable data={applications} />
            </div>
        </>
    )
}

export default MyApplicationPage