import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import crypto from 'crypto'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

function randInt() {
  return Math.floor(Math.random() * 999999999)
}

function randHex(len = 64) {
  return crypto.randomBytes(len / 2).toString('hex')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).send('kms')

  const script = await redis.get<string>(`script:${id}`)
  if (!script) return res.status(404).send('pls kill me')

  const host = `${req.headers.host?.startsWith('localhost') ? 'http' : 'https'}://${req.headers.host}`
  const rawUrl = `${host}/api/raw/${id}`

  const fake = [
    `{${randInt()},${randInt()},${randInt()}}`,
    `${randInt()}`,
    `"\\${crypto.randomBytes(4).join('\\')}"`,
    `"${randHex()}"`
  ]

  const code = `
_bsdata0 = {${fake.join(',')}}
local a
pcall(function()
a=game:HttpGet("${rawUrl}",true)
end)
if a then loadstring(a)() end
`.trim()

  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send(code)
}
