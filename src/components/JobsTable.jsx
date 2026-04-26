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
    IconRefresh,
    IconX
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
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
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
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,

} from "@/components/ui/card"

import useJobs from "@/hooks/useJobs"
import useCourses from "@/hooks/useCourses"



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

const getColumns = (setDeleteModal) => [
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
            <span>{row.original.site ?? 'N/A'}</span>
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
        cell: ({ row }) => (
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
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteModal({ open: true, jobId: row.original.id })}
                    >
                        <IconTrashFilled className="-mt-0.5" color="#cc0000" />
                        Delete
                    </DropdownMenuItem>
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
    const { updateJob, updateCourses } = useJobs()
    const [open, setOpen] = React.useState(false)
    const [title, setTitle] = React.useState(item.title);
    const [type, setType] = React.useState(item.type);
    const [category, setCategory] = React.useState(item.category);
    const [salary, setSalary] = React.useState(item.salary);
    const [site, setSite] = React.useState(item.site);
    const [description, setDescription] = React.useState(item.description);
    const [isVisible, setIsVisible] = React.useState(Boolean(item.is_visible));
    const [courses, setCourses] = React.useState([]);
    const { courses: existingCourses, loading: coursesLoading } = useCourses(item.id)
    React.useEffect(() => {
        if (coursesLoading) return  // ✅ wait until fetch is done
        if (existingCourses.length === 0) return

        setCourses(existingCourses.map(c => ({
            id: c.id,
            title: c.title,
            link: c.course_link,
        })))
    }, [coursesLoading])

    const addCourse = () => {
        setCourses(prev => [...prev, { id: Date.now(), title: "", link: "" }])
    }

    const updateCourse = (id, field, value) => {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
    }


    const removeCourse = (id) => {
        setCourses(prev => prev.filter(c => c.id !== id))
    }

    const handleSubmit = async () => {
        const toastId = toast.loading('Updating job...')

        const jobSuccess = await updateJob(item.id, title, type, category, salary, description, site, isVisible)

        if (!jobSuccess) {
            toast.error('Failed to update job', { id: toastId })
            return
        }

        const validCourses = courses.filter(c => c.title?.trim() && c.link?.trim())
        const coursesSuccess = await updateCourses(item.id, validCourses)

        if (!coursesSuccess) {
            toast.error('Job updated but failed to save courses', { id: toastId })
            return
        }

        toast.success('Job updated successfully!', { id: toastId })
        setOpen(false)
        setTimeout(() => window.location.reload(), 1500)
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
                            <Label htmlFor="description">Site</Label>
                            <Input id="site" value={site} onChange={(e) => setSite(e.target.value)} className={`bg-white border-gray`} />
                        </div>


                        <div className="flex flex-col gap-3">

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="category">Category</Label>
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
                            <Label>Courses</Label>

                            {courses.map((course) => (
                                <div key={course.id} className="flex gap-2 items-center">
                                    <Input
                                        placeholder="Course title"
                                        value={course.title}
                                        onChange={(e) => updateCourse(course.id, "title", e.target.value)}
                                        className={`bg-white border border-gray-200`}

                                    />
                                    <Input
                                        placeholder="Course link"
                                        value={course.link}
                                        onChange={(e) => updateCourse(course.id, "link", e.target.value)}
                                        className={`bg-white border border-gray-200`}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeCourse(course.id)}
                                        className="shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <IconX className="size-4" />
                                    </Button>
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                onClick={addCourse}
                                className="w-full border-dashed cursor-pointer hover:border-[#378ADD] text-gray-600 hover:text-[#378ADD]"
                            >
                                <IconPlus className="size-4 mr-2" /> Add Course
                            </Button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="job_id">Job ID</Label>
                            <Input defaultValue={item.id ?? 'No Result'} className={`cursor-default`} readOnly />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="is_visible">Visible</Label>
                            <Switch checked={isVisible} onCheckedChange={setIsVisible} />
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
        salary: "",
        type: "",
        site: "",
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
            site: formData.site
        }

        const result = await submitJob(jobPayload)

        if (result.success) {
            setFormData({
                title: "",
                type: "",
                category: "",
                description: "",
                salary: "",
                site: ""
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
        formData.salary &&
        formData.site

    // Add job drawer
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
                                <Input id="title" value={formData.title} onChange={handleChange} className={`bg-white border-gray`} />
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
                            <Label htmlFor="description">Site</Label>
                            <Input id="site" value={formData.site} onChange={handleChange} className={`bg-white border-gray`} />
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
    const { deleteJob } = useJobs();
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
    const [deleteModal, setDeleteModal] = React.useState({ open: false, jobId: null })
    // Pass setDeleteModal into columns
    const columns = React.useMemo(() => getColumns(setDeleteModal), [setDeleteModal])


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


    const handleDelete = async () => {
        const toastId = toast.loading('Deleting job...')

        if (!deleteModal.jobId) {
            toast.error('No job selected')
            return
        }
        const success = await deleteJob(deleteModal.jobId, { id: toastId })
        if (!success) {
            toast.error('Failed to delete job')
            return
        }
        toast.success('Job deleted successfully')
        setDeleteModal({ open: false, jobId: null })
        setTimeout(() => window.location.reload(), 1500)
    }


    return (
        <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-end px-4 lg:px-6 ">
                {deleteModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <Card className="w-full max-w-md mx-4">
                            <CardHeader>
                                <CardTitle>Delete Job</CardTitle>
                                <CardDescription>
                                    This action cannot be undone. This will permanently delete the job and all its associated records.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-end gap-2">
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
                            </CardFooter>
                        </Card>
                    </div>
                )}
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

        </Tabs>
    )
}