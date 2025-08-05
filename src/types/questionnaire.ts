export type QuestionType = 'radio' | 'text' | 'rating'

export interface Question {
  id: string
  type: QuestionType
  title: string
  required: boolean
  options?: string[]
}

export interface QuestionnaireResponse {
  pseudo: string
  responses: Record<string, string | number>
  timestamp: string
}

export interface RadioQuestion extends Question {
  type: 'radio'
  options: string[]
}

export interface TextQuestion extends Question {
  type: 'text'
}

export interface RatingQuestion extends Question {
  type: 'rating'
  min: number
  max: number
}