import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).send('kms')

  const ua = req.headers['user-agent'] || ''
  const isRoblox = typeof ua === 'string' && ua.toLowerCase().includes('roblox')
  if (!isRoblox) return res.status(403).send('-- kms --')

  const secondScript = await redis.get(`second:${id}`)
  if (!secondScript) return res.status(404).send('kms')

  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send(secondScript)
}
