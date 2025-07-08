import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { v4 as uuidv4 } from 'uuid'

export const config = {
  api: {
    bodyParser: {
      type: 'text/plain',
    },
  },
}

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const body = req.body
  if (!body || typeof body !== 'string' || !body.trim()) return res.status(400).end()
  const id = uuidv4().replace(/-/g, '').slice(0, 12)
  await redis.set(`script:${id}`, body)
  res.status(200).json({ url: `/api/scripts/${id}` })
}
