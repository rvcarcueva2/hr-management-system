import React from 'react'
import { DataTable } from '@/components/JobsTable'
import useJobs from '@/hooks/useJobs'
import Spinner from '@/components/Spinner'

const AdminJobsPage = () => {
  const { jobs, loading, error } = useJobs();
  if (loading) return <Spinner loading={loading} />;
  if (error) return <p>Error: {error}</p>;


  return (
    <>
      <DataTable data={jobs} />
    </>
  )
}

export default AdminJobsPage