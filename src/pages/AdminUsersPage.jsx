import React from 'react'
import { DataTable } from '@/components/UsersTable'
import useUsers from '@/hooks/useUsers'
import Spinner from '@/components/Spinner'

const AdminUsersPage = () => {
  const { users, loading, error } = useUsers();
  if (loading) return <Spinner loading={loading} />;
  if (error) return <p>Error: {error}</p>;


  return (
    <>
      <DataTable data={users} />

    </>
  )
}

export default AdminUsersPage