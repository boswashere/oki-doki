import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('i wanna die')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/save_script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: text }),
      })
      if (!res.ok) throw new Error('i wanna die')
      const data = await res.json()
      const id = data.url.split('/').pop()
      const domain = window.location.origin
      setResult(`loadstring(game:HttpGet("${domain}/api/scripts/${id}"))()`)
    } catch {
      setError('i wanna die')
      setResult('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      maxWidth: 600, margin: '3rem auto', fontFamily: 'monospace',
      padding: '1rem', color: '#111',
    }}>
      <h1 style={{
        textAlign: 'center', fontSize: '2rem',
        marginBottom: '1.5rem', textTransform: 'lowercase',
      }}>sybau uploader</h1>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={12}
        placeholder=""
        style={{
          width: '100%', padding: '1rem', borderRadius: 6,
          fontSize: '1rem', resize: 'vertical',
          border: '1px solid #ccc', fontFamily: 'monospace',
          textTransform: 'lowercase',
        }}
        disabled={loading}
      />

      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: 12, width: '100%', padding: '0.75rem',
          backgroundColor: '#0070f3', color: '#fff',
          border: 'none', borderRadius: 6,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '1rem', textTransform: 'lowercase',
        }}
      >
        {loading ? 'uploading...' : 'upload'}
      </button>

      {result && (
        <input
          value={result}
          readOnly
          onFocus={e => e.target.select()}
          style={{
            marginTop: 20, width: '100%', padding: '0.75rem',
            fontSize: '0.95rem', borderRadius: 6,
            border: '1px solid #ccc', fontFamily: 'monospace',
            backgroundColor: '#f9f9f9', textTransform: 'lowercase',
          }}
        />
      )}
    </main>
  )
}
