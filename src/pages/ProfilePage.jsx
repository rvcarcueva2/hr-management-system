import { useState } from 'react'
import supabase from '../utils/supabaseClient'
import ProfileForm from '@/components/ProfileForm'
import { useLoaderData } from 'react-router-dom'
import Spinner from '@/components/Spinner'
import useUsers from '@/hooks/useUsers';

const ProfilePage = () => {
    const { user, loading } = useUsers();
    const profile = useLoaderData()

    if (loading) return (
        <>
            <div className='min-h-175'>
                <Spinner loading={loading} />
            </div>
        </>
    )
    return (

        <>
            <div className=" min-h-175 flex items-start justify-center pt-14 px-30 ">
                <ProfileForm profile={profile} />
            </div>
        </>
    )
};

const profileLoader = async ({ params }) => {


    // If no id param (i.e. /profile), get the logged-in user's id from session
    if (!params.id) {
        const { data: { session } } = await supabase.auth.getSession()
        params.id = session?.user?.id
    }

    const { data, error } = await supabase
        .from('users')
        .select(`*,
            department:departments!users_department_id_fkey (
                name,
                supervisor:users!department_supervisor_id_fkey (
                    display_name
                )
            ),
            job:jobs!users_job_id_fkey (
                title,
                salary,
                site
            )`)
        .eq('id', params.id)
        .single()

    if (error) throw new Error(error.message)

    return data
}

export { ProfilePage as default, profileLoader }

