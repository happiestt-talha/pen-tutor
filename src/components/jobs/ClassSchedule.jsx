"use client"

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const durationOptions = [30, 60, 90, 120]

export default function ClassSchedule({ value, onChange }) {
  const handleDayChange = (day) => {
    const newDays = value.days.includes(day)
      ? value.days.filter((d) => d !== day)
      : [...value.days, day]
    onChange({ ...value, days: newDays })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Days</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={day}
                checked={value.days.includes(day)}
                onCheckedChange={() => handleDayChange(day)}
              />
              <Label htmlFor={day} className="capitalize font-normal">{day}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="time">Time (24-hour format)</Label>
          <Input
            id="time"
            type="time"
            value={value.time}
            onChange={(e) => onChange({ ...value, time: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Select
            value={String(value.duration)}
            onValueChange={(val) => onChange({ ...value, duration: Number(val) })}
          >
            <SelectTrigger id="duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((duration) => (
                <SelectItem key={duration} value={String(duration)}>
                  {duration} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
