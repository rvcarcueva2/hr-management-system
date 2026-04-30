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
    IconGripVertical,
    IconLayoutColumns,
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
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
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



import { useSchedules } from "@/hooks/useSchedules"
import useStorageUrl from '@/hooks/useStorageUrl'
import useUsers from "@/hooks/useUsers"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import useMyApplications from "@/hooks/useMyApplications"

const tabs = ['Job Application', 'Mentorship Application'];

const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Accepted: "bg-green-100 text-green-700 border-green-300",
    Scheduled: "bg-blue-100 text-blue-700 border-blue-300",
    Rejected: "bg-red-100 text-red-700 border-red-300",
};

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

const getJobColumns = (setDeleteModal) => [
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
        accessorKey: "job",
        header: "Job Applied",
        cell: ({ row }) => <TableCellViewer item={row.original} setDeleteModal={setDeleteModal} />,
        enableHiding: false,
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
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className={`px-1.5 ${statusStyles[row.original.status] ?? "text-muted-foreground"}`}
            >
                {row.original.status}
            </Badge>
        ),
    },
    {
        accessorKey: "Reviewer",
        header: "Reviewer",
        cell: ({ row }) => (
            <span>{row.original.reviewer?.display_name ?? 'N/A'}</span>
        )

    },
    {
        accessorKey: "date applied",
        header: "Date Applied",
        cell: ({ row }) => (
            <span>{new Date(row.original.created_at).toLocaleDateString()}</span>
        ),
    },
    {
        accessorKey: "date updated",
        header: "Date Updated",
        cell: ({ row }) => (
            <span>{new Date(row.original.updated_at).toLocaleDateString()}</span>
        ),
    },
]

const getApprenticeColumns = () => [
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
        accessorKey: "program",
        header: "Program",
        cell: ({ row }) => <ApprenticeCellViewer item={row.original} />,
        enableHiding: false,
    },
    {
        accessorKey: "mentor",
        header: "Mentor",
        cell: ({ row }) => (
            <span>{row.original.program?.mentor?.display_name ?? 'N/A'}</span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className={`px-1.5 ${statusStyles[row.original.status] ?? "text-muted-foreground"}`}
            >
                {row.original.status}
            </Badge>
        ),
    },
    {
        accessorKey: "date applied",
        header: "Date Applied",
        cell: ({ row }) => (
            <span>{new Date(row.original.created_at).toLocaleDateString()}</span>
        ),
    },
    {
        accessorKey: "date updated",
        header: "Date Updated",
        cell: ({ row }) => (
            <span>{new Date(row.original.updated_at).toLocaleDateString()}</span>
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

// 1. Update TableCellViewer signature to accept setDeleteModal
function TableCellViewer({ item, setDeleteModal }) {
    const isMobile = useIsMobile()
    const { user } = useUsers()
    const { events } = useSchedules(item.id)
    const [status] = React.useState(item.status)
    const [open, setOpen] = React.useState(false)
    const { getPublicUrl } = useStorageUrl('applications')
    const [scheduleOpen, setScheduleOpen] = React.useState(false)
    const [scheduleDate, setScheduleDate] = React.useState(null)
    const [startTime, setStartTime] = React.useState("")
    const [endTime, setEndTime] = React.useState("")
    const [meetingLink, setMeetingLink] = React.useState(events[0]?.extendedProps?.meet_link ?? "")

    React.useEffect(() => {
        setMeetingLink(events[0]?.extendedProps?.meet_link ?? "")
    }, [events])

    const [reviewer, setReviewer] = React.useState(item.reviewer?.display_name ?? null)
    const [reviewerId, setReviewerId] = React.useState(item.reviewer?.id ?? null)

    React.useEffect(() => {
        if (!reviewerId && user?.id) {
            setReviewer(user.display_name)
            setReviewerId(user.id)
        }
    }, [user])

    const [assigned, setAssigned] = React.useState(item.assigned?.display_name ?? null)

    React.useEffect(() => {
        if (events.length > 0) {
            const existing = events[0]
            const start = new Date(existing.start)
            const end = new Date(existing.end)
            setScheduleDate(start)
            setStartTime(start.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
            setEndTime(end.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        }
    }, [events])

    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="w-fit px-0 text-left text-foreground cursor-pointer">
                    {item.job?.title ?? 'N/A'}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>Application Information</DrawerTitle>
                    <DrawerDescription>
                        Your application is still pending and under review. Please wait for your scheduled time of interview.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                    {!isMobile && (
                        <>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="text-muted-foreground">
                                    Applied on {new Date(item.created_at).toLocaleString('en-US', {
                                        timeZone: 'Asia/Taipei', month: 'short', day: 'numeric',
                                        year: 'numeric', hour: 'numeric', minute: '2-digit',
                                        second: '2-digit', hour12: false
                                    })}
                                </div>
                                <div className="text-muted-foreground mb-2">
                                    Last updated {new Date(item.updated_at).toLocaleString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric',
                                        hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: false
                                    })}
                                </div>
                                <Separator />
                            </div>
                        </>
                    )}
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-4">
                            <div className="flex flex-col gap-3">
                                <Label>Job Applied</Label>
                                <Input defaultValue={item.job?.title ?? 'N/A'} className="cursor-default" readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label>Site</Label>
                                <Input defaultValue={item.job?.site ?? 'N/A'} className="cursor-default" readOnly />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="status">Status</Label>
                                <Input defaultValue={status} className="cursor-default" readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label>Resume</Label>
                                {item.resume_url ? (
                                    <a href={getPublicUrl(item.resume_url)} target="_blank" rel="noreferrer">
                                        <Button variant="outline" className="cursor-pointer" size="sm">View Resume</Button>
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground">No resume</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Cover Letter</Label>
                                {item.cover_letter_url ? (
                                    <a href={getPublicUrl(item.cover_letter_url)} target="_blank" rel="noreferrer">
                                        <Button variant="outline" className="cursor-pointer" size="sm">View Cover Letter</Button>
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
                                    <Button variant="outline" className="w-full justify-start gap-2 font-normal">
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
                            </Popover>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="meeting">Meeting Link</Label>
                            <Input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} readOnly />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="assigned">Assigned Interviewer</Label>
                            <Input value={assigned ?? 'Not yet assigned'} className="cursor-default" readOnly />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="reviewer">Reviewer</Label>
                            <Input id="reviewer" value={reviewer ?? 'No Reviewer'} readOnly className="cursor-default" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="application_id">Application ID</Label>
                            <Input defaultValue={item.id ?? 'No Result'} readOnly />
                        </div>
                    </div>
                </div>
                <DrawerFooter>
                    <Button
                        disabled={!meetingLink}
                        onClick={() => {
                            const link = meetingLink
                            if (link) window.open(link, '_blank')
                        }}
                        className="bg-[#378ADD] text-white">Join Meeting</Button>

                    <Button
                        onClick={() => {
                            setOpen(false)
                            setDeleteModal({ open: true, applicationId: item.id })
                        }}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        Delete Application
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" className="cursor-pointer">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
};

function ApprenticeCellViewer({ item }) {
    const isMobile = useIsMobile()
    const [open, setOpen] = React.useState(false)

    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="w-fit px-0 text-left text-foreground cursor-pointer">
                    {item.program?.title ?? 'N/A'}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>Mentorship Application</DrawerTitle>
                    <DrawerDescription>
                        Your mentorship application is under review. Please wait for the mentor's approval.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                    {!isMobile && (
                        <>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="text-muted-foreground">
                                    Applied on {new Date(item.created_at).toLocaleString('en-US', {
                                        timeZone: 'Asia/Taipei', month: 'short', day: 'numeric',
                                        year: 'numeric', hour: 'numeric', minute: '2-digit',
                                        second: '2-digit', hour12: false
                                    })}
                                </div>
                                <div className="text-muted-foreground mb-2">
                                    Last updated {new Date(item.updated_at).toLocaleString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric',
                                        hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: false
                                    })}
                                </div>
                                <Separator />
                            </div>
                        </>
                    )}
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-4">
                            <div className="flex flex-col gap-3">
                                <Label>Program</Label>
                                <Input defaultValue={item.program?.title ?? 'N/A'} className="cursor-default" readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label>Mentor</Label>
                                <Input
                                    defaultValue={item.program?.mentor?.display_name ?? 'N/A'}
                                    className="cursor-default"
                                    readOnly
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="status">Status</Label>
                                <Input defaultValue={item.status ?? 'N/A'} className="cursor-default" readOnly />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label>Topic</Label>
                            <Input defaultValue={item.program?.topic ?? 'N/A'} className="cursor-default" readOnly />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Type</Label>
                            <Input defaultValue={item.program?.type ?? 'N/A'} className="cursor-default" readOnly />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="application_id">Application ID</Label>
                            <Input defaultValue={item.id ?? 'No Result'} readOnly />
                        </div>
                    </div>
                </div>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline" className="cursor-pointer">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export function DataTable({ data: initialData, apprenticeData = [] }) {
    const [selectedTab, setSelectedTab] = React.useState('Job Application');
    const filteredData = React.useMemo(() => {
        if (selectedTab === 'Mentorship Application') return apprenticeData;
        return initialData;
    }, [initialData, apprenticeData, selectedTab]);

    const { deleteApplication } = useMyApplications()
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
        setPagination(p => ({ ...p, pageIndex: 0 })); // reset to page 1 on tab change
    }, [filteredData]);

    const [deleteModal, setDeleteModal] = React.useState({ open: false, applicationId: null })
    // Pass setDeleteModal into columns
    const columns = React.useMemo(() => {
        if (selectedTab === 'Mentorship Application') return getApprenticeColumns();
        return getJobColumns(setDeleteModal);
    }, [selectedTab, setDeleteModal])

    const handleDelete = async () => {
        if (!deleteModal.applicationId) {
            toast.error('No application selected')
            return
        }
        const success = await deleteApplication(deleteModal.applicationId)
        if (!success) {
            toast.error('Failed to delete application')
            return
        }
        toast.success('Application deleted successfully')
        setDeleteModal({ open: false, applicationId: null })
        setTimeout(() => window.location.reload(), 1500)
    }


    const table = useReactTable({
        data,
        columns,
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


    const emptyMessage = selectedTab === 'Mentorship Application'
        ? "You don't have a mentorship application yet."
        : "You don't have an application yet.";

    return (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-2 sm:px-4 ">

                {deleteModal.open && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 supports-backdrop-filter:backdrop-blur-xs">
                        <div className="bg-gray-50 rounded-lg shadow-lg w-full max-w-md p-8">
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">
                                Confirm to delete this application
                            </h2>
                            <Separator />

                            <p className="mt-4 text-sm text-gray-600">
                                This action cannot be undone. Once deleted, your application not be proccessed anymore.
                            </p>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteModal({ open: false, jobId: null })}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>


                    </div>
                )}
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
                            <Button variant="outline" size="sm">
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
                                            {emptyMessage}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
            </TabsContent>


        </Tabs>
    )
}