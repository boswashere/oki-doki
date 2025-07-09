import type { NextApiRequest, NextApiResponse } from 'next'
import { getScript } from '../save_script'

function isRobloxUA(ua: string | undefined): boolean {
  if (!ua) return false
  return ua.toLowerCase().includes('roblox')
}

function someshit(): string {
  const a = Array.from({ length: 50 }, () => Math.floor(Math.random() * 999999999))
  return '_bsdata0 = {' + a.join(',') + '}\n'
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string
  const ua = req.headers['user-agent']

  if (!isRobloxUA(ua)) return res.status(403).send('-- kms')

  const script = getScript(id)
  if (!script) return res.status(404).send('-- kill me')

  const bs = someshit()
  const final = bs + '\n' + script

  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send(final)
}
