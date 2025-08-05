import { QuestionnaireForm } from '@/components/QuestionnaireForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Link href="/results">
              <Button variant="outline">Voir les résultats</Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <QuestionnaireForm />
        </div>
      </div>
    </div>
  )
}
