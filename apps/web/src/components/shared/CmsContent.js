import {PortableText} from 'next-sanity'

export function formatDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function truncateText(value = '', length = 150) {
  const text = value.replace(/\s+/g, ' ').trim()
  if (text.length <= length) return text
  return `${text.slice(0, length).trim()}...`
}

export function PortableBody({value}) {
  if (!value) return null

  return (
    <div className="cms-prose">
      <PortableText value={value} />
    </div>
  )
}
