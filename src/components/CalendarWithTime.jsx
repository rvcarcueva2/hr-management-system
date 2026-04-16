
"use client"
import * as React from "react"
import { Clock2Icon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"


const formatTimeInput = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 6)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4)}`
}


const isInvalidHour = (timeStr) => {
  if (!timeStr) return false
  const [h] = timeStr.split(':')
  const hour = Number(h)
  return !Number.isNaN(hour) && hour > 23
}


export function CalendarWithTime({ date, onDateChange, startTime, onStartTimeChange, endTime, onEndTimeChange }) {
  const isInvalidTimeRange = React.useMemo(() => {
    if (!startTime || !endTime) return false

    const parseToSeconds = (timeStr) => {
      const [h, m, s] = timeStr.split(":")
      const hours = Number(h ?? 0)
      const minutes = Number(m ?? 0)
      const seconds = Number(s ?? 0)
      if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) return null
      return hours * 3600 + minutes * 60 + seconds
    }

    const startSeconds = parseToSeconds(startTime)
    const endSeconds = parseToSeconds(endTime)
    if (startSeconds === null || endSeconds === null) return false

    return startSeconds > endSeconds
  }, [startTime, endTime])

  const startExceedsHour = isInvalidHour(startTime)
  const endExceedsHour = isInvalidHour(endTime)

  return (
    <Card size="sm" className="w-full ">
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          className="p-0 "

        />
      </CardContent>
      <CardFooter className="border-t mx-3 bg-card">
        <FieldGroup>
          <Field className={`-mt-2`}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
              {startExceedsHour && (
                <span className="text-xs text-red-500">Invalid Hour</span>
              )}
            </div>
            <InputGroup>
              <InputGroupInput
                id="time-from"
                type="text"
                inputMode="numeric"
                value={startTime}
                placeholder="hh:mm:ss"
                autoComplete="off"
                onChange={e => onStartTimeChange(formatTimeInput(e.target.value))}
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field className={`-mt-3`}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="time-to">End Time</FieldLabel>
              {isInvalidTimeRange && !endExceedsHour && (
                <span className="text-xs text-red-500">Invalid time range</span>
              )}
            </div>
            <InputGroup>
              <InputGroupInput
                id="time-to"
                type="text"
                inputMode="numeric"
                value={endTime}
                placeholder="hh:mm:ss"
                autoComplete="off"
                onChange={e => onEndTimeChange(formatTimeInput(e.target.value))}
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  )
}