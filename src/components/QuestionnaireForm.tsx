'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { RatingQuestion } from '@/components/RatingQuestion'
import { Question, QuestionnaireResponse } from '@/types/questionnaire'

const sampleQuestions: Question[] = [
  {
    id: '1',
    type: 'radio',
    title: 'Quelle est votre classe ?',
    required: true,
    options: ['Iop', 'Cra', 'Eniripsa', 'Ecaflip', 'Osamodas', 'Sram', 'Xelor', 'Sacrieur', 'Sadida', 'Pandawa', 'Roublard', 'Zobal', 'Steamer', 'Féca', 'Enutrof', 'Huppermage', 'Ouginak','Eliotrope', 'Forgelance']
  },
  {
    id: '2',
    type: 'rating',
    title: 'Notez votre expérience de jeu en pvp (1-10)',
    required: true
  },
    {
    id: '3',
    type: 'text',
    title: 'Voulez vous exclure des duo de classes ? Si oui lequels ?',
    required: false
  },
]

export function QuestionnaireForm() {
  const [pseudo, setPseudo] = useState('')
  const [responses, setResponses] = useState<Record<string, string | number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleResponseChange = (questionId: string, value: string | number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!pseudo.trim()) {
      newErrors.pseudo = 'Le pseudo est obligatoire'
    }

    sampleQuestions.forEach(question => {
      if (question.required && !responses[question.id]) {
        newErrors[question.id] = 'Cette question est obligatoire'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true);
    
    const questionnaireResponse: QuestionnaireResponse = {
      pseudo: pseudo.trim(),
      responses,
      timestamp: new Date().toISOString()
    }

    try {
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionnaireResponse),
      })

      if (response.ok) {
        alert('Questionnaire soumis avec succès!')
        setPseudo('')
        setResponses({})
        setErrors({})
      } else {
        throw new Error('Erreur lors de la soumission')
      }
    } catch (_error) {
      alert('Erreur lors de la soumission du questionnaire')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="dofus-card p-6">
        <h1 className="text-3xl font-bold mb-6 text-primary text-center">🏆 Questionnaire Dofus 🏆</h1>
        
        <div className="space-y-2">
          <Label htmlFor="pseudo">
            Pseudo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Entrez votre pseudo"
            className={`dofus-input ${errors.pseudo ? 'border-red-500' : ''}`}
          />
          {errors.pseudo && (
            <p className="text-red-500 text-sm">{errors.pseudo}</p>
          )}
        </div>
      </div>

      {sampleQuestions.map((question) => (
        <div key={question.id} className="dofus-card p-4 space-y-3">
          {question.type === 'radio' && (
            <div>
              <Label className="text-base font-medium">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <RadioGroup
                value={responses[question.id] as string || ''}
                onValueChange={(value) => handleResponseChange(question.id, value)}
                className="mt-2"
              >
                {question.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                    <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              {errors[question.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
              )}
            </div>
          )}

          {question.type === 'text' && (
            <div>
              <Label htmlFor={question.id} className="text-base font-medium">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={question.id}
                value={responses[question.id] as string || ''}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                placeholder="Votre réponse..."
                className={`dofus-input mt-2 ${errors[question.id] ? 'border-red-500' : ''}`}
              />
              {errors[question.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
              )}
            </div>
          )}

          {question.type === 'rating' && (
            <div>
              <RatingQuestion
                question={{
                  ...question,
                  type: 'rating' as const,
                  min: 1,
                  max: 10
                }}
                value={responses[question.id] as number}
                onChange={(value) => handleResponseChange(question.id, value)}
              />
              {errors[question.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
              )}
            </div>
          )}
        </div>
      ))}

      <Button type="submit" disabled={isSubmitting} className="dofus-button w-full text-lg py-3">
        {isSubmitting ? '⚔️ Soumission...' : '🚀 Soumettre le questionnaire'}
      </Button>
    </form>
  )
}
