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
    <div
      style={{
        minHeight: '100vh',
        background: '#0f0f1a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 700,
          background: '#161622',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 0 30px rgba(255, 20, 147, 0.2)',
          color: '#fff',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '2rem',
            color: '#ff69b4',
            textShadow: '0 0 10px #ff69b4',
          }}
        >
          nexus
        </h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          placeholder="paste your script here...(can be a url)"
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #ff69b4',
            background: '#0d0d18',
            color: '#fff',
            resize: 'vertical',
            fontSize: '1rem',
            outline: 'none',
          }}
          disabled={load}
          spellCheck={false}
        />
        {err && (
          <div style={{ color: '#ff4d4d', marginTop: '0.5rem', fontWeight: 'bold' }}>{err}</div>
        )}
        <button
          onClick={someshit}
          disabled={load}
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#ff69b4',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            cursor: load ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff1493',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {load ? 'uploading' : 'upload'}
        </button>

        {res && (
          <input
            type="text"
            value={res}
            readOnly
            onFocus={(e) => e.target.select()}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid #0f0',
              background: '#000',
              color: '#0f0',
              fontSize: '0.9rem',
            }}
          />
        )}
      </div>
    </div>
  )
}
