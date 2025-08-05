import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { QuestionnaireResponse } from '@/types/questionnaire'

export async function POST(request: NextRequest) {
  try {
    const body: QuestionnaireResponse = await request.json()

    
    if (!body.pseudo || !body.responses || !body.timestamp) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    const responseId = `response:${body.pseudo}:${Date.now()}`
    
    await redis.hset(responseId, {
      pseudo: body.pseudo,
      responses: JSON.stringify(body.responses),
      timestamp: body.timestamp
    })

    await redis.sadd('questionnaire:responses', responseId)

    return NextResponse.json(
      { success: true, responseId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving questionnaire response:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const responseIds = await redis.smembers('questionnaire:responses')
    
    const responses = (await Promise.all(
      responseIds.map(async (id) => {
        const data = await redis.hgetall(id)
        if (!data)
          return
        return {
          id,
          pseudo: data.pseudo,
          responses: data.responses,
          timestamp: data.timestamp
        } as QuestionnaireResponse
      })
    )).filter((data) => !!data)

    responses.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ responses })
  } catch (error) {
    console.error('Error fetching questionnaire responses:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}