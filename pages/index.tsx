import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [res, setRes] = useState('')
  const [load, setLoad] = useState(false)
  const [err, setErr] = useState('')

  async function someshit() {
    if (!text.trim()) return setErr('kms')
    setErr('')
    setLoad(true)

    try {
      const r = await fetch('/api/smthg', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ script: text }),
      })

      if (!r.ok) throw new Error()

      const d = await r.json()
      setRes(d.loader)
    } catch {
      setErr('i wanna die')
      setRes('')
    } finally {
      setLoad(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'monospace' }}>
      <div style={{ textAlign: 'center', marginBottom: 20, fontSize: '1.5rem' }}>sybau uploader</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #999', resize: 'vertical', background: '#111', color: '#eee' }}
        disabled={load}
        spellCheck={false}
      />
      {err && <div style={{ color: 'red', marginTop: 8 }}>{err}</div>}
      <button
        onClick={someshit}
        disabled={load}
        style={{ width: '100%', marginTop: 16, padding: 12, background: '#0070f3', color: '#fff', border: 'none', borderRadius: 6 }}
      >
        {load ? 'uploading...' : 'upload'}
      </button>
      {res && (
        <input
          type="text"
          value={res}
          readOnly
          onFocus={(e) => e.target.select()}
          style={{ marginTop: 20, width: '100%', padding: 10, borderRadius: 6, border: '1px solid #999', background: '#000', color: '#0f0' }}
        />
      )}
    </div>
  )
}
