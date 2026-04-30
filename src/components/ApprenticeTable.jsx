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
} from "@/components/ui/tabs"


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

const columns = () => [
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
        accessorKey: "email",
        header: "Email",
        cell: ({ row, table }) => (
            <ApprenticeCellViewer item={row.original} table={table} />
        ),
        enableHiding: false,
    },
    {
        accessorKey: "job",
        header: "Job",
        cell: ({ row }) => (
            <span>{row.original.applicant?.job?.title ?? 'N/A'}</span>
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



function ApprenticeCellViewer({ item, table }) {
    const isMobile = useIsMobile()
    const [open, setOpen] = React.useState(false)
    const [status, setStatus] = React.useState(item.status)
    const updateStatus = table?.options?.meta?.updateStatus

    const sendStatusEmail = async (email, applicantName, status, extraData = {}) => {
        const templates = {
            Accepted: {
                subject: "Congratulations! Your Application Has Been Accepted",
                html: `<h2>Application Accepted</h2><p>Hi ${applicantName},</p><p>We are pleased to inform you that you have been <strong>accepted</strong> for the mentorship program <strong>${extraData.jobTitle}</strong>.</p><p>We will be in touch shortly with the next steps.</p>`,
            },
            Rejected: {
                subject: "Update on Your Application",
                html: `<h2>Application Update</h2><p>Hi ${applicantName},</p><p>Thank you for your interest. After careful consideration, we regret to inform you that we will not be moving forward with your application for mentorship program<strong>${extraData.jobTitle}</strong>at this time.</p><p>We will inform you for the further details of why this happened. Thank you.</p>`,
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
        if (!updateStatus) return

        setOpen(false)
        const toastId = toast.loading('Updating application...')
        const success = await updateStatus(item.id, status)
        if (!success) {
            toast.error('Failed to update application', { id: toastId })
            setOpen(true)
            return
        }

        if (['Scheduled', 'Accepted', 'Rejected'].includes(status) && item.applicant?.email) {
            try {
                await sendStatusEmail(
                    item.applicant.email,
                    item.applicant?.display_name ?? 'Applicant',
                    status,
                    {
                        date: 'TBD',
                        start: 'TBD',
                        end: 'TBD',
                        meetingLink: null,
                        jobTitle: item.program?.title ?? 'Program',
                        assignedName: item.program?.mentor?.display_name ?? 'Mentor',
                    }
                )
            } catch (e) {
                toast.warning('Application updated but failed to send email', { id: toastId })
                setOpen(true)
                return
            }
        }

        toast.success('Application updated successfully!', { id: toastId })
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="w-fit px-0 text-left text-foreground cursor-pointer">
                    {item.applicant?.email ?? 'N/A'}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.applicant?.display_name}</DrawerTitle>
                    <DrawerDescription>
                        {item.applicant?.email}
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

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="status">Status</Label>
                            <Select defaultValue={item.status} onValueChange={setStatus}>
                                <SelectTrigger id="status" className="w-full">
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Accepted">Accepted</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
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
                    <Button
                        className="bg-[#378ADD] text-white cursor-pointer"
                        onClick={handleSubmit}  >
                        Apply
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" className="cursor-pointer">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export function DataTable({ data: initialData, updateStatus }) {
    const [data, setData] = React.useState(() => initialData)
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

    const [deleteModal, setDeleteModal] = React.useState({ open: false, applicationId: null })
    // Pass setDeleteModal into columns

    React.useEffect(() => {
        setData(initialData)
    }, [initialData])



    const table = useReactTable({
        data,
        columns: columns(),
        meta: { updateStatus },
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
        <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
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
            <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
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
                                        <TableCell colSpan={columns().length} className="h-24 text-center">
                                            No result.
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