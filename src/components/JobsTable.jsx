import * as React from "react"
import { useState } from "react"
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
    DrawerDescription
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

import useJobs from "@/hooks/useJobs"



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
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => <TableCellViewer item={row.original} />,
        enableHiding: false,
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <span>{row.original.type ?? 'N/A'}</span>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
            <span>{row.original.category ?? 'N/A'}</span>
        ),
    },
    {
        accessorKey: "salary",
        header: "Salary",
        cell: ({ row }) => (
            <span>{row.original.salary ?? 'N/A'}</span>
        ),
    },
    {
        accessorKey: "site",
        header: "Site",
        cell: ({ row }) => (
            <span>{row.original.companies?.location ?? 'N/A'}</span>
        ),
    },
    {
        accessorKey: "date added",
        header: "Date Added",
        cell: ({ row }) => (
            <span>{new Date(row.original.created_at).toLocaleDateString()}</span>
        ),
    },
    {
        id: "actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">


                    <DropdownMenuItem variant="destructive"><IconTrashFilled className="-mt-0.5" color="#cc0000" /> Delete</DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
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

function TableCellViewer({ item }) {
    const isMobile = useIsMobile()
    const { updateJob } = useJobs()
    const [open, setOpen] = React.useState(false)
    const [title, setTitle] = React.useState(item.title);
    const [type, setType] = React.useState(item.type);
    const [category, setCategory] = React.useState(item.category);
    const [salary, setSalary] = React.useState(item.salary);
    const [description, setDescription] = React.useState(item.description);

    const handleSubmit = async () => {
        const toastId = toast.loading('Updating application')
        const success = await updateJob(item.id, title, type, category, salary, description)

        if (!success) {
            toast.error('Failed to update application', { id: toastId })
            return
        }
        toast.success('Application updated successfully!', { id: toastId })

        setOpen(false)

        setTimeout(() => {
            window.location.reload()
        }, 1500)
    }


    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="w-fit px-0 text-left text-foreground cursor-pointer">
                    {item.title ?? 'N/A'}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <div className="flex flex-col gap-3">

                        <Input value={title} onChange={(e) => setTitle(e.target.value)} className={`bg-white border border-gray-200 h-12 px-4`} />
                    </div>
                </DrawerHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                    {!isMobile && (
                        <>
                            <Separator />
                            <div className="grid gap-2 ">
                                <div className="text-muted-foreground">
                                    Posted on {new Date(item.created_at).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',

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
                                        hour12: true
                                    })}
                                </div>
                                <Separator />
                            </div>

                        </>
                    )}
                    <div className="flex flex-col gap-4">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label>Type</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="On-site">On-site</SelectItem>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-3">
                                    <Label>Salary</Label>
                                    <Select value={salary} onValueChange={setSalary}>
                                        <SelectTrigger id="salary" className="w-full">
                                            <SelectValue placeholder="Select salary" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SG 25">SG 25</SelectItem>
                                            <SelectItem value="SG 26">SG 26</SelectItem>
                                            <SelectItem value="SG 27">SG 27</SelectItem>
                                            <SelectItem value="SG 28">SG 28</SelectItem>
                                            <SelectItem value="SG 29">SG 29</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="categpry">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger id="category" className="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Technology">Technology</SelectItem>
                                        <SelectItem value="Design">Design</SelectItem>
                                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                                        <SelectItem value="Bussiness Management">Bussiness Management</SelectItem>
                                        <SelectItem value="Technical Support">Technical Support</SelectItem>
                                        <SelectItem value="Leadership">Leadership</SelectItem>
                                        <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
                                        <SelectItem value="Knowledge & Development">Knowledge & Development</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>


                        <div className="flex flex-col gap-3">

                            <Label htmlFor="description">Description</Label>
                            <textarea
                                className="w-full px-4 py-2 text-sm border rounded-3xl text-gray-600 focus:outline-none resize-none "
                                rows={8}
                                value={description ?? ""}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="job_id">Job ID</Label>
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

function AddJobDrawer() {
    const isMobile = useIsMobile()
    const [open, setOpen] = useState(false);
    const { submitJob, submitting } = useJobs()


    const [formData, setFormData] = useState({
        title: "",
        company: "",
        salary: "",
        type: "",
        description: "",
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }


    const handleSubmit = async () => {

        const jobPayload = {
            title: formData.title,
            type: formData.type,
            category: formData.category,
            description: formData.description,
            salary: formData.salary,
        }

        const result = await submitJob(jobPayload)

        if (result.success) {
            setFormData({
                title: "",
                type: "",
                category: "",
                description: "",
                salary: "",
                company: "",
            })

            toast.success("Job posted successfully")
            setOpen(false)

            setTimeout(() => {
                window.location.reload()
            }, 1500)

        } else {
            toast.error(result.error)
        }

    }

    const isFormValid =
        formData.title &&
        formData.type &&
        formData.category &&
        formData.description &&
        formData.salary

    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="default" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Add Job</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>Add Job</DrawerTitle>
                    <DrawerDescription>Fill in the details to post a new job.</DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                    <Separator />
                    <div className="flex flex-col gap-4">
                        <div className="grid  gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="title">Job Title</Label>
                                <Input id="title" value={formData.title} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="category">Job Category</Label>

                            <Select
                                value={formData.category}
                                onValueChange={(value) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        category: value
                                    }))
                                }
                            >
                                <SelectTrigger id="category" className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="Technology">Technology</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                                    <SelectItem value="Business Management">Business Management</SelectItem>
                                    <SelectItem value="Technical Support">Technical Support</SelectItem>
                                    <SelectItem value="Leadership">Leadership</SelectItem>
                                    <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
                                    <SelectItem value="Knowledge & Development">Knowledge & Development</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="salary">Salary</Label>

                                <Select
                                    value={formData.salary}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            salary: value
                                        }))
                                    }
                                >
                                    <SelectTrigger id="salary" className="w-full">
                                        <SelectValue placeholder="Select salary" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="SG 25">SG 25</SelectItem>
                                        <SelectItem value="SG 26">SG 26</SelectItem>
                                        <SelectItem value="SG 27">SG 27</SelectItem>
                                        <SelectItem value="SG 28">SG 28</SelectItem>
                                        <SelectItem value="SG 29">SG 29</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="type">Employment Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            type: value
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="On-site">On-site</SelectItem>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={7}
                                placeholder="Write a description..."
                                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none resize-none bg-background"
                            />
                        </div>
                    </div>
                </div>

                <DrawerFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid || submitting}
                        className="bg-[#378ADD] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Posting..." : "Post Job"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export function DataTable({ data: initialData }) {
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


    return (
        <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-4 lg:px-6 ">
                <Label htmlFor="view-selector" className="sr-only">View</Label>
                <Select defaultValue="outline" >
                    <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="past-performance">Past Performance</SelectItem>
                        <SelectItem value="key-personnel">Key Personnel</SelectItem>
                        <SelectItem value="focus-documents">Focus Documents</SelectItem>
                    </SelectContent>
                </Select>
                <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="outline">Outline</TabsTrigger>
                    <TabsTrigger value="past-performance">
                        Past Performance <Badge variant="secondary">3</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="key-personnel">
                        Key Personnel <Badge variant="secondary">2</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
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

                    <AddJobDrawer setData={setData} />

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
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
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
                <div className="flex items-center justify-between px-4">
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
            </TabsContent>
            <TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
        </Tabs>
    )
}