import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { v4 } from 'uuid'
import fetch from 'node-fetch'

const r = new Redis({
  url: process.env.kv_rest_api_url!,
  token: process.env.kv_rest_api_token!,
})

const domain = 'https://oki-doki-u721.vercel.app'

async function obfuscate(script: string) {
  const res = await fetch('https://wearedevs.net/api/obfuscate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Roblox',
    },
    body: JSON.stringify({ script }),
  })
  if (!res.ok) throw new Error('obfuscation failed')
  const data = (await res.json()) as { obfuscated?: string }
  if (!data.obfuscated) throw new Error('obfuscation failed')

  const cleaned = data.obfuscated.replace(
    /^loadstring\(\[\=+\[\-\-\[\[.*?\]\]\s*/s,
    'loadstring([==[--[[ nexus x prometheus ]] '
  )
  return cleaned
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { script } = req.body
  if (!script || typeof script !== 'string' || !script.trim()) return res.status(400).json({ error: 'invalid script' })
  const id = v4().replace(/-/g, '').slice(0, 12)
  await r.set(`script:${id}`, script)
  const loader = `loadstring(game:HttpGet("${domain}/api/scpt/${id}",true))()`
  const obf = await obfuscate(loader)
  const out = `loadstring("${obf.replace(/"/g, '\\"')}")()`
  res.status(200).json({ url: `/api/scpt/${id}`, loader: out })
}
