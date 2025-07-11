import type { nextapirequest, nextapiresponse } from 'next'
import { redis } from '@upstash/redis'
import { v4 } from 'uuid'

const r = new redis({
  url: process.env.kv_rest_api_url!,
  token: process.env.kv_rest_api_token!,
})

const url = 'https://wearedevs.net/api/obfuscate'

async function someshit(script: string) {
  const res = await fetch(url, {
    method: 'post',
    headers: { 'content-type': 'application/json', 'user-agent': 'mozilla/5.0' },
    body: JSON.stringify({ script }),
  })

  const data = await res.json()
  if (!data.obfuscated) throw new Error('kms')
  return data.obfuscated
}

export default async function someshit2(req: nextapirequest, res: nextapiresponse) {
  if (req.method !== 'post') return res.status(405).end()
  const { script } = req.body
  if (!script || typeof script !== 'string' || !script.trim()) return res.status(400).json({ error: 'kms' })
  const id = v4().replace(/-/g, '').slice(0, 12)
  await r.set(`script:${id}`, script)
  const domain = process.env.domain || 'https://oki-doki.vercel.app'
  const loader = `loadstring(game:HttpGet("${domain}/api/scpt/${id}",true))()`
  const obf = await someshit(loader)
  const out = `loadstring([==[${obf}]==])()`
  res.status(200).json({ url: `/api/scpt/${id}`, loader: out })
}
