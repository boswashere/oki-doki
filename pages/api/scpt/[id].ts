import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const r = new Redis({
  url: process.env.kv_rest_api_url!,
  token: process.env.kv_rest_api_token!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  if (req.headers['user-agent']?.toLowerCase() !== 'roblox') return res.status(401).end()
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'invalid id' })
  const s = await r.get(`script:${id}`)
  if (!s || typeof s !== 'string') return res.status(404).json({ error: 'not found' })
  res.setHeader('content-type', 'text/plain')
  res.send(s)
}
