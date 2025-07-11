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
        body: JSON.stringify({ script })
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
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-xl bg-input p-8 rounded-2xl shadow-2xl space-y-6">
        <h1 className="text-3xl md:text-4xl text-center font-bold text-primary">sybau uploader</h1>

        <form onSubmit={submit} className="space-y-4">
          <textarea
            value={script}
            onChange={e => set_script(e.target.value)}
            rows={6}
            placeholder="Paste script or URL here"
            className="w-full p-4 bg-bg rounded-lg text-fg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            disabled={loading}
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        {output && (
          <textarea
            readOnly
            value={output}
            onFocus={e => e.target.select()}
            rows={4}
            className="w-full p-4 bg-bg text-green-400 font-mono rounded-lg"
          />
        )}
      </div>
    </main>
  )
}
