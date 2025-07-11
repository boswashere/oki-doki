import { useState } from 'react'

export default function page() {
  const [script, set_script] = useState('')
  const [output, set_output] = useState('')
  const [error, set_error] = useState('')
  const [loading, set_loading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    set_loading(true)
    set_output('')
    set_error('')
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
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-950 text-white flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-3xl glass p-6 rounded-2xl backdrop-blur-md space-y-6 border border-white/10 shadow-xl animate-fade-in">
        <h1 className="text-3xl font-semibold text-center tracking-tight">upload script</h1>
        <textarea
          value={script}
          onChange={(e) => set_script(e.target.value)}
          rows={10}
          className="w-full p-4 rounded-xl bg-neutral-800/60 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 resize-none"
          placeholder="paste script here(can be urls such as pastebin)"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 active:scale-95 transition-transform text-white py-3 rounded-xl font-medium tracking-wide"
        >
          {loading ? 'uploading...' : 'upload'}
        </button>
        {output && (
          <div className="bg-neutral-800/70 p-4 rounded-xl text-sm break-words border border-neutral-700">
            {output}
          </div>
        )}
        {error && (
          <div className="bg-red-700/80 p-4 rounded-xl text-sm text-red-100 border border-red-900">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}
