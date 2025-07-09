import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const expectedUA = 'roblox-custom-ua-0987fhsdkj'
const expectedToken = 'super-secret-token-23423'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ua = req.headers['user-agent']
  const token = req.headers['x-auth-token']
  const hwid = req.headers['x-hwid']

  if (!ua || !token || !hwid) return res.status(403).send('kms')
  if (ua !== expectedUA) return res.status(403).send('kms')
  if (token !== expectedToken) return res.status(403).send('kms')

  const id = req.query.id
  if (!id || typeof id !== 'string') return res.status(400).send('kms')

  const script = await redis.get(`script:${id}`)
  if (!script) return res.status(404).send('kms')

  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send(script)
}
