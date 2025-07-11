import type { NextApiRequest, NextApiResponse } from 'next'
import { store } from '../smthg'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const { id } = req.query
  if (typeof id !== 'string') return res.status(400).end('kms')
  const script = store.get(id)
  if (!script) return res.status(404).end('kms')
  res.setHeader('content-type', 'text/plain')
  res.status(200).send(script)
}
