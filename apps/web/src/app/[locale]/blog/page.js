import Link from 'next/link'
import {ChevronRight, PlaneTakeoff} from 'lucide-react'
import {localizedPath} from '@/i18n/routing'
import {getMessages} from '@/messages'
import {sanityFetch} from '@/sanity/lib/client'
import {blogPostsQuery} from '@/sanity/queries/content'
import {formatDate} from '@/components/shared/CmsContent'

const FALLBACK_CATEGORIES = ['Dummy Tickets', 'Flight Itineraries', 'Onward Travel', 'Visa Guides']

export const metadata = {
  title: 'Blog | InstaDummyTicket',
  description: 'Guides for onward tickets, dummy tickets, visa documents, and proof of travel.',
}

function getCategoryLabel(post) {
  return post.category?.name || post.tags?.[0] || 'Visa Guides'
}

export default async function BlogPage({params}) {
  const {locale} = await params
  const messages = getMessages(locale)
  const posts = (await sanityFetch({
    query: blogPostsQuery,
    params: {locale},
    tags: ['blogPost'],
  })) || []
  const categories = Array.from(new Set(posts.map(getCategoryLabel))).filter(Boolean)
  const categoryPills = categories.length > 0 ? categories : FALLBACK_CATEGORIES

  return (
    <main className="starter-page">
      <div className="container-max cms-breadcrumb" aria-label={messages.breadcrumbs.label}>
        <Link href={localizedPath(locale, '/')}>{messages.breadcrumbs.home}</Link>
        <ChevronRight size={15} aria-hidden="true" />
        <span>{messages.blog.title}</span>
      </div>

      <section className="blog-band-hero">
        <div className="container-max">
          <p className="blog-band-hero__badge">Blog</p>
          <h1>
            Travel Document <span>Guides</span>
          </h1>
          <p>{messages.blog.description}</p>
        </div>
      </section>

      <section className="container-max blog-index-section">
        <div className="blog-category-pills" aria-label="Blog categories">
          <span className="blog-category-pill" data-active="true">All</span>
          {categoryPills.map((category) => (
            <span className="blog-category-pill" key={category}>{category}</span>
          ))}
        </div>

        {posts.length > 0 ? (
          <div className="blog-card-grid">
            {posts.map((post) => {
              const category = getCategoryLabel(post)
              return (
                <article className="blog-reference-card" key={post._id}>
                  <div className="blog-reference-card__media">
                    <span className="blog-reference-card__icon">
                      <PlaneTakeoff size={34} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="blog-reference-card__body">
                    <p className="blog-reference-card__meta">
                      <span>{category}</span>
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    </p>
                    <h2>{post.title}</h2>
                    <Link href={localizedPath(locale, `/blog/${post.slug}`)} className="blog-reference-card__link">
                      {messages.blog.readMore}
                      <ChevronRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="cms-empty-state">
            <h2>{messages.blog.emptyTitle}</h2>
            <p>{messages.blog.emptyDescription}</p>
          </div>
        )}
      </section>
    </main>
  )
}
