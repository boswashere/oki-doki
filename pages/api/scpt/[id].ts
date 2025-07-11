import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.kv_rest_api_url!,
  token: process.env.kv_rest_api_token!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const ua = req.headers['user-agent'] || ''
  if (!ua.toLowerCase().includes('roblox')) return res.status(403).end()
  const id = req.query.id as string
  if (!id || typeof id !== 'string') return res.status(400).end()
  const script = await redis.get(`script:${id}`)
  if (!script || typeof script !== 'string') return res.status(404).end()
  res.setHeader('content-type', 'text/plain')
  res.send(script)
}
