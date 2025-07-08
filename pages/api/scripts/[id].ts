import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).send('kys')
  }

  const script = await redis.get<string>(`script:${id}`)

  if (!script) {
    return res.status(404).send('-- why are you looking here man\n-- kys')
  }

  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send(script)
}
