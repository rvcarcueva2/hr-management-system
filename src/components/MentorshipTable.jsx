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
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
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
import { Calendar } from "@/components/ui/calendar"
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
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,

} from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { FaSearch } from "react-icons/fa"

import usePrograms from "@/hooks/usePrograms"
import useApprentice from "@/hooks/useApprentice"



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

const getColumns = (setDeleteModal, acceptedByProgram) => [
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
        cell: ({ row }) => (
            <TableCellViewer
                item={row.original}
                participants={acceptedByProgram?.get(row.original.id) ?? []}
            />
        ),
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
        accessorKey: "start date",
        header: "Start Date",
        cell: ({ row }) => (
            <span>{row.original.start_date}</span>
        ),
    },
    {
        accessorKey: "end date",
        header: "End Date",
        cell: ({ row }) => (
            <span>{row.original.end_date}</span>
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
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteModal({ open: true, programId: row.original.id })}
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

function TableCellViewer({ item, participants = [] }) {
    const isMobile = useIsMobile()
    const { updateProgram, loading } = usePrograms();
    const participantCount = participants.length
    const [open, setOpen] = React.useState(false)
    const [participantQuery, setParticipantQuery] = React.useState("")
    const [title, setTitle] = React.useState(item.title);
    const [type, setType] = React.useState(item.type);
    const [category, setCategory] = React.useState(item.category);
    const [topic, setTopic] = React.useState(item.topic);
    const [description, setDescription] = React.useState(item.description);
    const [isVisible, setIsVisible] = React.useState(Boolean(item.is_visible));
    const [startDate, setStartDate] = React.useState(
        item.start_date ? new Date(item.start_date) : null
    );
    const [endDate, setEndDate] = React.useState(
        item.end_date ? new Date(item.end_date) : null
    );
    const [startDateOpen, setStartDateOpen] = React.useState(false);
    const [endDateOpen, setEndDateOpen] = React.useState(false);

    const filteredParticipants = React.useMemo(() => {
        const normalizedQuery = participantQuery.trim().toLowerCase()
        if (!normalizedQuery) return participants

        return participants.filter((participant) => {
            const displayName = participant.display_name?.toLowerCase() ?? ""
            const email = participant.email?.toLowerCase() ?? ""
            const employeeId = participant.employee_id?.toLowerCase() ?? ""

            return (
                displayName.includes(normalizedQuery) ||
                email.includes(normalizedQuery) ||
                employeeId.includes(normalizedQuery)
            )
        })
    }, [participants, participantQuery])

    const getParticipantInitials = (participant) => {
        if (participant.display_name) {
            return participant.display_name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()
        }

        if (participant.email) {
            return participant.email.slice(0, 2).toUpperCase()
        }

        return "NA"
    }

    const handleSubmit = async () => {

        const payload = {
            title,
            type,
            category,
            topic,
            description,
            is_visible: isVisible,
            start_date: startDate ? startDate.toISOString() : null,
            end_date: endDate ? endDate.toISOString() : null,
        };

        const programSuccess = await updateProgram(item.id, payload)

        if (!programSuccess) {
            toast.error('Failed to update program')
            return
        }

        toast.success('Program updated successfully!')
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
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="topic">Topic</Label>
                            <Input value={topic} onChange={(e) => setTopic(e.target.value)} className={`bg-white border-gray`} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label>Start Date</Label>
                                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2 cursor-pointer font-normal"
                                        >
                                            {startDate ? (
                                                <span>
                                                    {startDate.toLocaleDateString('en-US', {
                                                        timeZone: 'Asia/Taipei',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">Pick a start date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        side="left"
                                        align="center"
                                        sideOffset={30}
                                        alignOffset={-4}
                                        className="w-auto p-0 bg-white"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            defaultMonth={startDate ?? undefined}
                                            onSelect={setStartDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>End Date</Label>
                                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2 cursor-pointer font-normal"
                                        >
                                            {endDate ? (
                                                <span>
                                                    {endDate.toLocaleDateString('en-US', {
                                                        timeZone: 'Asia/Taipei',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">Pick an end date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        side="left"
                                        align="center"
                                        sideOffset={195}
                                        alignOffset={-4}
                                        className="w-auto p-0 bg-white"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            defaultMonth={endDate ?? undefined}
                                            onSelect={setEndDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
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
                            <Label htmlFor="participants">Participants</Label>
                            <Popover>
                                <PopoverTrigger>
                                    <>
                                        <div className="relative inline-flex w-full">
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start gap-2 font-normal"
                                            >
                                                {participantCount
                                                    ? "View list of participants"
                                                    : "No accepted participants"}
                                            </Button>
                                            {participantCount > 0 && (
                                                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#378ADD] flex items-center justify-center text-white text-[10px] font-semibold">
                                                    {participantCount}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                </PopoverTrigger>
                                <PopoverContent
                                    side="left"
                                    align="center"
                                    sideOffset={30}
                                    className="w-80 bg-white">
                                    {participantCount ? (
                                        <div className="flex max-h-72 flex-col gap-3 overflow-auto">
                                            <div className="flex m-auto mt-2">

                                                <form value={participantQuery}
                                                    onChange={(event) => setParticipantQuery(event.target.value)}
                                                    placeholder="Search participants"
                                                    className="ml-auto flex items-center border border-gray-300 rounded-lg w-70 max-w-md">

                                                    <button
                                                        type="submit"
                                                        className="px-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                                                    >
                                                        <FaSearch className="w-4 h-4" />
                                                    </button>
                                                    <Input
                                                        value={participantQuery}
                                                        onChange={(event) => setParticipantQuery(event.target.value)}
                                                        placeholder="Search participants"
                                                        className="bg-white focus-visible:ring-0 "
                                                    />
                                                </form>
                                            </div>
                                            {filteredParticipants.length ? (
                                                <div className="flex flex-col gap-2 mt-1 mb-4">
                                                    {filteredParticipants.map((participant) => (
                                                        <div
                                                            key={participant.id}
                                                            className="flex items-center gap-3 rounded-md px-2 py-1"
                                                        >
                                                            <Avatar size="sm" className="size-8">
                                                                <AvatarImage
                                                                    src={participant.avatar_url ?? ""}
                                                                    alt={participant.display_name ?? "Participant"}
                                                                />
                                                                <AvatarFallback>
                                                                    {getParticipantInitials(participant)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <div className="text-sm font-medium">
                                                                    {participant.display_name ?? "Unnamed participant"}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {participant.email ?? "No email"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-muted-foreground">
                                                    No participants match your search.
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">
                                            No accepted participants yet.
                                        </div>
                                    )}
                                </PopoverContent>
                            </Popover>
                        </div>


                        <div className="flex flex-col gap-3">
                            <Label htmlFor="program_id">Program ID</Label>
                            <Input defaultValue={item.id ?? 'No Result'} className={`cursor-default`} readOnly />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="is_visible">Visible</Label>
                            <Switch checked={isVisible} onCheckedChange={setIsVisible} />
                        </div>
                    </div>
                </div>
                <DrawerFooter>
                    <Button onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[#378ADD] text-white">
                        {loading ? "Applying changes..." : "Apply"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" className={`cursor-pointer`}>Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function AddProgramDrawer() {
    const isMobile = useIsMobile()
    const [open, setOpen] = useState(false);
    const { submitProgram, loading } = usePrograms()


    const [formData, setFormData] = useState({
        title: "",
        type: "",
        category: "",
        topic: "",
        description: "",
        start_date: "",
        end_date: ""
    })
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [startDateOpen, setStartDateOpen] = useState(false)
    const [endDateOpen, setEndDateOpen] = useState(false)

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }


    const handleSubmit = async () => {

        const programPayload = {
            title: formData.title,
            type: formData.type,
            category: formData.category,
            topic: formData.topic,
            description: formData.description,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null
        }

        const result = await submitProgram(programPayload)

        if (result.success) {
            setFormData({
                title: "",
                type: "",
                category: "",
                topic: "",
                description: "",
                start_date: "",
                end_date: ""
            })
            setStartDate(null)
            setEndDate(null)

            toast.success("Program posted successfully")
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
        formData.topic &&
        formData.description &&
        formData.start_date &&
        formData.end_date

    // Add Program drawer
    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="default" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Add Program</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>Add Program</DrawerTitle>
                    <DrawerDescription>Fill in the details to post a new program.</DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                    <Separator />
                    <div className="flex flex-col gap-4">
                        <div className="grid  gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="title"> Title</Label>
                                <Input id="title" value={formData.title} onChange={handleChange} className={`bg-white border-gray`} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="type">Type</Label>

                                <Select
                                    value={formData.type}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            type: value
                                        }))
                                    }
                                >
                                    <SelectTrigger id="type" className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="On-site">On-site</SelectItem>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>

                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            category: value
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
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
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="topic">Topic</Label>
                            <Input id="topic" value={formData.topic} onChange={handleChange} className={`bg-white border-gray`} />
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3 mb-3">
                                <Label>Start Date</Label>
                                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2 cursor-pointer font-normal"
                                        >
                                            {startDate ? (
                                                <span>
                                                    {startDate.toLocaleDateString('en-US', {
                                                        timeZone: 'Asia/Taipei',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">Pick a start date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        side="left"
                                        align="center"
                                        sideOffset={30}
                                        alignOffset={-4}
                                        className="w-auto p-0 bg-white"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            defaultMonth={startDate ?? undefined}
                                            onSelect={(date) => {
                                                setStartDate(date ?? null)
                                                setFormData(prev => ({
                                                    ...prev,
                                                    start_date: date ? date.toISOString() : ""
                                                }))
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>End Date</Label>
                                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2 cursor-pointer font-normal"
                                        >
                                            {endDate ? (
                                                <span>
                                                    {endDate.toLocaleDateString('en-US', {
                                                        timeZone: 'Asia/Taipei',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">Pick an end date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        side="left"
                                        align="center"
                                        sideOffset={195}
                                        alignOffset={-4}
                                        className="w-auto p-0 bg-white"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            defaultMonth={endDate ?? undefined}
                                            onSelect={(date) => {
                                                setEndDate(date ?? null)
                                                setFormData(prev => ({
                                                    ...prev,
                                                    end_date: date ? date.toISOString() : ""
                                                }))
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>

                <DrawerFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid || loading}
                        className="bg-[#378ADD] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Posting..." : "Post Program"}
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
    const { deleteProgram } = usePrograms();
    const { apprentices } = useApprentice({ includeAll: true });
    const [data, setData] = React.useState(() => initialData ?? [])
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
    const [deleteModal, setDeleteModal] = React.useState({ open: false, programId: null })
    // Pass setDeleteModal into columns
    const acceptedByProgram = React.useMemo(() => {
        const map = new Map()

        apprentices
            .filter((application) => application.status === "Accepted")
            .forEach((application) => {
                const programId = application.program?.id
                const participant = application.applicant

                if (!programId || !participant) return

                if (!map.has(programId)) {
                    map.set(programId, [])
                }

                map.get(programId).push(participant)
            })

        return map
    }, [apprentices])

    const columns = React.useMemo(
        () => getColumns(setDeleteModal, acceptedByProgram),
        [setDeleteModal, acceptedByProgram]
    )

    React.useEffect(() => {
        setData(initialData ?? [])
    }, [initialData])


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
        const toastId = toast.loading('Deleting program...')

        if (!deleteModal.programId) {
            toast.error('No program selected')
            return
        }
        const success = await deleteProgram(deleteModal.programId, { id: toastId })
        if (!success) {
            toast.error('Failed to delete program')
            return
        }
        toast.success('Program deleted successfully')
        setDeleteModal({ open: false, programId: null })
        setTimeout(() => window.location.reload(), 1500)
    }


    return (
        <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-end px-4 lg:px-6 ">
                {deleteModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <Card className="w-full max-w-md mx-4 rounded-lg">
                            <CardHeader>
                                <CardTitle className={`font-bold`}>Delete Program</CardTitle>
                                <Separator />
                                <CardDescription className={`mt-2`}>
                                    This action cannot be undone. This will permanently delete the program and all its associated records.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteModal({ open: false, programId: null })}
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

                    <AddProgramDrawer setData={setData} />

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