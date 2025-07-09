import type { NextApiRequest, NextApiResponse } from 'next'

const scripts: Record<string, string> = {}

function someshit() {
  return Math.random().toString(36).slice(2, 14)
}

export default function someshit2(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { script } = req.body
  if (!script || typeof script !== 'string' || !script.trim()) return res.status(400).end()

  const id = someshit()
  scripts[id] = script
  res.status(200).json({ url: `/api/scripts/${id}` })
}
