import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function someshit3() {
    if (!text.trim()) return setError('kms')

    setError('')
    setLoading(true)

    try {
      const tokenRes = await fetch('/api/get_token')
      if (!tokenRes.ok) throw new Error()
      const { bsdata, hwid } = await tokenRes.json()

      const saveRes = await fetch('/api/save_script', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ script: text }),
      })
      if (!saveRes.ok) throw new Error()
      const data = await saveRes.json()
      const id = data.url.split('/').pop()
      const domain = window.location.origin

      // loadstring includes the dynamic headers required to fetch the script man this so hard i hate my life genuinely
      setResult(
        `loadstring(game:HttpGet("${domain}/api/scripts/${id}", true, {["x-bsdata"]="${bsdata}", ["x-hwid"]="${hwid}"}))()`
      )
    } catch {
      setError('i wanna die')
      setResult('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'monospace' }}>
      <div style={{ textAlign: 'center', marginBottom: 20, fontSize: '1.5rem' }}>sybau uploader</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        style={{
          width: '100%',
          padding: 10,
          borderRadius: 6,
          border: '1px solid #999',
          resize: 'vertical',
          background: '#111',
          color: '#eee',
        }}
        disabled={loading}
        spellCheck={false}
      />
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <button
        onClick={someshit3}
        disabled={loading}
        style={{
          width: '100%',
          marginTop: 16,
          padding: 12,
          background: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
        }}
      >
        {loading ? 'uploading...' : 'upload'}
      </button>
      {result && (
        <input
          type="text"
          value={result}
          readOnly
          onFocus={(e) => e.target.select()}
          style={{
            marginTop: 20,
            width: '100%',
            padding: 10,
            borderRadius: 6,
            border: '1px solid #999',
            background: '#000',
            color: '#0f0',
          }}
        />
      )}
    </div>
  )
}
