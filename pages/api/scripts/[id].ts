import type { NextApiRequest, NextApiResponse } from 'next'

const scripts: Record<string, string> = {}

export default function someshit(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string
  if (!id || !scripts[id]) return res.status(404).send('kms')

  const ua = req.headers['user-agent'] ?? ''
  if (!ua.toLowerCase().includes('roblox')) return res.status(403).send('i wanna die')

  res.setHeader('content-type', 'text/plain')
  res.status(200).send(scripts[id])
}
