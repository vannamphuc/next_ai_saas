import { baseExtensions } from '@/components/rich-text-edior/extensions'
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown'

const normalizeWhiteSpace = (str: string) => {
  return str
    .replace(/\s+/gm, ' ') // trim trailing spaces per line
    .replace(/\n{3,}/g, '\n\n') // collapse >2 blank lines
    .trim()
}

export const tiptapJsonToMarkdown = async (json: string) => {
  let content
  try {
    content = JSON.parse(json)
  } catch (error) {
    console.log(error)
    return ''
  }
  const markdown = renderToMarkdown({
    extensions: baseExtensions,
    content: content,
  })

  return normalizeWhiteSpace(markdown)
}
