import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../../lib/kv'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const ua = req.headers['user-agent'] || ''
  if (!ua.toLowerCase().includes('roblox')) return res.status(403).end()
  const val = await redis.get(req.query.id as string)
  if (!val || typeof val !== 'string') return res.status(404).end()
  res.setHeader('content-type', 'text/plain')
  res.send(`loadstring([==[${val}]==])()`)
}
