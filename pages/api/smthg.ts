import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { v4 } from 'uuid'
import fetch from 'node-fetch'

const r = new Redis({
  url: process.env.kv_rest_api_url!,
  token: process.env.kv_rest_api_token!,
})

const obfuscateUrl = 'https://wearedevs.net/api/obfuscate'

async function obfuscate(script: string) {
  const res = await fetch(obfuscateUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'mozilla/5.0',
    },
    body: JSON.stringify({ script }),
  })

  const data = (await res.json()) as { obfuscated?: string }
  if (!data.obfuscated) throw new Error('failed obfuscation')
  return data.obfuscated
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { script } = req.body
  if (!script || typeof script !== 'string' || !script.trim()) return res.status(400).json({ error: 'empty script' })

  const id = v4().replace(/-/g, '').slice(0, 12)
  await r.set(`script:${id}`, script)

  const domain = req.headers.origin || 'https://oki-doki.vercel.app'
  const loader = `loadstring(game:HttpGet("${domain}/api/scpt/${id}",true))()`
  const obf = await obfuscate(loader)
  const out = `loadstring("${obf.replace(/"/g, '\\"')}")()`

  res.status(200).json({ url: `/api/scpt/${id}`, loader: out })
}
