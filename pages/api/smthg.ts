import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { v4 } from 'uuid'

const r = new Redis({
  url: process.env.kv_rest_api_url!,
  token: process.env.kv_rest_api_token!,
})

const obfApi = 'https://wearedevs.net/api/obfuscate'

async function someshit(script: string) {
  const res = await fetch(obfApi, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'mozilla/5.0',
    },
    body: JSON.stringify({ script }),
  })
  if (!res.ok) throw new Error('kms')
  const data = (await res.json()) as { obfuscated?: string }
  if (!data.obfuscated) throw new Error('kms')
  return data.obfuscated
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { script } = req.body
  if (!script || typeof script !== 'string' || !script.trim()) {
    return res.status(400).json({ error: 'kms' })
  }
  const id = v4().replace(/-/g, '').slice(0, 12)
  await r.set(`script:${id}`, script)
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers.host
  const domain = host ? `${proto}://${host}` : 'https://oki-doki.vercel.app'
  const loaderLua = `loadstring(game:HttpGet("${domain}/api/scpt/${id}",true))()`
  const obfLoader = await someshit(loaderLua)
  const wrapped = `loadstring([==[${obfLoader}]==])()`
  res.status(200).json({ url: `/api/scpt/${id}`, loader: wrapped })
}
