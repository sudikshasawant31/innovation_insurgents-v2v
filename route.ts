import { NextRequest, NextResponse } from 'next/server'

const systemPrompt = `You are HerGuardian AI, a careful women health education assistant. Answer clearly and empathetically. Do not diagnose. Mention urgent red flags when relevant. Encourage clinician consultation for serious, persistent, pregnancy-related, mental health crisis, or emergency symptoms.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const messages = Array.isArray(body.messages) ? body.messages : []
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      const last = messages[messages.length - 1]?.content || 'your concern'
      return NextResponse.json({
        answer: `I can help with general health education about ${last}. Track timing, severity, cycle date, medicines, bleeding, fever, pain location, pregnancy possibility, and what makes it better or worse. If symptoms are severe, sudden, worsening, or include fainting, heavy bleeding, chest pain, high fever, self-harm thoughts, or severe abdominal pain, seek urgent medical care. Add OPENAI_API_KEY in .env.local for live AI answers to every question.`,
        mode: 'fallback',
      })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.4,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ answer: `AI service error. Please check OPENAI_API_KEY. ${error.slice(0, 160)}` }, { status: 200 })
    }

    const data = await response.json()
    return NextResponse.json({ answer: data.choices?.[0]?.message?.content || 'I could not generate an answer. Please try again.' })
  } catch {
    return NextResponse.json({ answer: 'I could not process that question. Please try again.' }, { status: 200 })
  }
}
