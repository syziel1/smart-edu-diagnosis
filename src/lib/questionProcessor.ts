import type { QuestionTemplate, QuestionContent, GeneratedQuestion } from './types'

export function generateRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function evaluateExpression(
  expression: string,
  variables: Record<string, number>
): number {
  let evaluated = expression

  for (const [varName, value] of Object.entries(variables)) {
    const regex = new RegExp(varName, 'g')
    evaluated = evaluated.replace(regex, value.toString())
  }

  try {
    const result = Function(`"use strict"; return (${evaluated})`)()
    return typeof result === 'number' ? result : 0
  } catch (error) {
    console.error('Error evaluating expression:', error)
    return 0
  }
}

export function substituteVariables(
  template: string,
  variables: Record<string, number>
): string {
  let result = template

  for (const [varName, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{${varName}\\}`, 'g')
    result = result.replace(regex, value.toString())
  }

  return result
}

export function generateQuestion(
  template: QuestionTemplate,
  language: 'en' | 'pl' = 'en'
): GeneratedQuestion {
  const { content } = template
  const generatedVariables: Record<string, number> = {}

  for (const [varName, varConfig] of Object.entries(content.variables)) {
    generatedVariables[varName] = generateRandomValue(
      varConfig.min,
      varConfig.max
    )
  }

  const questionText = substituteVariables(
    content.questionTemplate[language] || content.questionTemplate.en,
    generatedVariables
  )

  const correctAnswer = evaluateExpression(
    content.answerTemplate,
    generatedVariables
  )

  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    templateId: template.id,
    topicId: template.topicId,
    difficulty: template.difficulty,
    questionText,
    correctAnswer,
    variables: generatedVariables,
  }
}

export function processMarkdown(text: string): string {
  let processed = text

  processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  processed = processed.replace(/\*(.+?)\*/g, '<em>$1</em>')
  processed = processed.replace(/`(.+?)`/g, '<code>$1</code>')

  return processed
}

export function extractLatex(text: string): {
  parts: Array<{ type: 'text' | 'latex'; content: string }>
} {
  const parts: Array<{ type: 'text' | 'latex'; content: string }> = []
  const regex = /\$\$(.+?)\$\$|\$(.+?)\$/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      })
    }

    parts.push({
      type: 'latex',
      content: match[1] || match[2],
    })

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex),
    })
  }

  return { parts }
}

export function renderLatexToText(latex: string): string {
  let result = latex
  
  result = result.replace(/\\frac\{(.+?)\}\{(.+?)\}/g, '($1)/($2)')
  result = result.replace(/\^(\d+)/g, '^$1')
  result = result.replace(/_(\d+)/g, '_$1')
  result = result.replace(/\\sqrt\{(.+?)\}/g, '√($1)')
  result = result.replace(/\\times/g, '×')
  result = result.replace(/\\div/g, '÷')
  result = result.replace(/\\pm/g, '±')
  result = result.replace(/\\leq/g, '≤')
  result = result.replace(/\\geq/g, '≥')
  result = result.replace(/\\ne/g, '≠')
  result = result.replace(/\\cdot/g, '·')
  
  return result
}
