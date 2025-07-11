import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import fetch from 'node-fetch'

const r = new Redis({
  url: process.env.kv_rest_api_url!,
  token: process.env.kv_rest_api_token!,
})

const url = 'https://wearedevs.net/api/obfuscate'

async function someshit2(script: string) {
  const res = await fetch(url, {
    method: 'post',
    headers: { 'content-type': 'application/json', 'user-agent': 'mozilla/5.0' },
    body: JSON.stringify({ script }),
  })

  const data = await res.json()
  if (!data.obfuscated) throw new Error('die please die')
  return data.obfuscated
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).send('sarah please kill me ')
  const script = await r.get(`script:${id}`)
  if (!script) return res.status(404).send('do it sarah kill me')
  try {
    const obf = await someshit2(script)
    res.setHeader('content-type', 'text/plain')
    res.status(200).send(obf)
  } catch {
    res.status(500).send('please.')
  }
}
