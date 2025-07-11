import type { NextApiRequest, NextApiResponse } from 'next'
import r from '../../kv'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const ua = req.headers['user-agent'] || ''
  if (!ua.toLowerCase().includes('roblox')) return res.status(403).json({ error: 'unauthorized' })
  const { id } = req.query
  const script = await r.get(`script:${id}`)
  if (!script) return res.status(404).json({ error: 'not found' })
  res.setHeader('content-type', 'text/plain')
  res.status(200).send(script)
}
