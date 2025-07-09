import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export default async function someshit(req: NextApiRequest, res: NextApiResponse) {
  const bsdata = req.headers['x-bsdata']
  const hwid = req.headers['x-hwid']
  if (!bsdata || !hwid) return res.status(403).send('kms')

  const expectedBsdata = await redis.get(`token:${hwid}`)
  if (expectedBsdata !== bsdata) return res.status(403).send('kms')

  const id = req.query.id
  if (!id || typeof id !== 'string') return res.status(400).send('kms')

  const script = await redis.get(`script:${id}`)
  if (!script) return res.status(404).send('kms')

  res.setHeader('content-type', 'text/plain')
  res.status(200).send(script)
}
