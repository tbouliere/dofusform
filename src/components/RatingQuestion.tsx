'use client'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RatingQuestion as RatingQuestionType } from '@/types/questionnaire'

interface RatingQuestionProps {
  question: RatingQuestionType
  value?: number
  onChange: (value: number) => void
}

export function RatingQuestion({ question, value, onChange }: RatingQuestionProps) {
  const ratings = Array.from({ length: question.max - question.min + 1 }, (_, i) => i + question.min)

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        {question.title}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex gap-2 flex-wrap">
        {ratings.map((rating) => (
          <Button
            key={rating}
            type="button"
            variant={value === rating ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(rating)}
            className="w-10 h-10"
          >
            {rating}
          </Button>
        ))}
      </div>
    </div>
  )
}