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
    <div className="min-h-screen bg-gradient-conic from-primary via-accent to-secondary flex items-center justify-center p-6">
      <div className="w-full max-w-3xl glass p-8 space-y-6 animate-fade">
        <h1 className="text-5xl font-sans text-primary text-center neon-pink animate-pulse-neon">
          sybau uploader
        </h1>
        <form onSubmit={submit} className="space-y-4">
          <textarea
            value={script}
            onChange={(e) => set_script(e.target.value)}
            rows={10}
            placeholder="paste script here"
            className="w-full p-4 bg-darkgray rounded-2xl text-textLight placeholder-lightgray focus:ring-2 focus:ring-accent transition resize-none"
            disabled={loading}
          />
          {error && <div className="text-red-500 text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-2xl font-semibold hover:shadow-neon-pink active:scale-95 transition"
          >
            {loading ? 'uploading...' : 'upload'}
          </button>
        </form>
        {output && (
          <div className="pt-4">
            <input
              readOnly
              onFocus={(e) => e.target.select()}
              value={output}
              className="w-full p-4 bg-darkgray rounded-2xl font-mono text-textLight break-words select-all"
            />
          </div>
        )}
      </div>
    </div>
  )
}
