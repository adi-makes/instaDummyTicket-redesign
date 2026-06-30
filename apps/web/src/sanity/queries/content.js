export const blogPostsQuery = `*[
  _type == "blogPost" &&
  visibility != false &&
  (!defined(status) || status == "published") &&
  (!defined(language) || language == $locale)
] | order(featured desc, priority desc, publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  featured,
  tags,
  "excerpt": coalesce(seo.metaDescription, pt::text(body)),
  "category": category->{name, "slug": slug.current},
  "author": author->{name, role},
  "imageUrl": featuredImage.asset->url,
  "imageAlt": coalesce(featuredImage.alt, title)
}`

export const blogPostBySlugQuery = `*[
  _type == "blogPost" &&
  slug.current == $slug &&
  visibility != false &&
  (!defined(status) || status == "published") &&
  (!defined(language) || language == $locale)
][0] {
  _id,
  title,
  publishedAt,
  tags,
  body,
  faq,
  "excerpt": coalesce(seo.metaDescription, pt::text(body)),
  "category": category->{name, "slug": slug.current},
  "author": author->{name, role, description},
  "imageUrl": featuredImage.asset->url,
  "imageAlt": coalesce(featuredImage.alt, title)
}`

export const faqItemsQuery = `*[_type == "faqItem"] | order(order asc, _createdAt asc) {
  _id,
  question,
  answer,
  order
}`
