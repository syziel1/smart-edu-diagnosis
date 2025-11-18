import { extractLatex, processMarkdown, renderLatexToText } from '@/lib/questionProcessor'

interface MathRendererProps {
  content: string
}

export function MathRenderer({ content }: MathRendererProps) {
  const { parts } = extractLatex(content)

  if (parts.length === 0) {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: processMarkdown(content) }}
      />
    )
  }

  return (
    <span>
      {parts.map((part, index) => {
        if (part.type === 'latex') {
          const rendered = renderLatexToText(part.content)
          return (
            <span
              key={index}
              className="font-semibold text-primary mx-1 inline-block"
              style={{ fontFamily: 'Cambria Math, serif' }}
            >
              {rendered}
            </span>
          )
        }
        return (
          <span
            key={index}
            dangerouslySetInnerHTML={{ __html: processMarkdown(part.content) }}
          />
        )
      })}
    </span>
  )
}
