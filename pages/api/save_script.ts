import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'

const store: Record<string, string> = {}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { script } = req.body
  if (!script || typeof script !== 'string') return res.status(400).end()

  const id = uuidv4().slice(0, 12)
  store[id] = script
  res.status(200).json({ url: `/api/loader/${id}` })
}

export const getScript = (id: string) => store[id]
