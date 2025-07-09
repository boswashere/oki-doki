import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).send('kms')

  const realid = await redis.get<string>(`loader:${id}`)
  if (!realid) return res.status(404).send('i wanna die')

  const domain = req.headers.host?.startsWith('localhost')
    ? 'http://' + req.headers.host
    : 'https://' + req.headers.host

  const payload = `loadstring(game:HttpGet("${domain}/api/data/${realid}",true))()`

  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send(payload)
}
