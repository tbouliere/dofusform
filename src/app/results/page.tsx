'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface QuestionnaireResponseData {
  id: string
  pseudo: string
  responses: Record<string, string | number>
  timestamp: string
}

export default function ResultsPage() {
  const [responses, setResponses] = useState<QuestionnaireResponseData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResponses()
  }, [])

  const fetchResponses = async () => {
    try {
      const response = await fetch('/api/questionnaire')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des résultats')
      }
      const data = await response.json()
      setResponses(data.responses)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const formatResponse = (value: string | number) => {
    if (typeof value === 'number') {
      return value.toString()
    }
    return value || 'Non renseigné'
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">Chargement des résultats...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-red-600">Erreur: {error}</div>
          <div className="text-center mt-4">
            <Button onClick={fetchResponses}>Réessayer</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Résultats du Questionnaire</h1>
          <Link href="/">
            <Button variant="outline">Retour au questionnaire</Button>
          </Link>
        </div>

        {responses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucune réponse pour le moment</p>
            <Link href="/" className="mt-4 inline-block">
              <Button>Répondre au questionnaire</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600">
                Total des réponses: <span className="font-semibold">{responses.length}</span>
              </p>
            </div>

            <div className="grid gap-6">
              {responses.map((response) => (
                <div key={response.id} className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-blue-600">
                      {response.pseudo}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(response.timestamp)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Classe préférée:</span>
                      <span className="ml-2">{formatResponse(response.responses['1'])}</span>
                    </div>
                    
                 
                    
                    <div>
                      <span className="font-medium text-gray-700">Note d&apos;expérience:</span>
                      <span className="ml-2 inline-flex items-center">
                        {formatResponse(response.responses['2'])}/10
                        {response.responses['2'] && (
                          <span className="ml-2 text-yellow-500">
                            {'★'.repeat(Math.min(Number(response.responses['2']), 10))}
                          </span>
                        )}
                      </span>
                    </div>

                       <div>
                      <span className="font-medium text-gray-700">Commentaires:</span>
                      <span className="ml-2">{formatResponse(response.responses['3'])}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}