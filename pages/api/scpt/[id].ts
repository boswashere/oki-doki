import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const r = new Redis({
  url: process.env.kv_rest_api_url!,
  token: process.env.kv_rest_api_token!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (req.method !== 'GET' || typeof id !== 'string') {
    return res.status(400).send('kms')
  }
  const script = await r.get<string>(`script:${id}`)
  if (!script) return res.status(404).send('kms')
  res.setHeader('content-type', 'text/plain')
  res.status(200).send(script)
}
