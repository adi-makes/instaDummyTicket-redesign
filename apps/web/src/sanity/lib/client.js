import {createClient} from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-26'

export const hasSanityConfig = Boolean(projectId && projectId !== 'your_project_id' && dataset)

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null

export async function sanityFetch({query, params = {}, tags = [], revalidate = 60}) {
  if (!sanityClient) return null

  try {
    return await sanityClient.fetch(query, params, {
      next: {revalidate, tags},
    })
  } catch (error) {
    console.error('[sanityFetch]', error)
    return null
  }
}
