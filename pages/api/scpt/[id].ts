import type { NextApiRequest, NextApiResponse } from 'next'
import { store, obfuscate } from '../smthg'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).send('missing id')
  const ua = req.headers['user-agent'] || ''
  if (!ua.toLowerCase().includes('roblox')) {
    return res.status(401).send('die with a dream nexus on top wowp')
  }
  const script = await store.get(`script:${id}`)
  if (!script || typeof script !== 'string') return res.status(404).send('not found')
  try {
    let obf = await obfuscate(script)
    obf = obf.replace(/^--\[\[.*?\]\]\s*/s, '')
    res.setHeader('Content-Type', 'text/plain')
    res.status(200).send(obf)
  } catch (err) {
    res.status(500).send('obfuscation failed')
  }
}
