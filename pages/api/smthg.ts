import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 } from 'uuid'

export const store = new Map<string, string>()
const obfApi = 'https://wearedevs.net/api/obfuscate/'

async function someshit(script: string) {
  const res = await fetch(obfApi, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0',
    },
    body: JSON.stringify({ script }),
    redirect: 'follow',
  })
  const data = (await res.json()) as { obfuscated?: string; error?: string }
  if (!data.obfuscated) throw new Error('kms')
  return data.obfuscated
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { script } = req.body as { script?: string }
  if (!script || typeof script !== 'string') return res.status(400).json({ error: 'kms' })
  const id = v4().slice(0, 12)
  store.set(id, script)
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers.host
  const domain = host ? `${proto}://${host}` : 'https://oki-doki.vercel.app'
  const loaderLua = `loadstring(game:HttpGet("${domain}/api/scpt/${id}",true))()`
  let obf: string
  try {
    obf = await someshit(loaderLua)
  } catch {
    return res.status(500).json({ error: 'kms' })
  }
  const wrapped = `loadstring([==[${obf}]==])()`
  res.status(200).json({ loader: wrapped, id })
}
