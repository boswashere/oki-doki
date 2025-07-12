import { useState, useEffect } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'

export default function Page() {
  const [script, set_script] = useState('')
  const [output, set_output] = useState('')
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState('')
  const [dark, set_dark] = useState(true)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

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
    <>
      <style jsx global>{`
        :root {
          --bg: #121212;
          --fg: #e0e0e0;
          --card: #1f1f1f;
          --input: #2a2a2a;
          --primary: #f72585;
          --error: #ff6b6b;
          --success: #8be9fd;
          --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        [data-theme="light"] {
          --bg: #f9f9f9;
          --fg: #1f1f1f;
          --card: #fff;
          --input: #ececec;
          --primary: #0070f3;
          --error: #d32f2f;
          --success: #00796b;
        }
        html, body {
          margin: 0; padding: 0; height: 100%;
          background: var(--bg); color: var(--fg);
          font-family: var(--font);
        }
        #__next { height: 100% }
        .wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100%;
          padding: 1rem;
          box-sizing: border-box;
        }
        .card {
          background: var(--card);
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          width: 100%;
          max-width: 600px;
          position: relative;
        }
        .toggle {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: var(--fg);
          font-size: 1.5rem;
          cursor: pointer;
        }
        textarea {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          background: var(--input);
          color: var(--fg);
          font-family: monospace;
          font-size: 1rem;
          resize: vertical;
          box-sizing: border-box;
        }
        textarea:focus {
          outline: 2px solid var(--primary);
        }
        button.submit {
          display: block;
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          background: var(--primary);
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        button.submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        button.submit:not(:disabled):hover {
          background: darken(var(--primary),10%);
        }
        .error {
          color: var(--error);
          margin-top: 0.5rem;
          text-align: center;
        }
        pre {
          background: var(--input);
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          color: var(--success);
          font-family: monospace;
          margin-top: 1rem;
        }
        /* basic syntax highlight */
        pre span.keyword { color: #ff79c6 }
        pre span.string  { color: #f1fa8c }
        pre span.comment { color: #6272a4 }
      `}</style>
      <div className="wrapper">
        <div className="card">
          <button className="toggle" onClick={() => set_dark(!dark)}>
            {dark ? <FiSun /> : <FiMoon />}
          </button>
          <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>sybau uploader</h1>
          <form onSubmit={submit}>
            <textarea
              rows={8}
              placeholder="paste script or URL here"
              value={script}
              onChange={e => set_script(e.target.value)}
            />
            {error && <div className="error">{error}</div>}
            <button className="submit" type="submit" disabled={loading}>
              {loading ? 'uploading...' : 'upload'}
            </button>
          </form>
          {output && (
            <pre>
              {output.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {'\n'}
                </span>
              ))}
            </pre>
          )}
        </div>
      </div>
    </>
  )
}
