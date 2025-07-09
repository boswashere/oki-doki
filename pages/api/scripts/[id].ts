import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).send('kms')
  const script = await redis.get(`script:${id}`)
  if (!script) return res.status(404).send('i wanna die')

  const ua = req.headers['user-agent'] || ''
  const allow = typeof ua === 'string' && ua.toLowerCase().includes('roblox')
  if (!allow) {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/plain')
    return res.end('-- die die die\n-- kms')
  }

  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send(script)
}
