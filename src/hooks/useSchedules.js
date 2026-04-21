import { useEffect, useState, useCallback } from 'react'
import supabase from '../utils/supabaseClient';


export function useSchedules(applicationId) {  // ✅ remove userId param
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchSchedules = useCallback(async () => {
        // ✅ Get userId directly from session — always available
        const { data: { session } } = await supabase.auth.getSession()
        const userId = session?.user?.id

        if (!applicationId && !userId) {
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        let query = supabase
            .from('schedules')
            .select(`id, title, application_id, start_time, end_time, meeting_link,
                application:application_id (
                    user:user_id (
                        employee_id,
                        display_name,
                        avatar_url
                    ),
                    assigned:users!applications_assigned_fkey (
                        id,
                        display_name,
                        avatar_url
                    )
                )`)
            .order('start_time', { ascending: true })

        if (applicationId) {
            query = query.eq('application_id', applicationId)
        }

        const { data, error } = await query

        if (error) {
            setError(error.message)
        } else {
            const filtered = applicationId
                ? data
                : data.filter(row => row.application?.assigned?.id === userId) // ✅ userId is guaranteed here

            setEvents(filtered.map(toFCEvent))
        }

        setLoading(false)
    }, [applicationId])

    useEffect(() => {
        fetchSchedules()
    }, [fetchSchedules])

    const createSchedule = async ({ title, start, end, meetingLink }) => {
        if (!applicationId) {
            throw new Error('applicationId is required to create a schedule')
        }

        const { data, error } = await supabase
            .from('schedules')
            .insert({
                title,
                application_id: applicationId,
                start_time: start,
                end_time: end ?? null,
                meeting_link: meetingLink ?? null,
            })
            .select()
            .single()

        if (error) throw error
        setEvents(prev => [...prev, toFCEvent(data)])
        return data
    }

    const updateSchedule = async (id, { start, end, meetingLink }) => {
        const { error } = await supabase
            .from('schedules')
            .update({
                start_time: start,
                end_time: end ?? null,
                meeting_link: meetingLink ?? null,
            })
            .eq('id', id)

        if (error) throw error
        setEvents(prev =>
            prev.map(e => e.id === id ? { ...e, start, end } : e)
        )
    }

    const deleteSchedule = async (id) => {
        const { error } = await supabase
            .from('schedules')
            .delete()
            .eq('id', id)

        if (error) throw error
        setEvents(prev => prev.filter(e => e.id !== id))
    }

    return { events, loading, error, createSchedule, updateSchedule, deleteSchedule }
}

// maps a schedules row → FullCalendar event shape
function toFCEvent(row) {
    return {
        id: row.id,
        title: row.title,
        start: row.start_time,
        end: row.end_time ?? undefined,
        extendedProps: {
            application_id: row.application_id,
            employee_id: row.application?.user?.employee_id ?? null,
            meet_link: row.meeting_link ?? null,
            applicant_name: row.application?.user?.display_name ?? null,
            applicant_avatar: row.application?.user?.avatar_url ?? null,
            assigned_name: row.application?.assigned?.display_name ?? null,
            assigned_avatar: row.application?.assigned?.avatar_url ?? null,
        }

    }
}