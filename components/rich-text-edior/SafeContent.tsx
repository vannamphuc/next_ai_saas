import { convertJsonToHtml } from '@/lib/json-to-html'
import type { JSONContent } from '@tiptap/react'
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

interface IAppProps {
  content: string | JSONContent | null | undefined
  className?: string
}

const toJSONContent = (
  input: string | JSONContent | null | undefined,
): JSONContent | null => {
  if (input == null) return null
  if (typeof input !== 'string') return input

  const trimmed = input.trim()
  if (!trimmed) return null

  try {
    return JSON.parse(trimmed) as JSONContent
  } catch {
    // Legacy plain-text message: wrap as a single paragraph doc
    // so rendering never crashes on non-JSON content.
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: input }],
        },
      ],
    }
  }
}

export const SafeContent = ({ content, className }: IAppProps) => {
  const doc = toJSONContent(content)

  if (!doc) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground italic">
          Message content unavailable.
        </p>
      </div>
    )
  }

  const html = convertJsonToHtml(doc)

  if (!html) {
    // Conversion failed but we have raw text: render it safely as plain text.
    if (typeof content === 'string' && content.trim()) {
      return <div className={className}>{content}</div>
    }
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground italic">
          This message can&rsquo;t be displayed.
        </p>
      </div>
    )
  }

  const clean =
    typeof window === 'undefined' ? html : DOMPurify.sanitize(html)

  return <div className={className}>{parse(clean)}</div>
}
