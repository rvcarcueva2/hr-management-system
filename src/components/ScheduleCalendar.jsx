import { useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useSchedules } from '../hooks/useSchedules'
import {  CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconClock, IconUser, IconLink, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import Spinner from './Spinner'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { Separator } from "@/components/ui/separator"
import useUsers from '@/hooks/useUsers'

export default function ScheduleCalendar({ applicationId }) {
  const calendarRef = useRef(null)
  const [currentViewType, setCurrentViewType] = useState('dayGridMonth')
  const { user, loading: userLoading } = useUsers();
  const { events, loading, error, createSchedule } = useSchedules(applicationId)
  const [calendarInfo, setCalendarInfo] = useState({ open: false, event: null })
  const [currentTitle, setCurrentTitle] = useState('')
  const isMobile = useIsMobile()

  const getInitials = (name) => {
    if (!name) return ''
    const words = name.trim().split(/\s+/)
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase()
    }
    const first = words[0].charAt(0)
    const last = words[words.length - 1].charAt(0)
    return `${first}${last}`.toUpperCase()
  }

  const handleDateClick = async ({ dateStr }) => {
    const title = prompt('Schedule title:')
    if (!title) return
    try {
      await createSchedule({ title, start: dateStr, end: null })
    } catch (e) {
      alert(`Failed to create: ${e.message}`)
    }
  }

  const handleEventClick = ({ event }) => {

    setCalendarInfo({ open: true, event })
  }

  const handleCalendarInfoOpenChange = (open) => {
    if (!open) setCalendarInfo(prev => ({ ...prev, open: false }))
  }

  const renderEventContent = (arg) => {
    const { timeText, event } = arg
    return (
      <div className="flex w-40 max-w-full flex-col m-auto rounded-md bg-blue-600/10 px-2 py-1 text-[11px] shadow-sm transition hover:bg-blue-600/20">
        <span className="block w-full max-w-full wrap-break-word whitespace-normal font-medium text-blue-700 leading-tight">{event.title}</span>
        {timeText && (
          <span className="mt-0.5 w-full max-w-full wrap-break-word whitespace-normal text-[10px] text-blue-800/80">{timeText}</span>
        )}
      </div>
    )
  }

  const eventClassNames = () => [
    '!bg-transparent',
    '!border-0',
    '!p-0',
    'cursor-pointer',
    'w-full',
    'max-w-full',
    'overflow-hidden',
    'mb-1.5'
  ]

  if (loading) return <Spinner />
  if (error) return <p className="text-sm text-destructive">Error: {error}</p>


  return (
    <>
      <CardHeader className="px-4 pb-0 pt-4 flex flex-col gap-3  sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center justify-between gap-2 w-full mb-4">
          <div className="flex items-center gap-1">
            <Button size="icon-sm" variant="outline" aria-label="Previous" className={`text-lg`} onClick={() => calendarRef.current?.getApi().prev()}>
              <IconChevronLeft />
            </Button>
            <Button size="icon-sm" variant="outline" aria-label="Next" className={`text-lg`} onClick={() => calendarRef.current?.getApi().next()}>
              <IconChevronRight />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={() => calendarRef.current?.getApi().today()}>
              Today
            </Button>
            <Button
              size="sm"
              variant='outline'
              aria-label="Month"
              onClick={() => calendarRef.current?.getApi().changeView('dayGridMonth')}

            >
              Month
            </Button>
            <Button
              size="sm"
              variant='outline'
              aria-label="Week"
              onClick={() => calendarRef.current?.getApi().changeView('timeGridWeek')}
            >
              Week
            </Button>
            <Button
              size="sm"
              variant='outline'
              aria-label="Day"
              onClick={() => calendarRef.current?.getApi().changeView('timeGridDay')}
            >
              Day
            </Button>
          </div>
        </div>
      </CardHeader>
      <div className='px-4 flex flex-col'>
        <div className="w-full flex flex-col gap-6 overflow-hidden rounded-lg bg-card py-6 text-sm text-card-foreground border ring-foreground/5 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 dark:ring-foreground/10 *:[img:first-child]:rounded-t-4xl *:[img:last-child]:rounded-b-4xl ">
          <div className="flex justify-center gap-2 w-full">

            <div className="text-lg font-bold  ">
              {currentTitle}
            </div>
          </div>
          <CardContent className="px-0 pb-0 sm:px-2">
            <div className="flex flex-col gap-4 overflow-y-auto max-h-screen px-4 text-sm scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="auto"
                contentHeight="auto"
                aspectRatio={1.6}
                stickyHeaderDates={true}
                nowIndicator={true}
                dayMaxEvents={3}
                allDaySlot={false}
                slotLabelFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }}
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }}
                viewDidMount={({ view }) => {
                  setCurrentViewType(view.type)
                  setCurrentTitle(view.title)
                }}
                datesSet={({ view }) => {
                  setCurrentViewType(view.type)
                  setCurrentTitle(view.title)
                }}
                headerToolbar={false}
                buttonText={{
                  today: 'Today',
                  month: 'Month',
                  week: 'Week',
                  day: 'Day',
                }}
                slotEventOverlap={false}
                editable={false}
                eventStartEditable={false}
                eventDurationEditable={false}
                eventResizableFromStart={false}
                events={events}
                // Only enable date click (creating new schedules) when an applicationId is provided.
                dateClick={applicationId ? handleDateClick : undefined}
                eventClick={handleEventClick}
                eventContent={renderEventContent}
                eventClassNames={eventClassNames}
              />
            </div>
          </CardContent>
        </div>
      </div>

      {/* Schedule details drawer */}
      <Drawer open={calendarInfo.open} onOpenChange={handleCalendarInfoOpenChange} direction={isMobile ? "bottom" : "right"}>
        <DrawerContent className="max-h-[55vh] md:max-h-[55vh] md:mt-[45vh]">
          <DrawerHeader>
            <DrawerTitle>Interview - {calendarInfo.event?.extendedProps?.employee_id ?? 'Schedule Details'}</DrawerTitle>
            <p className="text-sm text-muted-foreground">
              {calendarInfo.event?.extendedProps?.application_id ?? 'N/A'}
            </p>
          </DrawerHeader>
          <div className="flex flex-col gap-4 px-4 text-sm">
            <Separator />
            <div className="flex flex-col gap-3 mt-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconClock size={24} className='border p-1 rounded-full' />
                <span className="font-medium text-foreground">
                  {calendarInfo.event?.start
                    ? new Date(calendarInfo.event?.start).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: false,
                    })
                    : 'N/A'}
                  {calendarInfo.event?.end ? ` — ${new Date(calendarInfo.event?.end).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: false,
                  })}` : ''}

                </span>
              </div>

            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconUser size={24} className='border p-1 rounded-full' />
                <span className="font-medium text-foreground">Attendees</span>
              </div>
              <div className="flex items-center ml-8 gap-2 text-muted-foreground">
                <AvatarGroup>
                  {/* Applicant */}
                  <div className="relative group">
                    <Avatar className="size-8 border">
                      {calendarInfo.event?.extendedProps?.applicant_avatar && (
                        <AvatarImage
                          src={calendarInfo.event.extendedProps.applicant_avatar}
                          alt={calendarInfo.event.extendedProps.applicant_name}
                        />
                      )}
                      <AvatarFallback>
                        {getInitials(calendarInfo.event?.extendedProps?.applicant_name) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    {calendarInfo.event?.extendedProps?.applicant_name && (
                      <span className="pointer-events-none absolute left-1/2 top-[110%] -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                        {calendarInfo.event.extendedProps.applicant_name}
                      </span>
                    )}
                  </div>

                  {/* Assigned */}
                  {(calendarInfo.event?.extendedProps?.assigned_avatar || calendarInfo.event?.extendedProps?.assigned_name) && (
                    <div className="relative group">
                      <Avatar className="size-8 border">
                        {calendarInfo.event?.extendedProps?.assigned_avatar && (
                          <AvatarImage
                            src={calendarInfo.event.extendedProps.assigned_avatar}
                            alt={calendarInfo.event.extendedProps.assigned_name}
                          />
                        )}
                        <AvatarFallback>
                          {getInitials(calendarInfo.event?.extendedProps?.assigned_name) || 'R'}
                        </AvatarFallback>
                      </Avatar>
                      {calendarInfo.event?.extendedProps?.assigned_name && (
                        <span className="pointer-events-none absolute left-1/2 top-[110%] -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                          {calendarInfo.event.extendedProps.assigned_name}
                        </span>
                      )}
                    </div>
                  )}
                </AvatarGroup>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconLink size={24} className='border p-1 rounded-full' />
                <span className="font-medium text-foreground">
                  <a
                    href={calendarInfo.event?.extendedProps?.meet_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#378ADD] hover:underline break-all"
                  >Meeting Link</a>
                </span>
              </div>

            </div>

          </div>

          <DrawerFooter>
            <Button
              className="bg-[#378ADD] text-white"
              disabled={!calendarInfo.event?.extendedProps?.meet_link}
              onClick={() => {
                const link = calendarInfo.event?.extendedProps?.meet_link
                if (link) window.open(link, '_blank')
              }}
            >
              Join Meeting
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className={`cursor-pointer`}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer >

    </>
  )
}