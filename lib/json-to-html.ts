import { baseExtensions } from '@/components/rich-text-edior/extensions'
import { generateHTML, type JSONContent } from '@tiptap/react'

export const convertJsonToHtml = (jsonContent: JSONContent): string => {
  try {
    const content =
      typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent

    return generateHTML(content, baseExtensions)
  } catch (error) {
    console.log('🚀 ~ convertJsonToHtml ~ error:', error)
    return ''
  }
}
