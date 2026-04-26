import * as React from "react"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDotsVertical,
    IconGripVertical,
    IconLayoutColumns,
    IconPlus,
    IconTrashFilled,
    IconRefresh
} from "@tabler/icons-react"
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { toast } from "sonner"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"


import { CalendarWithTime } from "@/components/CalendarWithTime"
import { useSchedules } from "@/hooks/useSchedules"
import useStorageUrl from '@/hooks/useStorageUrl'
import useUsers from "@/hooks/useUsers"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


const tabs = ['All', 'Pending', 'Scheduled', 'Accepted', 'Rejected'];

function DragHandle({ id }) {
    const { attributes, listeners } = useSortable({ id })

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:bg-transparent"
        >
            <IconGripVertical className="size-3 text-muted-foreground" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

const columns = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "applicant",
        header: "Applicant",
        cell: ({ row, table }) => <TableCellViewer item={row.original} table={table} />,
        enableHiding: false,
    },
    {
        accessorKey: "job",
        header: "Job Applied",
        cell: ({ row }) => (
            <span>{row.original.job?.title ?? 'N/A'}</span>
        ),
    },
    {
        accessorKey: "site",
        header: "Site",
        cell: ({ row }) => (
            <span>{row.original.job?.site ?? 'N/A'}</span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;

            const statusStyles = {
                Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
                Accepted: "bg-green-100 text-green-700 border-green-300",
                Scheduled: "bg-blue-100 text-blue-700 border-blue-300",
                Rejected: "bg-red-100 text-red-700 border-red-300",
            }

            return (
                <Badge
                    variant="outline"
                    className={`px-1.5 ${statusStyles[status] ?? "text-muted-foreground"}`}
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "reviewer",
        header: "Reviewer",
        cell: ({ row }) => (
            <span>{row.original.reviewer?.display_name ?? 'No Reviewer'}</span>
        ),
    },
    {
        accessorKey: "date applied",
        header: "Date Applied",
        cell: ({ row }) => (
            <span>{new Date(row.original.created_at).toLocaleDateString()}</span>
        ),
    },
]

function DraggableRow({ row }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

function TableCellViewer({ item, table }) {
    const isMobile = useIsMobile()
    const { user } = useUsers()
    const updateStatus = table?.options?.meta?.updateStatus;
    const assigneeOptions = table?.options?.meta?.assigneeOptions ?? [];
    const { createSchedule, updateSchedule, events } = useSchedules(item.id) // pass application id here
    const [status, setStatus] = React.useState(item.status)
    const [open, setOpen] = React.useState(false)
    const { getPublicUrl } = useStorageUrl('applications')
    const autoOpenApplicantName = table?.options?.meta?.autoOpenApplicantName ?? null
    const autoOpenHandled = table?.options?.meta?.autoOpenHandled ?? false
    const markAutoOpenHandled = table?.options?.meta?.markAutoOpenHandled

    const [scheduleOpen, setScheduleOpen] = React.useState(false)
    const [scheduleDate, setScheduleDate] = React.useState(null)
    const [startTime, setStartTime] = React.useState("")
    const [endTime, setEndTime] = React.useState("")
    const [meetingLink, setMeetingLink] = React.useState(events[0]?.extendedProps?.meet_link ?? "")
    React.useEffect(() => {
        setMeetingLink(events[0]?.extendedProps?.meet_link ?? "")
    }, [events])


    const [reviewer, setReviewer] = React.useState(
        item.reviewer?.display_name ?? null
    );
    const [reviewerId, setReviewerId] = React.useState(
        item.reviewer?.id ?? null
    );

    React.useEffect(() => {
        if (!reviewerId && user?.id) {
            setReviewer(user.display_name);
            setReviewerId(user.id);  // the UUID for the FK
        }
    }, [user]);

    const [assigned, setAssigned] = React.useState(item.assigned?.id ?? null)

    React.useEffect(() => {
        if (events.length > 0) {
            const existing = events[0]  // most recent schedule for this application
            const start = new Date(existing.start)
            const end = new Date(existing.end)

            setScheduleDate(start)
            setStartTime(start.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
            setEndTime(end.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        }
    }, [events]);

    React.useEffect(() => {
        if (!autoOpenApplicantName || autoOpenHandled) return;
        const applicantName = item.applicant?.display_name ?? "";
        if (applicantName.toLowerCase() === autoOpenApplicantName.toLowerCase()) {
            setOpen(true);
            if (typeof markAutoOpenHandled === "function") {
                markAutoOpenHandled();
            }
        }
    }, [autoOpenApplicantName, autoOpenHandled, item.applicant?.display_name, markAutoOpenHandled]);

    const buildDateTime = (date, timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':')
        const dt = new Date(date)
        dt.setHours(Number(hours), Number(minutes), Number(seconds ?? 0))
        return dt.toISOString()
    };

    const sendStatusEmail = async (email, applicantName, status, extraData = {}) => {
        const templates = {
            Scheduled: {
                subject: "Your Interview Has Been Scheduled",
                html: `<h2>Interview Scheduled</h2><p>Hi ${applicantName},</p><p>Your interview for the position of <strong>${extraData.jobTitle}</strong> has been scheduled on <strong>${extraData.date}</strong> from <strong>${extraData.start}</strong> to <strong>${extraData.end}</strong>.<p>Your interviewer will be <strong>${extraData.assignedName}</strong>. </p>${extraData.meetingLink ? `<p>Join the meeting using the link below:</p><p><a href="${extraData.meetingLink}" target="_blank">${extraData.meetingLink}</a></p>` : ''}<p>Please be available at the scheduled time.</p>`,
            },
            Accepted: {
                subject: "Congratulations! Your Application Has Been Accepted",
                html: `<h2>Application Accepted</h2><p>Hi ${applicantName},</p><p>We are pleased to inform you that you have been <strong>accepted</strong> for the position of <strong>${extraData.jobTitle}</strong>.</p><p>We will be in touch shortly with the next steps.</p>`,
            },
            Rejected: {
                subject: "Update on Your Application",
                html: `<h2>Application Update</h2><p>Hi ${applicantName},</p><p>Thank you for your interest. After careful consideration, we regret to inform you that we will not be moving forward with your application for the position of <strong>${extraData.jobTitle}</strong>at this time.</p><p>We wish you the best in your job search.</p>`,
            },
        }

        const template = templates[status]
        if (!template) return

        const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                    to: email,
                    subject: template.subject,
                    html: template.html,
                }),
            }
        )

        const data = await response.json()
        if (!response.ok) throw new Error(data.error ?? "Failed to send email")

        return data
    }

    const handleSubmit = async () => {
        const toastId = toast.loading('Updating application...')

        const success = await updateStatus(item.id, status, reviewerId, assigned)
        if (!success) {
            toast.error('Failed to update application', { id: toastId })
            return
        }

        if (status === 'Scheduled' && scheduleDate && startTime && endTime) {
            try {
                if (events.length > 0) {
                    await updateSchedule(events[0].id, {
                        start: buildDateTime(scheduleDate, startTime),
                        end: buildDateTime(scheduleDate, endTime),
                        meetingLink,

                    })
                } else {
                    await createSchedule({
                        title: `Interview – ${item.applicant?.employee_id ?? item.id}`,
                        start: buildDateTime(scheduleDate, startTime),
                        end: buildDateTime(scheduleDate, endTime),
                        meetingLink,
                    })
                }
            } catch (e) {
                toast.error(`Failed to save schedule: ${e.message}`, { id: toastId })
                return
            }
        }

        if (['Scheduled', 'Accepted', 'Rejected'].includes(status) && item.applicant?.email) {
            try {
                await sendStatusEmail(
                    item.applicant.email,
                    item.applicant?.display_name ?? 'Applicant',
                    status,
                    { date: scheduleDate, start: startTime, end: endTime, meetingLink, jobTitle: item.job?.title, assignedName: assigneeOptions.find(u => u.id === assigned)?.display_name ?? null }
                )
            } catch (e) {
                toast.warning('Application updated but failed to send email', { id: toastId })
                setOpen(false)
                setTimeout(() => window.location.reload(), 1500)
                return
            }
        }

        toast.success('Application updated successfully!', { id: toastId })
        setOpen(false)

    };


    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="w-fit px-0 text-left text-foreground cursor-pointer">
                    {item.applicant?.display_name ?? 'N/A'}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.applicant?.employee_id ?? 'N/A'}</DrawerTitle>
                    <div className="flex gap-2 leading-none ">
                        {item.applicant?.display_name}
                    </div>

                    <a href={`/profile/${item.applicant?.id}`} target="_blank" className="flex gap-2 leading-none text-muted-foreground hover:underline">
                        {item.applicant?.email}
                    </a>

                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                    {!isMobile && (
                        <>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="text-muted-foreground">
                                    Applied on {new Date(item.created_at).toLocaleString('en-US', {
                                        timeZone: 'Asia/Taipei',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false

                                    })}
                                </div>
                                <div className="text-muted-foreground mb-2">

                                    Last updated {new Date(item.updated_at).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    })}
                                </div>
                                <Separator />
                            </div>

                        </>
                    )}
                    <div className="flex flex-col gap-4">
                        <div className="grid  gap-4">
                            <div className="flex flex-col gap-3">
                                <Label>Job Applied</Label>
                                <Input defaultValue={item.job?.title ?? 'N/A'} className={`cursor-default`} readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label>Site</Label>
                                <Input defaultValue={item.job?.site ?? 'N/A'} className={`cursor-default`} readOnly />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="status">Status</Label>
                                <Select defaultValue={item.status} onValueChange={setStatus}>
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                                        <SelectItem value="Accepted">Accepted</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label>Resume</Label>
                                {item.resume_url ? (
                                    <a href={getPublicUrl(item.resume_url)} target="_blank" rel="noreferrer">
                                        <Button variant="outline" className={`cursor-pointer`} size="sm">View Resume</Button>
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground">No resume</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label>Cover Letter</Label>
                                {item.cover_letter_url ? (
                                    <a href={getPublicUrl(item.cover_letter_url)} target="_blank" rel="noreferrer">
                                        <Button variant="outline" className={`cursor-pointer`} size="sm">View Cover Letter</Button>
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground">No cover letter</span>
                                )}
                            </div>

                        </div>
                        <Separator />
                        <div className="flex flex-col gap-3">
                            <Label>Interview Schedule</Label>
                            <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2 cursor-pointer font-normal"
                                    >

                                        {scheduleDate ? (
                                            <span>
                                                {scheduleDate.toLocaleDateString('en-US', {
                                                    timeZone: 'Asia/Taipei', month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                                {startTime && endTime && ` · ${startTime} – ${endTime}`}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">Pick a date & time</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    side="left"
                                    align="center"
                                    sideOffset={30}
                                    alignOffset={-4}
                                    className="w-full p-0 "
                                >
                                    <CalendarWithTime
                                        date={scheduleDate}
                                        onDateChange={(d) => { setScheduleDate(d) }}
                                        startTime={startTime}
                                        onStartTimeChange={setStartTime}
                                        endTime={endTime}
                                        onEndTimeChange={setEndTime}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="meeting">Meeting Link</Label>
                            <input
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                className="w-full rounded-full border px-3 py-2 text-sm focus:outline-none resize-none bg-background" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="assgined">Assigned To</Label>
                            <Select value={assigned ?? ''} onValueChange={setAssigned}>
                                <SelectTrigger id="assigned" className="w-full">
                                    <SelectValue placeholder="Select an assignee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assigneeOptions.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.display_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="reviewer">Reviewer</Label>
                            <Input
                                id="reviewer"
                                value={reviewer ?? 'No Reviewer'}
                                placeholder=""
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="application_id">Application ID</Label>
                            <Input defaultValue={item.id ?? 'No Result'} className={`cursor-default`} readOnly />
                        </div>


                    </div>
                </div>

                <DrawerFooter>
                    <Button onClick={handleSubmit} className="bg-[#378ADD] text-white">Apply</Button>
                    <DrawerClose asChild>
                        <Button variant="outline" className={`cursor-pointer`}>Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export function DataTable({ data: initialData, autoOpenApplicantName, assigneeOptions, updateStatus }) {
    const [selectedTab, setSelectedTab] = React.useState('All');
    const [autoOpenHandled, setAutoOpenHandled] = React.useState(false);
    const filteredData = React.useMemo(() => {
        if (selectedTab === 'All') return initialData;
        return initialData.filter(row => row.status === selectedTab);
    }, [initialData, selectedTab]);

    const [data, setData] = React.useState(filteredData)
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState([])
    const [sorting, setSorting] = React.useState([])
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    const dataIds = React.useMemo(
        () => data?.map(({ id }) => id) || [],
        [data]
    )

    React.useEffect(() => {
        setData(filteredData);
    }, [filteredData]);

    React.useEffect(() => {
        setPagination(p => ({ ...p, pageIndex: 0 }));
    }, [selectedTab]);

    React.useEffect(() => {
        if (autoOpenApplicantName) {
            setSelectedTab('All');
            setAutoOpenHandled(false);
        }
    }, [autoOpenApplicantName]);



    const table = useReactTable({
        data,
        columns,
        meta: {
            autoOpenApplicantName,
            autoOpenHandled,
            markAutoOpenHandled: () => setAutoOpenHandled(true),
            updateStatus,
            assigneeOptions,
        },
        state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    function handleDragEnd(event) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }


    return (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-2 sm:px-4 ">
                <Label htmlFor="view-selector" className="sr-only">View</Label>
                <Select value={selectedTab} onValueChange={setSelectedTab}>
                    <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        {tabs.map(tab => (
                            <SelectItem key={tab} value={tab}>{tab}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
                    {tabs.map(tab => (
                        <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
                    ))}
                </TabsList>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <button onClick={() => window.location.reload()} className="bg-white border p-1 rounded-full hover:shadow-sm cursor-pointer">
                            <IconRefresh size={18} color="#1f2937" />
                        </button>
                        <DropdownMenuTrigger asChild>
                            <Button variant="default" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table.getAllColumns()
                                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <TabsContent value={selectedTab} className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-white">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} colSpan={header.colSpan}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8 bg-white">
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row} />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
            </TabsContent>

            <div className="flex items-center justify-between px-2 sm:px-4">
                <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">Rows per page</Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>{pageSize}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                            <span className="sr-only">Go to first page</span>
                            <IconChevronsLeft />
                        </Button>
                        <Button variant="outline" className="size-8" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            <span className="sr-only">Go to previous page</span>
                            <IconChevronLeft />
                        </Button>
                        <Button variant="outline" className="size-8" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            <span className="sr-only">Go to next page</span>
                            <IconChevronRight />
                        </Button>
                        <Button variant="outline" className="hidden size-8 lg:flex" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                            <span className="sr-only">Go to last page</span>
                            <IconChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </Tabs>
    )
}