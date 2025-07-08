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
        body: JSON.stringify({ script: text }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('i wanna die')
      const data = await res.json()
      const id = data.url.split('/').pop()
      const domain = window.location.origin
      setResult(`loadstring(game:GetService("HttpService"):GetAsync("${domain}/api/scripts/${id}"))()`)
    } catch {
      setError('i wanna die')
      setResult('')
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    container: {
      maxWidth: 600,
      margin: '2rem auto',
      fontFamily: 'Arial, sans-serif',
      padding: '0 1rem',
    },
    title: {
      textAlign: 'center' as const,
      marginBottom: '1.5rem',
      fontWeight: 600,
      fontSize: '2rem',
      textTransform: 'lowercase' as React.CSSProperties['textTransform'],
      userSelect: 'none' as const,
    },
    textarea: {
      width: '100%',
      padding: '1rem',
      fontSize: '1rem',
      borderRadius: 6,
      border: '1px solid #ccc',
      resize: 'vertical' as const,
      boxSizing: 'border-box' as const,
      fontFamily: 'monospace',
      transition: 'all 0.2s ease',
      textTransform: 'lowercase' as React.CSSProperties['textTransform'],
      outline: 'none',
    },
    error: {
      color: 'red',
      marginTop: '0.5rem',
      textTransform: 'lowercase' as React.CSSProperties['textTransform'],
    },
    button: {
      marginTop: '1rem',
      width: '100%',
      padding: '0.75rem',
      fontSize: '1.1rem',
      borderRadius: 6,
      border: 'none',
      backgroundColor: '#0070f3',
      color: '#fff',
      cursor: loading ? 'not-allowed' : 'pointer',
      textTransform: 'lowercase' as React.CSSProperties['textTransform'],
      userSelect: 'none' as const,
      transition: 'background-color 0.3s ease',
    },
    input: {
      marginTop: '1.5rem',
      width: '100%',
      padding: '0.75rem',
      fontSize: '1rem',
      borderRadius: 6,
      border: '1px solid #ccc',
      backgroundColor: '#f9f9f9',
      userSelect: 'all' as const,
      fontFamily: 'monospace',
      textTransform: 'lowercase' as React.CSSProperties['textTransform'],
    },
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
      <button onClick={handleSubmit} disabled={loading} style={styles.button}>
        {loading ? 'uploading...' : 'upload'}
      </button>
      {result && (
        <input
          type="text"
          value={result}
          readOnly
          onFocus={e => e.target.select()}
          style={styles.input}
        />
      )}
    </main>
  )
}
