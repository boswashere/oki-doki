import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { v4 } from 'uuid'
import fetch from 'node-fetch'

const r = new Redis({
  url: process.env.kv_rest_api_url!,
  token: process.env.kv_rest_api_token!,
})

const u = 'https://wearedevs.net/api/obfuscate'
const d = 'https://oki-doki.vercel.app'

async function f(s: string) {
  const res = await fetch(u, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'roblox',
    },
    body: JSON.stringify({ script: s }),
  })

  const j = await res.json()
  if (!j || typeof j !== 'object' || !('obfuscated' in j)) throw new Error('obfuscation failed')
  return (j as any).obfuscated.replace(/^\s*loadstring\(\[\=+\[\-\-\[\[.*?\]\]\s*/s, 'loadstring([==[')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  if (req.headers['user-agent']?.toLowerCase() !== 'roblox') return res.status(401).end()
  const { script } = req.body
  if (!script || typeof script !== 'string' || !script.trim()) return res.status(400).json({ error: 'invalid script' })
  const id = v4().replace(/-/g, '').slice(0, 12)
  await r.set(`script:${id}`, script)
  const l = `loadstring(game:HttpGet("${d}/api/scpt/${id}",true))()`
  const o = await f(l)
  const out = `loadstring("${o.replace(/"/g, '\\"')}")()`
  res.status(200).json({ url: `/api/scpt/${id}`, loader: out })
}
