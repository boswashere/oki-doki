import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

function someshit() {
  const a = []
  for (let i = 0; i < 40 + Math.floor(Math.random() * 30); i++) {
    const t = Math.random()
    if (t < 0.3) a.push(Math.floor(Math.random() * 1e10))
    else if (t < 0.6) a.push(`"${crypto.randomBytes(8).toString('hex')}"`)
    else a.push([Math.floor(Math.random() * 1e4), Math.floor(Math.random() * 1e4)])
  }
  return `_bsdata0 = {${a.join(',')}}`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { script } = req.body
  if (!script || typeof script !== 'string' || !script.trim()) return res.status(400).end()

  const finalId = uuidv4().replace(/-/g, '').slice(0, 12)
  const secondId = uuidv4().replace(/-/g, '').slice(0, 12)
  const loaderId = uuidv4().replace(/-/g, '').slice(0, 12)
  await redis.set(`final:${finalId}`, script)

  const domain = process.env.DOMAIN || 'https://oki-doki.vercel.app'
  const secondScript = `${someshit()}
pcall(function()
  local src = game:HttpGet("${domain}/api/final_payload/${finalId}", true)
  loadstring(src)()
end)`
  await redis.set(`second:${secondId}`, secondScript)
  await redis.set(`loader:${loaderId}`, secondId)

  res.status(200).json({ url: `/api/scripts/${loaderId}` })
}
