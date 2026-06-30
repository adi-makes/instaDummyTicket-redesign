import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ChevronLeft} from 'lucide-react'
import {localizedPath} from '@/i18n/routing'
import {sanityFetch} from '@/sanity/lib/client'
import {blogPostBySlugQuery} from '@/sanity/queries/content'
import {formatDate, PortableBody} from '@/components/shared/CmsContent'

export async function generateMetadata({params}) {
  const {locale, slug} = await params
  const post = await sanityFetch({
    query: blogPostBySlugQuery,
    params: {locale, slug},
    tags: ['blogPost'],
  })

  return {
    title: post?.title ? `${post.title} | InstaDummyTicket` : 'Blog | InstaDummyTicket',
    description: post?.excerpt || 'Travel documentation guide from InstaDummyTicket.',
  }
}

export default async function BlogPostPage({params}) {
  const {locale, slug} = await params
  const post = await sanityFetch({
    query: blogPostBySlugQuery,
    params: {locale, slug},
    tags: ['blogPost'],
  })

  if (!post) notFound()

  return (
    <main className="starter-page">
      <article className="container-max cms-article">
        <Link href={localizedPath(locale, '/blog')} className="cms-back-link">
          <ChevronLeft size={18} aria-hidden="true" />
          Blog
        </Link>
        <header className="cms-article-header">
          <p className="cms-card-meta">
            {post.category?.name || 'Guide'} · {formatDate(post.publishedAt)}
          </p>
          <h1>{post.title}</h1>
          {post.author?.name ? (
            <p className="cms-author-line">By {post.author.name}{post.author.role ? `, ${post.author.role}` : ''}</p>
          ) : null}
        </header>
        <PortableBody value={post.body} />
      </article>
    </main>
  )
}
