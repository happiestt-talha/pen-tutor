"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

export default function SubjectSelector({ value, onChange }) {
  const [inputValue, setInputValue] = useState('')

  const handleAddSubject = () => {
    if (inputValue && !value.includes(inputValue)) {
      onChange([...value, inputValue.trim()])
      setInputValue('')
    }
  }

  const handleRemoveSubject = (subjectToRemove) => {
    onChange(value.filter((subject) => subject !== subjectToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSubject()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="e.g., Math, Physics"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" onClick={handleAddSubject}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((subject) => (
          <Badge key={subject} variant="secondary" className="flex items-center gap-1">
            {subject}
            <button
              type="button"
              onClick={() => handleRemoveSubject(subject)}
              className="rounded-full hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {subject}</span>
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
