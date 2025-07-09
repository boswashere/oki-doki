import type { NextApiRequest, NextApiResponse } from 'next'
import { getScript } from '../save_script'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string
  if (!getScript(id)) return res.status(404).send('kms')

  const domain = req.headers.host?.startsWith('localhost') ? 'http://' + req.headers.host : 'https://' + req.headers.host
  const payload = `loadstring(game:HttpGet("${domain}/api/scripts/${id}", true))()`

  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send(payload)
}
