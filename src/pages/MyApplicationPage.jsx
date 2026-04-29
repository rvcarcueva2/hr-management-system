import React from 'react'
import { DataTable } from '../components/MyApplicationsTable'
import useMyApplications from '../hooks/useMyApplications';
import useApprentice from '../hooks/useApprentice';
import Spinner from '@/components/Spinner';

const MyApplicationPage = () => {
    const { applications, loading, error } = useMyApplications();
    const {
        apprentices,
        loading: apprenticeLoading,
        error: apprenticeError,
    } = useApprentice();

    const isLoading = loading || apprenticeLoading;
    const pageError = error || apprenticeError;

    if (isLoading) return <><div className=" min-h-120 items-start justify-center pt-18 px-30 "><Spinner loading={isLoading} /></div></>;
    if (pageError) return <p>Error: {pageError}</p>;

    return (
        <>
            <div className=" min-h-120 items-start justify-center pt-18 px-30 ">
                <Spinner loading={isLoading} />
                <h1 className='text-3xl font-bold mb-10 ml-6'>My Applications</h1>
                <DataTable data={applications} apprenticeData={apprentices} />
            </div>
        </>
    )
}

export default MyApplicationPage