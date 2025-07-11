import { Redis } from '@upstash/redis'

const r = new Redis({
  url: process.env.kv_rest_api_url!,
  token: process.env.kv_rest_api_token!,
})

export default r
