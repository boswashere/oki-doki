import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const domain = typeof window !== 'undefined' ? window.location.origin : ''

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
        body: text,
      })
      if (!res.ok) throw new Error('i wanna die')
      const data = await res.json()
      const id = data.url.split('/').pop()
      setResult(`loadstring(game:HttpGet("${domain}/api/scripts/${id}"))()`)
    } catch {
      setError('i wanna die')
      setResult('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>sybau uploader</h1>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={12}
        style={styles.textarea}
        disabled={loading}
        spellCheck={false}
      />
      {error && <p style={styles.error}>{error}</p>}
      <button onClick={handleSubmit} disabled={loading} style={loading ? styles.buttonDisabled : styles.button}>
        {loading ? 'uploading...' : 'upload'}
      </button>
      {result && (
        <input
          type="text"
          value={result}
          readOnly
          style={styles.resultInput}
          onFocus={e => e.target.select()}
          aria-label="generated loadstring"
        />
      )}
    </main>
  )
}

const styles = {
  container: {
    maxWidth: 700,
    margin: '3rem auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '0 1rem',
    textAlign: 'center' as const,
    color: '#222',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    color: '#0070f3',
    fontWeight: '700',
    textTransform: 'lowercase' as const,
    letterSpacing: '2px',
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.1rem',
    borderRadius: 8,
    border: '2px solid #ddd',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
    fontFamily: 'monospace',
    transition: 'border-color 0.3s ease',
    textTransform: 'none',
  },
  error: {
    color: '#d93025',
    marginTop: '0.5rem',
    fontWeight: '600',
    textTransform: 'lowercase' as const,
  },
  button: {
    marginTop: '1.5rem',
    width: '100%',
    padding: '0.85rem',
    fontSize: '1.25rem',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#0070f3',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    textTransform: 'lowercase' as const,
    transition: 'background-color 0.3s ease',
  },
  buttonDisabled: {
    marginTop: '1.5rem',
    width: '100%',
    padding: '0.85rem',
    fontSize: '1.25rem',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#a0c3ff',
    color: '#fff',
    fontWeight: '600',
    cursor: 'not-allowed',
    textTransform: 'lowercase' as const,
  },
  resultInput: {
    marginTop: '2rem',
    width: '100%',
    padding: '0.85rem',
    fontSize: '1rem',
    borderRadius: 8,
    border: '1px solid #ccc',
    backgroundColor: '#f7f7f7',
    fontFamily: 'monospace',
    userSelect: 'all' as const,
    textTransform: 'none',
  },
}
