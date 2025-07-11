import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../lib/kv'
import { v4 as uid } from 'uuid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const ua = req.headers['user-agent'] || ''
  if (!req.body?.script || typeof req.body.script !== 'string') return res.status(400).end()
  try {
    const result = await runObfuscator(req.body.script)
    const id = uid()
    await redis.set(id, result)
    res.json({ loader: `${process.env.DOMAIN}/api/scpt/${id}` })
  } catch {
    res.status(500).end()
  }
}

async function runObfuscator(code: string) {
  const res = await fetch('https://wearedevs.net/api/obfuscate', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/5.0',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ script: code }),
  })

  const out = await res.json()
  if (!out || typeof out !== 'object' || !('obfuscated' in out)) throw new Error()
  return (out as any).obfuscated.replace(/^\s*loadstring\(\[\=+\[\-\-\[\[.*?\]\]\s*/s, 'loadstring([==[')
}
