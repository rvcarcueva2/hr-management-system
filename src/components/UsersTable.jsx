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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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

import { PiWarningOctagonFill } from "react-icons/pi";
import { BsShieldFillCheck } from "react-icons/bs";


import useUsers from "@/hooks/useUsers"
import useAuth from "@/hooks/useAuth"
import useDepartments from "@/hooks/useDepartments";
import useJobs from "@/hooks/useJobs";


const tabs = ['Active', 'Inactive'];



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

const getColumns = (setDeleteModal, setActivateModal) => [
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
        cell: ({ row }) => <TableCellViewer item={row.original} />,
        enableHiding: false,
    },
    {
        accessorKey: "employee id",
        header: "Employee ID",
        cell: ({ row }) => <span>{row.original.employee_id ?? 'N/A'}</span>,
        enableHiding: false,
    },
    {
        accessorKey: "first name",
        header: "First Name",
        cell: ({ row }) => (
            <span>{row.original.first_name ?? 'N/A'}</span>
        ),
    },
    {
        accessorKey: "last name",
        header: "Last Name",
        cell: ({ row }) => (
            <span>{row.original.last_name ?? 'N/A'}</span>
        ),
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
            <span>{row.original.department?.name ?? 'N/A'}</span>
        ),
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <span>{row.original.role ?? 'N/A'}</span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.original.is_active !== false
            const label = isActive ? "Active" : "Inactive"
            const statusStyles = {
                Active: "bg-green-100 text-green-700 border-green-300",
                Inactive: "bg-red-100 text-red-700 border-red-300",
            }
            return (
                <Badge variant="outline" className={statusStyles[label]}>
                    {label}
                </Badge>
            )
        },
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
                    {row.original.is_active === false ? (
                        <DropdownMenuItem onClick={() => setActivateModal({ open: true, userId: row.original.id })}
                        > <BsShieldFillCheck className="-mt-0.5 fill-green-600" />
                            Activate
                        </DropdownMenuItem>
                    )
                        : <DropdownMenuItem variant="destructive" onClick={() => setDeleteModal({ open: true, userId: row.original.id })}
                        >
                            <PiWarningOctagonFill className="-mt-0.5  fill-red-600" />
                            Deactivate
                        </DropdownMenuItem>
                    }
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
    const [email, setEmail] = React.useState(item.email);
    return (

        <Button variant="link" className="w-fit px-0 text-left text-foreground cursor-pointer" asChild>
            <a href={`/profile/${item.id}`} target="_blank">
                {email ?? 'N/A'}
            </a>
        </Button>


    )
}

function AddUserDrawer() {
    const isMobile = useIsMobile()
    const { users } = useUsers();
    const { signUp, loading: signUpLoading } = useAuth();
    const { departments, loading, error } = useDepartments();
    const { jobs, loading: jobsLoading, error: jobsError } = useJobs();
    const [open, setOpen] = useState(false);
    const [jobOpen, setJobOpen] = useState(false);



    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        departmentId: "",
        jobId: "",
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }


    const handleSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        const { error } = await signUp(
            formData.email,
            formData.password,
            formData.firstName,
            formData.lastName,
            formData.role,
            formData.departmentId,
            formData.jobId,

        )

        if (!error) {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "",
                departmentId: "",
                jobId: "",
            })

            toast.success("User created successfully")
            setOpen(false)

            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } else {
            toast.error(error.message || "Failed to create user")
        }
    }

    const isFormValid =
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        formData.role &&
        formData.departmentId &&
        formData.jobId

    const selectedJob = jobs.find((job) => job.id === formData.jobId)

    // Add user drawer
    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="default" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Add User</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>Add User</DrawerTitle>
                    <DrawerDescription>Fill in the details to add a new user.</DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">

                    <div className="flex flex-col gap-4">
                        <div className="grid  gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" value={formData.firstName} onChange={handleChange} className={`bg-white border-gray`} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" value={formData.lastName} onChange={handleChange} className={`bg-white border-gray`} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={formData.email} onChange={handleChange} className={`bg-white border-gray`} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`bg-white border-gray`}
                            />

                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`bg-white border-gray`}
                            />

                        </div>
                        <div className="grid grid-cols-2 gap-4">

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            role: value
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="Employee">Employee</SelectItem>
                                        <SelectItem value="Mentor">Mentor</SelectItem>
                                        <SelectItem value="Reviewer">Reviewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="department">Department</Label>
                                <Select
                                    value={formData.departmentId}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            departmentId: value
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={loading ? "Loading..." : "Select department"} />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {error && (
                                            <SelectItem value="" disabled>Failed to load departments</SelectItem>
                                        )}
                                        {departments.map((dept) => (
                                            <SelectItem key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="job">Job</Label>
                            <Popover open={jobOpen} onOpenChange={setJobOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2 cursor-pointer "
                                    >
                                        {selectedJob ? (
                                            <span>{selectedJob.title}</span>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                {jobsLoading ? "Loading..." : "Select job"}
                                            </span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    side="left"
                                    align="center"
                                    sideOffset={30}
                                    alignOffset={-4}
                                    className="w-full bg-white p-3"
                                >
                                    <div className="flex max-h-64 flex-col gap-2 overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                                        {jobsError && (
                                            <span className="text-sm text-muted-foreground">Failed to load jobs</span>
                                        )}
                                        {!jobsLoading && !jobsError && jobs.length === 0 && (
                                            <span className="text-sm text-muted-foreground">No jobs available</span>
                                        )}
                                        {jobs.map((job) => (
                                            <Button
                                                key={job.id}
                                                variant={formData.jobId === job.id ? "secondary" : "ghost"}
                                                className="w-full justify-start"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        jobId: job.id
                                                    }))
                                                    setJobOpen(false)
                                                }}
                                            >
                                                {job.title}
                                            </Button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                <DrawerFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid || signUpLoading}
                        className="bg-[#378ADD] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {signUpLoading ? "Creating account..." : "Create Account"}
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
    const [selectedTab, setSelectedTab] = React.useState('Active');
    const filteredData = React.useMemo(() => {
        if (selectedTab === 'Active') return initialData.filter(row => row.is_active !== false);
        if (selectedTab === 'Inactive') return initialData.filter(row => row.is_active === false);
    }, [initialData, selectedTab]);
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
    React.useEffect(() => {
        setData(filteredData);
    }, [filteredData]);

    React.useEffect(() => {
        setPagination(p => ({ ...p, pageIndex: 0 }));
    }, [selectedTab]);


    const [deleteModal, setDeleteModal] = React.useState({ open: false, userId: null })
    const [activateModal, setActivateModal] = React.useState({ open: false, userId: null })
    // Pass setDeleteModal into columns
    const columns = React.useMemo(
        () => getColumns(setDeleteModal, setActivateModal),
        [setDeleteModal, setActivateModal]
    )

    const { deactivateUser, reactivateUser } = useAuth()



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

    const handleSoftDelete = async () => {
        const toastId = toast.loading('Updating user status...')
        if (!deleteModal.userId) {
            return
        }

        const { error } = await deactivateUser(deleteModal.userId)

        if (error) {
            toast.error(error.message || "Failed to deactivate user"), { id: toastId }
            return
        }

        setData((prev) =>
            prev.map((item) =>
                item.id === deleteModal.userId ? { ...item, is_active: false } : item
            )
        )

        toast.success("User deactivated successfully", { id: toastId })
        setDeleteModal({ open: false, userId: null })
        setTimeout(() => window.location.reload(), 1500)
    }

    const handleActivate = async () => {
        const toastId = toast.loading('Updating user status...')
        if (!activateModal.userId) {
            return
        }

        const { error } = await reactivateUser(activateModal.userId)

        if (error) {
            toast.error(error.message || "Failed to reactivate user", { id: toastId })
            return
        }

        setData((prev) =>
            prev.map((item) =>
                item.id === activateModal.userId ? { ...item, is_active: true } : item
            )
        )

        toast.success("User activated successfully", { id: toastId })
        setActivateModal({ open: false, userId: null })
        setTimeout(() => window.location.reload(), 1500)
    }





    return (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-4 lg:px-6 ">
                {activateModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <Card className="w-full max-w-md mx-4 rounded-lg">
                            <CardHeader>
                                <CardTitle className={`font-bold`}>Confirm to activate user</CardTitle>
                                <Separator />
                                <CardDescription className={`mt-2`}>
                                    This action will reactivate the account and restore all its associated access.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setActivateModal({ open: false, userId: null })}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleActivate} className="bg-[#378ADD] text-white">Activate</Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}
                {deleteModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <Card className="w-full max-w-md mx-4 rounded-lg">
                            <CardHeader>
                                <CardTitle className={`font-bold`}>Confirm to deactivate user</CardTitle>
                                <Separator />
                                <CardDescription className={`mt-2`}>
                                    This will permanently deactivate the account and all its associated accessses.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteModal({ open: false, userId: null })}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleSoftDelete}
                                >
                                    Deactivate
                                </Button>
                            </CardFooter>
                        </Card>
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

                    <AddUserDrawer setData={setData} />

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