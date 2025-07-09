import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { v4 as uuidv4 } from 'uuid'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

function someshit() {
  let s = ''
  const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  for (let i = 0; i < 64; i++) s += c[Math.floor(Math.random() * c.length)]
  return s
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const bsdata = someshit()
  const hwid = uuidv4()
  await redis.setex(`token:${hwid}`, 15, bsdata)
  res.status(200).json({ bsdata, hwid })
}
