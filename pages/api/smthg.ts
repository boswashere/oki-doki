import type { NextApiRequest, NextApiResponse } from 'next'
import { randomUUID } from 'crypto'
import r from '../kv' // updated path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const j = req.body
  if (!j || typeof j !== 'object' || typeof j.script !== 'string') {
    return res.status(400).json({ error: 'missing' })
  }

  const x = await fetch('https://wearedevs.net/api/obfuscate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0',
    },
    body: JSON.stringify({ script: j.script }),
  })
  if (!x.ok) return res.status(500).json({ error: 'obfuscation request failed' })
  const d = await x.json()
  if (!d || typeof d !== 'object' || !('obfuscated' in d)) {
    return res.status(500).json({ error: 'obfuscation failed' })
  }
  const o = (d as any).obfuscated.replace(/^\s*loadstring\(\[\=+\[\-\-\[\[.*?\]\]\s*/s, 'loadstring([==[')
  const id = randomUUID().slice(0, 8)
  await r.set(`script:${id}`, o, { ex: 3600 })
  return res.status(200).json({ loader: `${process.env.domain}/api/scpt/${id}` })
}
