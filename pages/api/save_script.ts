import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { v4 as uuidv4 } from 'uuid'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export default async function someshit2(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { script } = req.body
  if (!script || typeof script !== 'string' || !script.trim()) return res.status(400).end()
  const id = uuidv4().replace(/-/g, '').slice(0, 12)
  await redis.set(`script:${id}`, script)
  res.status(200).json({ url: `/api/scripts/${id}` })
}
