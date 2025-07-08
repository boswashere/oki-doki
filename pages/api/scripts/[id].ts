import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    query: { id },
  } = req
  if (method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }
  if (typeof id !== 'string' || !id) return res.status(400).end()
  const script = await redis.get<string>(`script:${id}`)
  if (!script) return res.status(404).end()
  res.setHeader('Content-Type', 'text/plain')
  return res.status(200).send(script)
}
