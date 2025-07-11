import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { v4 as uuidv4 } from 'uuid'
import fetch from 'node-fetch'

export const store = new Redis({
  url: process.env.kv_rest_api_url!,
  token: process.env.kv_rest_api_token!,
})

export async function obfuscate(script: string): Promise<string> {
  const res = await fetch('https://wearedevs.net/api/obfuscate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0'
    },
    body: JSON.stringify({ script })
  })

  const data = await res.json()
  if (!data.obfuscated) throw new Error('Obfuscation failed')
  return data.obfuscated
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { script } = req.body
  if (!script || typeof script !== 'string' || !script.trim()) {
    return res.status(400).json({ error: 'Invalid script' })
  }
  const id = uuidv4().replace(/-/g, '').slice(0, 12)
  await store.set(`script:${id}`, script)
  const domain = req.headers.host?.startsWith('localhost')
    ? `http://${req.headers.host}`
    : `https://${req.headers.host}`
  const loader = `loadstring(game:HttpGet("${domain}/api/scpt/${id}", true))()`
  const obfuscated = await obfuscate(loader)
  const final = `loadstring("${obfuscated.replace(/"/g, '\\"')}")()`
  res.status(200).json({ url: `/api/scpt/${id}`, loader: final })
}
