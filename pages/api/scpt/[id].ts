import type { NextApiRequest, NextApiResponse } from 'next'
import { store, obfuscate } from '../smthg'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const userAgent = req.headers['user-agent'] || ''
  if (!userAgent.toLowerCase().includes('roblox')) {
    return res.status(401).send('unauthorized - get rekt btw')
  }

  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).send('invalid id')
  }
  const script = await store.get(`script:${id}`)
  if (!script || typeof script !== 'string') {
    return res.status(404).send('script not found')
  }
  try {
    const obf = await obfuscate(script)
    const safe = obf.replace(/^--\[\[.*?\]\]\s*/, '')
    res.setHeader('Content-Type', 'text/plain')
    res.status(200).send(safe)
  } catch {
    res.status(500).send('obfuscation failed')
  }
}
