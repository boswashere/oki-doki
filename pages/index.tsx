import { useState } from 'react'

export default function Page() {
  const [script, set_script] = useState('')
  const [output, set_output] = useState('')
  const [error, set_error] = useState('')
  const [loading, set_loading] = useState(false)

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
    <div className="wrapper">
      <div className="card">
        <h1 className="title">sybau uploader</h1>
        <form onSubmit={submit}>
          <textarea
            className="textarea"
            rows={8}
            placeholder="paste script or url here"
            value={script}
            onChange={(e) => set_script(e.target.value)}
            disabled={loading}
          />
          {error && <div className="error">{error}</div>}
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'uploading...' : 'upload'}
          </button>
        </form>
        {output && (
          <textarea
            className="output"
            rows={4}
            readOnly
            value={output}
            onFocus={(e) => e.target.select()}
          />
        )}
      </div>
    </div>
  )
}
