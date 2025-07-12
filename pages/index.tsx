import { useState } from 'react'

export default function page() {
  const [script, set_script] = useState('')
  const [output, set_output] = useState('')
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    set_loading(true)
    set_error('')
    set_output('')
    try {
      const res = await fetch('/api/smthg', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ script }),
      })
      const data = await res.json()
      if (!res.ok || !data.loader) throw new Error(data.error || 'fail')
      set_output(data.loader)
    } catch (err: any) {
      set_error(err.message || 'fail')
    } finally {
      set_loading(false)
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <form onSubmit={submit}>
        <textarea
          value={script}
          onChange={(e) => set_script(e.target.value)}
          rows={10}
          style={{ width: '100%' }}
          placeholder="paste script"
        />
        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? 'loading...' : 'upload'}
        </button>
      </form>
      {output && (
        <div style={{ marginTop: 20 }}>
          <pre>{output}</pre>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </main>
  )
}
