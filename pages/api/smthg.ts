import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { v4 } from 'uuid'
import fetch from 'node-fetch'

const redis = new Redis({
  url: process.env.kv_rest_api_url!,
  token: process.env.kv_rest_api_token!,
})

const domain = 'https://oki-doki-u721.vercel.app'

async function obfuscate(script: string) {
  const res = await fetch('https://wearedevs.net/api/obfuscate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'roblox',
    },
    body: JSON.stringify({ script }),
  })
  if (!res.ok) throw new Error('obfuscation failed')
  const data = (await res.json()) as { obfuscated?: string }
  if (!data.obfuscated) throw new Error('obfuscation failed')
  return data.obfuscated.replace(
    /^\s*loadstring\(\[\=+\[\-\-.*?\]\]\s*/s,
    'loadstring([==['
  ).replace(
    /https:\/\/wearedevs\.net\/obfuscator/,
    'nexus x prometheus'
  )
}

async function upload(script: string) {
  const res = await fetch('https://pastebin.com/api/api_post.php', {
    method: 'POST',
    body: new URLSearchParams({
      api_dev_key: 'BGUlk8lmHtnr5rYQVsHqvofGcJ3-VC9h',
      api_option: 'paste',
      api_paste_code: script,
      api_paste_private: '1',
      api_paste_expire_date: 'N',
    }),
  })
  const txt = await res.text()
  if (!res.ok || !txt.includes('https://')) throw new Error('pastebin error')
  return txt.replace('https://pastebin.com/', 'https://pastebin.com/raw/')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { script } = req.body
  if (!script || typeof script !== 'string' || !script.trim()) return res.status(400).json({ error: 'invalid script' })
  const id = v4().replace(/-/g, '').slice(0, 12)
  await redis.set(`script:${id}`, script)
  const raw = `loadstring(game:HttpGet("${domain}/api/scpt/${id}",true))()`
  const obf = await obfuscate(raw)
  const final = `loadstring("${obf.replace(/"/g, '\\"')}")()`
  const paste = await upload(final)
  res.status(200).json({ loader: paste })
}
