import { Hono } from 'hono';
import axios from 'axios';
import * as cheerio from 'cheerio';
import UserAgent from 'user-agents';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

const randomHeader = () => ({
  'User-Agent': new UserAgent().toString(),
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://manhwaclan.com/',
  'Connection': 'keep-alive',
})

// --- Error Handling ---
class ApiError extends Error {
  status: number
  constructor(message: string, status = 500) {
    super(message)
    this.status = status
  }
}

// --- Scrapers ---
async function fetchDetails(slug: string) {
  const url = `https://manhwaclan.com/manga/${slug}/`
  const { data } = await axios.get(url, { headers: randomHeader() })
  const $ = cheerio.load(data)

  const title = $('.post-title h1').text().trim()
  if (!title) throw new ApiError('Manga not found', 404)

  return {
    title,
    summary: $('.summary_content .post-content p').text().trim(),
    imageUrl: $('.summary_image img').attr('src'),
    rating: $('.post-total-rating .score').text().trim(),
    rank: $('.post-content_item:contains("Rank") .summary-content').text().trim(),
    alternative: $('.post-content_item:contains("Alternative") .summary-content').text().trim(),
    genres: $('.genres-content a').map((_, el) => $(el).text().trim()).get(),
    type: $('.post-content_item:contains("Type") .summary-content').text().trim(),
    status: $('.post-content_item:contains("Status") .summary-content').text().trim(),
  }
}

async function fetchChapters(slug: string) {
  const url = `https://manhwaclan.com/manga/${slug}/`
  const { data } = await axios.get(url, { headers: randomHeader() })
  const $ = cheerio.load(data)

  const chapters = $('.wp-manga-chapter').map((_, el) => {
    const link = $(el).find('a').attr('href')
    const numberMatch = link?.match(/chapter-(\d+)/)
    const number = numberMatch ? parseInt(numberMatch[1], 10) : null
    return number && link ? { number, url: link } : null
  }).get().filter(Boolean)

  return chapters.sort((a, b) => a.number - b.number) // ascending
}

async function fetchImages(slug: string, chapter: string) {
  const url = `https://manhwaclan.com/manga/${slug}/chapter-${chapter}/`
  const { data } = await axios.get(url, { headers: randomHeader() })
  const $ = cheerio.load(data)

  const images = $('.page-break img').map((_, el) => $(el).attr('src')?.trim()).get()
  if (!images.length) throw new ApiError('No images found', 404)

  return images
}

async function search(query: string, page = 1) {
  const url = `https://manhwaclan.com/?s=${encodeURIComponent(query)}&post_type=wp-manga&page=${page}`
  const { data } = await axios.get(url, { headers: randomHeader() })
  const $ = cheerio.load(data)

  const results = $('.c-tabs-item__content').map((_, el) => {
    const title = $(el).find('.post-title').text().trim()
    const href = $(el).find('a').attr('href')
    if (!title || !href) return null
    return { title, url: href, slug: href.split('/manga/')[1]?.replace(/\/$/, '') }
  }).get().filter(Boolean)

  if (!results.length) throw new ApiError('No results found', 404)

  const totalPages = parseInt($('.wp-pagenavi .pages').text().match(/of (\d+)/)?.[1] ?? '1', 10)

  return {
    results,
    pagination: {
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  }
}

const app = new Hono()

app.onError((err, c) => {
  const status = err instanceof ApiError ? err.status : 500
  return c.json({ success: false, error: err.message }, status as ContentfulStatusCode)
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/manga/:slug', async (c) => {
  const { slug } = c.req.param()
  const details = await fetchDetails(slug)
  return c.json({ success: true, data: details })
})


app.get('/manga/:slug/chapters', async (c) => {
  const { slug } = c.req.param()
  const chapters = await fetchChapters(slug)
  return c.json({ success: true, data: chapters })
})

app.get('/manga/:slug/chapter/:chapter', async (c) => {
  const { slug, chapter } = c.req.param()
  const images = await fetchImages(slug, chapter)
  return c.json({ success: true, data: { images } })
})

export default app
